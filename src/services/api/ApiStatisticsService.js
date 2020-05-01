import ApiService from "services/api/ApiService";

export default {
  getSummary: (startDate, endDate) => {
    let query = {startDate, endDate};
    return ApiService.v2().get("statistics/summary", query);
  },
  getMerchantStatistic: (startDate, endDate) => {
    let query = {startDate, endDate};
    return ApiService.v2().get("statistics/merchant", query);
  },
  saveDriverStatistic: (startDate) => {
    let query = {startDate};
    return ApiService.v2().get("statistics/driver", query);
  },
  saveProductStatistic: (startDate, endDate) => {
    let query = {startDate, endDate};
    return ApiService.v2().get("statistics/product", query);
  }
};
