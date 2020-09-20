import ApiService from "services/api/ApiService";
// import { buildPaginationQuery } from "helper/index";
export default {
  getDriverList: () => {
    // let query = {};
    // const condition = {
    //   type: type,
    // };
    // query.keyword = query.query = buildPaginationQuery(
    //   null,
    //   null,
    //   condition,
    //   [],
    //   []
    // );
    return ApiService.v2().get("drivers");
  }
};
