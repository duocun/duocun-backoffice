import ApiService from "services/api/ApiService";
import { buildQuery, buildPaginationQuery } from "helper/index";
export const OrderStatus = {
  BAD: "B", // client return, compansate
  DELETED: "D", // cancellation
  TEMP: "T", // generate a temp order for electronic order
  NEW: "N",
  LOADED: "L", // The driver took the food from Merchant
  DONE: "F", // Finish delivery
  MERCHANT_CHECKED: "MC" // VIEWED BY MERCHANT
};
export default {
  getOrderList: (page, pageSize, search = "", sort = []) => {
    let query = {};
    if (!search) {
      const params = {
        status: {
          $nin: [OrderStatus.BAD, OrderStatus.DELETED, OrderStatus.TEMP]
        }
      };
      query.query = buildPaginationQuery(page, pageSize, params, [], sort);
    } else {
      const condition = {
        code: {
          $regex: search
        },
        status: {
          $nin: [OrderStatus.BAD, OrderStatus.DELETED, OrderStatus.TEMP]
        }
      };
      query.query = buildPaginationQuery(page, pageSize, condition, [], sort);
    }
    return ApiService.v2().get("orders", query);
  },

  getOrders: (page, pageSize, condition = {}, sort = []) => {
    let query = {};

    query.query = buildPaginationQuery(page, pageSize, condition, [], sort);
    return ApiService.v2().get("orders", query);
  },

  getOrderListByDate: (
    page,
    pageSize,
    search = "",
    startDate = new Date(),
    endDate = new Date(),
    sort = []
  ) => {
    let query = {};
    if (!search) {
      query.query = buildPaginationQuery(
        page,
        pageSize,
        { pickupTime: "10:00", created: { $gte: startDate, $lte: endDate } },
        [],
        sort
      );
    } else {
      const condition = {
        name: {
          $regex: search
        },
        pickupTime: "10:00",
        created: { $gte: startDate, $lte: endDate }
      };
      query.query = buildPaginationQuery(page, pageSize, condition, [], sort);
    }
    return ApiService.v2().get("orders", query);
  },
  getOrder: id => {
    return ApiService.v2().get(`orders/${id}`);
  },
  createOrder: data => {
    return ApiService.v2().post(`orders`, data);
  },
  updateOrder: model => {
    const data = { ...model };
    delete data._id;
    return ApiService.v2().put(`orders/${model._id}`, { data });
  },
  removeOrder: id => {
    return ApiService.v2().delete(`orders/${id}`);
  },

  getDuplicates: delivered => {
    let query = { delivered };
    return ApiService.v2().get(`orders/duplicates`, query);
  },

  splitOrder: (id, items) => {
    return ApiService.v2().put(`orders/splitOrder/${id}`, { items });
  },
  getAssignments: deliverDate => {
    let query = {};
    const conditions = { deliverDate };
    query.query = buildQuery(conditions);
    return ApiService.v2().get(`orders/assignments`, query);
  },
  updateAssignments: (
    deliverDate,
    driverId,
    driverName,
    orderIds,
    orderIdMap,
    assignments
  ) => {
    return ApiService.v2().put(`orders/assignments`, {
      deliverDate,
      driverId,
      driverName,
      orderIds,
      orderIdMap,
      assignments
    });
  },
  getAutoRoutes: deliverDate => {
    // let query = {};
    // const conditions = {deliverDate};
    // query.query = buildQuery(conditions);
    return ApiService.v2().get(`orders/routes?deliverDate=${deliverDate}`);
  },
  getChargeFromOrderItems: (
    items, // IOrderItem[],
    overRangeCharge = 0
  ) => {
    let price = 0;
    let cost = 0;
    let tax = 0;

    items.forEach(x => {
      // IOrderItem
      price += x.price * x.quantity;
      cost += x.cost * x.quantity;
      tax += Math.ceil(x.price * x.quantity * x.taxRate) / 100;
    });

    const tips = 0;
    const groupDiscount = 0;
    const overRangeTotal = Math.round(overRangeCharge * 100) / 100;

    return {
      price: Math.round(price * 100) / 100,
      cost: Math.round(cost * 100) / 100,
      tips: Math.round(tips * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      overRangeCharge: overRangeTotal,
      deliveryCost: 0, // merchant.deliveryCost,
      deliveryDiscount: 0, // merchant.deliveryCost,
      groupDiscount, // groupDiscount,
      total:
        Math.round(
          (price + tax + tips - groupDiscount + overRangeTotal) * 100
        ) / 100
    };
  }
};
