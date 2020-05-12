import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper/index";

export default {
  getStockList: (page, pageSize, search = "", params = null, sort = []) => {
    let query = {};
    let condition;
    if (!search) {
      condition = params && typeof params === "object" ? params : {};
    } else {
      condition =
        params && typeof params === "object"
          ? {
              ...params,
              name: {
                $regex: search
              }
            }
          : {
              name: {
                $regex: search
              }
            };
    }
    condition = { ...condition };
    // show only groceries
    condition.type = "G";
    // show only active products
    condition.status = "A";
    // stock disabled
    if (condition["stock.enabled"] === false) {
      const enabled = condition["stock.enabled"];
      delete condition["stock.enabled"];
      condition["$or"] = [
        ...(condition["$or"] || []),
        {
          stock: { $exists: false }
        },
        { "stock.enabled": enabled }
      ];
    }
    query.query = buildPaginationQuery(page, pageSize, condition, [], sort);
    return ApiService.v2().get("productStock", query);
  },
  toggleStockEnabled: product => {
    return ApiService.v2().post(
      `productStock/toggleStockEnabled/${product._id}`
    );
  },
  toggleAllowNegative: product => {
    return ApiService.v2().post(
      `productStock/toggleAllowNegative/${product._id}`
    );
  },
  setQuantity: (product, quantity) => {
    return ApiService.v2().post(`productStock/setQuantity/${product._id}`, {
      quantity
    });
  }
};
