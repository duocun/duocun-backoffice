import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper/index";
export default {
  getTransactionList: (page, pageSize, search = "", startDate = new Date(), endDate = new Date(), sort = []) => {
    let query = {};
    if (!search) {
      // const condition={
      //   created: {$gte: startDate, $lte: endDate}
      // }
      const accountId = '5cae0a7d9687ac4a075e2f56';
      const condition = {
        $or: [
          {
            fromId: accountId,
          },
          {
            toId: accountId,
          },
        ],
      };
      query.query = buildPaginationQuery(page, pageSize, condition, [], sort);
    } else {

      const accountId = '5cae0a7d9687ac4a075e2f56';
      const condition = {
        $or: [
          {
            fromId: accountId,
          },
          {
            toId: accountId,
          },
        ],
        // created: {$gte: startDate, $lte: endDate}
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
