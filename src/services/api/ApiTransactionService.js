import ApiService from "services/api/ApiService";
import { buildPaginationQuery, buildQuery } from "helper/index";
export default {
  getTransactionList: (page, pageSize, condition, sort = []) => {
    let query = {};

    query.query = buildPaginationQuery(page, pageSize, condition, [], sort);

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

  getTransaction: (id) => {
    return ApiService.v2().get("Transactions/" + id);
  },
  createTransaction: model => {
    return ApiService.v2().post(`Transactions/`, model);
  },
  updateTransaction: model => {
    const data = {...model};
    delete data._id;
    return ApiService.v2().put(`Transactions/${model._id}`, data);
  },
  updateSalary: model => {
    return ApiService.v2().put(`Transactions/salary`, model);
  },
  updateTransactions: accountId => {
    return ApiService.v2().put(`Transactions/?accountId=${accountId}`);
  },
  deleteTransaction: id => {
    return ApiService.v2().delete(`Transactions/${id}`);
  },
  exportRevenue: (startDate, endDate) => {
    const query = {query: buildQuery({startDate, endDate})};
    return ApiService.v2().get("Transactions/revenue", query);
  }
};
