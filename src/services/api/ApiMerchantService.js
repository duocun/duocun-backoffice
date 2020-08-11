import ApiService from "services/api/ApiService";
import { buildQuery, buildPaginationQuery } from "helper/index";
export default {
  getMerchantList: (page, pageSize, search = "", sort = []) => {
    let query = {};
    if (!search) {
      query.query = buildPaginationQuery(page, pageSize, {}, [], sort);
    } else {
      const condition = {
        name: {
          $regex: search
        }
      };
      query.query = buildPaginationQuery(page, pageSize, condition, [], sort);
    }
    return ApiService.v2().get("merchants", query);
  },
  createMerchant: (merchantData = {}) => {
    return ApiService.v2().post("merchants", merchantData);
  },
  getMerchants: conditions => {
    let query = {};
    query.query = buildQuery(conditions);
    return ApiService.v2().get("merchants", query);
  }
};
