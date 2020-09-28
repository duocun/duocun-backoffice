import ApiService from "services/api/ApiService";
import { buildQuery, buildPaginationQuery } from "helper/index";


export default {
  
  // createPayment: data => {
  //   return ApiService.v2().post(`payments`, data);
  // },

  // fix payment
  fixSnappay: (paymentId, paymentMethod, amount) => {
    return ApiService.v1().post(`payments/snappay/notify`, { 
      out_order_no: paymentId, 
      payment_method: paymentMethod,
      trans_amount: amount,
      trans_status: 'SUCCESS'
    });
  },

  // updatePayment: model => {
  //   const data = { ...model };
  //   delete data._id;
  //   return ApiService.v1().put(`payments/${model._id}`, { data }); // note
  // },
  // removePayment: id => {
  //   return ApiService.v2().delete(`payments/${id}`);
  // },

};
