import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper/index";
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
  }
};