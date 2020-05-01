import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper/index";
export default {
  getAccountList: (page, pageSize, search = "", sort = []) => {
    let query = {};
    if (!search) {
      query.query = buildPaginationQuery(page, pageSize, {}, [], sort);
    } else {
      const condition = {
        username: {
          $regex: search,
        },
      };
      query.query = buildPaginationQuery(page, pageSize, condition, [], sort);
    }
    return ApiService.v2().get("accounts", query);
  },
  getAccountAllKeyword: (keyword = "") => {
    let query = {};
    const condition = {
      username: {
        $regex: keyword,
      },
    };
    query.keyword = query.query = buildPaginationQuery(
      null,
      null,
      condition,
      [],
      []
    );
    return ApiService.v2().get("accounts", query);
  },
  getAccountAllPhone: (phone) => {
    let query = {};
    const condition = {
      phone: {
        $regex: phone,
      },
    };
    query.keyword = query.query = buildPaginationQuery(
      null,
      null,
      condition,
      [],
      []
    );
    return ApiService.v2().get("accounts", query);
  },
};
