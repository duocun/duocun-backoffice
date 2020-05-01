import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper/index";
export default {
  getAccountList: (page, pageSize, {username, type}, sort = []) => {
    let query = {};
    let conditions = {};
    if (username) {
      conditions.username = {  $regex: username };
    }
    if (type) {
      conditions.type = type; 
    }
    query.query = buildPaginationQuery(page, pageSize, conditions, [], sort);
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
  createAccount: (accountData = {}) => {
    return ApiService.v2().post("accounts", accountData);
  },
};
