import ApiService from "services/api/ApiService";

export default {
  getSummary: (startDate, endDate) => {
    let query = {startDate, endDate};
    return ApiService.v2().get("statistics/summary", query);
  },
  getSales: (deliverDate, orderDate = null ) => {
    let query = {deliverDate, orderDate};
    return ApiService.v2().get("statistics/sales", query);
  },
  getMerchantStatistic: (startDate, endDate) => {
    let query = {startDate, endDate};
    return ApiService.v2().get("statistics/merchant", query);
  },
  getDriverStatistic: (deliverDate) => {
    let query = {deliverDate};
    return ApiService.v2().get("statistics/driver", query);
  },
  getProductStatistic: (deliverDate) => {
    let query = {deliverDate};
    return ApiService.v2().get("statistics/product", query);
  },
  getOrderAnalytics: (startDate, endDate = null ) => {
    let query = {startDate, endDate};
    return ApiService.v2().get("statistics/order-analytics", query);
  },
  getProductAnalytics: (startDate, endDate = null ) => {
    let query = {startDate, endDate};
    return ApiService.v2().get("statistics/product-analytics", query);
  },
};
