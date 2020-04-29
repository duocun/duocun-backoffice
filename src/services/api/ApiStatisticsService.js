import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper/index";
export default {

  getOrderSummary:(startDate,endDate)=>{
    return ApiService.v2().get("Statistics/summary?startDate=" + startDate + "&endDate=" + endDate);
  }
};
