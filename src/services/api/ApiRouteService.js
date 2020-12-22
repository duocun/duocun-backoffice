import ApiService from "services/api/ApiService";

export default {
  getRoutesByDriverAndDeliverDate: (driverId, deliverDate) => {
    const query = { driverId, deliverDate };
    return ApiService.v1().get('orders/routes', query);
  }
};