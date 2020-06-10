import ApiService from "services/api/ApiService";
import { buildQuery, buildPaginationQuery } from "helper/index";
export const OrderStatus = {
  BAD: 'B',          // client return, compansate
  DELETED: 'D',          // cancellation
  TEMP: 'T',             // generate a temp order for electronic order
  NEW: 'N',
  LOADED: 'L',           // The driver took the food from Merchant
  DONE: 'F',             // Finish delivery
  MERCHANT_CHECKED: 'MC'  // VIEWED BY MERCHANT
};
export default {
  getOrderList: (page, pageSize, search = "", sort = []) => {
    let query = {};
    if (!search) {
      const params = {
        status: {
          $nin: [OrderStatus.BAD, OrderStatus.DELETED, OrderStatus.TEMP],
        },
      }
      query.query = buildPaginationQuery(page, pageSize, params, [], sort);
    } else {
      const condition = {
        code: {
          $regex: search
        },
        status: {
          $nin: [OrderStatus.BAD, OrderStatus.DELETED, OrderStatus.TEMP]
        },
      };
      query.query = buildPaginationQuery(page, pageSize, condition, [], sort);
    }
    return ApiService.v2().get("orders", query);
  },

  getOrders: (page, pageSize, condition = {}, sort = []) => {
    let query = {};

    query.keyword = query.query = buildPaginationQuery(
      page,
      pageSize,
      condition,
      [],
      sort
    );
    return ApiService.v2().get("orders", query);
  },

  getOrderListByDate: (page, pageSize, search = "",startDate = new Date(), endDate = new Date(), sort = []) => {
    let query = {};
    if (!search) {
      query.query = buildPaginationQuery(page, pageSize, {pickupTime: "10:00", created: {$gte: startDate, $lte: endDate}}, [], sort);
    } else {
      const condition = {
        name: {
          $regex: search
        },
        pickupTime: "10:00",
        created: {$gte: startDate, $lte: endDate}
      };
      query.query = buildPaginationQuery(page, pageSize, condition, [], sort);
    }
    return ApiService.v2().get("orders", query);
  },
  getOrder: id => {
    return ApiService.v2().get(`orders/${id}`);
  },
  saveOrder: model => {
    model._id = model._id || "new";
    return ApiService.v2().post(`orders/${model._id}`, model);
  },
  updateOrder: model => {
    const data = {...model};
    delete data._id;
    return ApiService.v2().put(`orders/${model._id}`, {data});
  },
  removeOrder: id => {
    return ApiService.v2().delete(`orders/${id}`);
  },

  getDuplicates: (delivered) => {
    let query = {delivered};
    return ApiService.v2().get(`orders/duplicates`, query);
  },
  // return {markers: [{orderId, lat, lng, type, status, icon}], driverMap:{driverId:{driverId, driverName}} }
  getMapMarkers: (deliverDate) => {
    let query = {};
    const conditions = {deliverDate};
    query.query = buildQuery(conditions);
    return ApiService.v2().get("orders/map-markers", query);
  },
  splitOrder: (id, items) => {
    return ApiService.v2().put(`orders/splitOrder/${id}`, {items});
  },
  assign: (driverId, driverName, orderIds) => {
    return ApiService.v2().put(`orders/assign`, {driverId, driverName, orderIds});
  }
};
