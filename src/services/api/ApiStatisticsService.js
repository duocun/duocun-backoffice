import ApiService from "services/api/ApiService";

export default {
  getSummary: (startDate, endDate) => {
    let query = {startDate, endDate};
    return ApiService.v2().get("statistics/summary", query);
  },
  getSales: (startDate, endDate = null ) => {
    let query = {startDate, endDate};
    return ApiService.v2().get("statistics/sales", query);
  },
  getMerchantStatistic: (startDate, endDate) => {
    let query = {startDate, endDate};
    return ApiService.v2().get("statistics/merchant", query);
  },
  saveDriverStatistic: (deliverDate) => {
    let query = {deliverDate};
    return ApiService.v2().get("statistics/driver", query);
  },
  saveProductStatistic: (startDate, endDate) => {
    let query = {startDate, endDate};
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
