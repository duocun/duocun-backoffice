import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper/index";
export default {
  getTransactionList: (page, pageSize, accountId = "", startDate = new Date(), endDate = new Date(), sort = []) => {
    let query = {};
    if (!accountId) {
      // const condition={
      //   created: {$gte: startDate, $lte: endDate}
      // }
      const condition = {
        $or: [
          {
            fromId: accountId,
          },
          {
            toId: accountId,
          },
        ],
        status: { $nin: ['bad', 'tmp'] }
      };
      query.query = buildPaginationQuery(page, pageSize, condition, [], sort);
    } else {
      const condition = {
        $or: [
          {
            fromId: accountId,
          },
          {
            toId: accountId,
          },
        ],
        status: { $nin: ['bad', 'tmp'] }
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


  createTransaction: model => {
    return ApiService.v2().post(`Transactions/`, model);
  },
  updateSalary: model => {
    return ApiService.v2().put(`Transactions/salary`, model);
  },
  updateTransactions: accountId => {
    return ApiService.v2().put(`Transactions/?accountId=${accountId}`);
  }
};
