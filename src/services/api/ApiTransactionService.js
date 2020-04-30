import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper/index";
export default {
  getTransactionList: (page, pageSize, search = "", sort = []) => {
    let query = {};
    if (!search) {
      query.query = buildPaginationQuery(page, pageSize, {}, [], sort);
    } else {
      const condition = {
        $or: [
          {
            fromId: search,
          },
          {
            toId: search,
          },
        ],
      };
      query.query = buildPaginationQuery(page, pageSize, condition, [], sort);
    }
    return ApiService.v2().get("transactions", query);
  },
  //   toggleFeature: productId => {
  //     return ApiService.v2().post("products/toggle-feature", {
  //       productId
  //     });
  //   },
  //   getProduct: id => {
  //     return ApiService.v2().get(`products/${id}`);
  //   },
  //   saveProduct: model => {
  //     model._id = model._id || "new";
  //     return ApiService.v2().post(`products/${model._id}`, model);
  //   }
};
