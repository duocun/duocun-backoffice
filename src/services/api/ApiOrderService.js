import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper/index";
export default {
  getOrderList: (page, pageSize, search = "", sort = []) => {
    let query = {};
    if (!search) {
      query.query = buildPaginationQuery(page, pageSize, {pickupTime: "10:00"}, [], sort);
    } else {
      const condition = {
        name: {
          $regex: search
        },
        pickupTime: "10:00"
      };
      query.query = buildPaginationQuery(page, pageSize, condition, [], sort);
    }
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
  }
};
