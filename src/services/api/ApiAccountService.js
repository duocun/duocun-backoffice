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
    // let isNum = /^\d+$/.test(keyword);
    let query = {};
    let condition = {};
    // if (!isNum) {
    condition = {
      username: {
        $regex: keyword,
      },
    };
    // } else {
    //   condition = {
    //     phone: {
    //       $regex: keyword,
    //     },
    //   };
    // }
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
