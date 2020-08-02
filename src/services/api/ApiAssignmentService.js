import ApiService from "services/api/ApiService";
import { buildQuery, buildPaginationQuery } from "helper/index";
export const AssignmentStatus = {
  BAD: 'B',          // client return, compansate
  DELETED: 'D',          // cancellation
  TEMP: 'T',             // generate a temp assignments for electronic assignments
  NEW: 'N',
  LOADED: 'L',           // The driver took the food from Merchant
  DONE: 'F',             // Finish delivery
  MERCHANT_CHECKED: 'MC'  // VIEWED BY MERCHANT
};
export default {
  getAssignmentList: (page, pageSize, search = "", sort = []) => {
    let query = {};
    if (!search) {
      const params = {
        status: {
          $nin: [AssignmentStatus.BAD, AssignmentStatus.DELETED, AssignmentStatus.TEMP],
        },
      }
      query.query = buildPaginationQuery(page, pageSize, params, [], sort);
    } else {
      const condition = {
        code: {
          $regex: search
        },
        status: {
          $nin: [AssignmentStatus.BAD, AssignmentStatus.DELETED, AssignmentStatus.TEMP]
        },
      };
      query.query = buildPaginationQuery(page, pageSize, condition, [], sort);
    }
    return ApiService.v2().get("assignments", query);
  },

//   getAssignments: (page, pageSize, condition = {}, sort = []) => {
//     let query = {};

//     query.query = buildPaginationQuery(
//       page,
//       pageSize,
//       condition,
//       [],
//       sort
//     );
//     const conditions = {deliverDate};
//     query.query = buildQuery(conditions);
//     return ApiService.v2().get("assignments", query);
//   },

  getAssignments: (conditions) => {
    let query = {};
    query.query = buildQuery(conditions);
    return ApiService.v2().get(`assignments`, query);
  },

  getAssignment: id => {
    return ApiService.v2().get(`assignments/${id}`);
  },

  createAssignment: data => {
    return ApiService.v2().post(`assignments`, data);
  },

  updateAssignments: (deliverDate, assignments) => {
    return ApiService.v2().put(`assignments`, {deliverDate, assignments});
  },

  updateAssignment: model => {
    const data = {...model};
    delete data._id;
    return ApiService.v2().put(`assignments/${model._id}`, {data});
  },

  removeAssignment: id => {
    return ApiService.v2().delete(`assignments/${id}`);
  },


  getAutoRoutes: (deliverDate) => {
    // let query = {};
    // const conditions = {deliverDate};
    // query.query = buildQuery(conditions);
    return ApiService.v2().get(`assignments/routes?deliverDate=${deliverDate}`);
  },

  getChargeFromAssignmentItems: (
    items, // IAssignmentItem[],
    overRangeCharge = 0
  ) => {
    let price = 0;
    let cost = 0;
    let tax = 0;
  
    items.forEach((x) => { // IAssignmentItem
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
      total: Math.round((price + tax + tips - groupDiscount + overRangeTotal)*100)/100
    };
  }
};
