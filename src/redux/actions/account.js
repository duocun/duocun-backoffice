import ApiAccountService from "../../services/api/ApiAccountService";

export const loadAccountsAsync = (payload, option) => {
    return (dispatch) => {
    dispatch({ type: "LOAD_ACCOUNTS" });
    if(option === 'name'){
      ApiAccountService.getAccountAllKeyword(payload).then(res=>res.data).then(
        (res) => dispatch(setAccounts(res.data)),
        (err) => {throw err}
      ).catch(err=>{
        console.log(err)
      })
    }else if(option === 'phone' && payload.length >= 3){
      ApiAccountService.getAccountAllPhone(payload).then(res=>res.data).then(
        (res) => dispatch(setAccounts(res.data)),
        (err) => {throw err}
      ).catch(err=>{
        console.log(err)
      })
    }
  };
};

const setAccounts = (payload) => {
  return {
    type: "SET_ACCOUNTS",
    payload,
  };
};

// export const getOrdersAsync = d => {
//   const orderSvc = new OrderAPI();
//   const mm = d.getMonth() + 1;
//   const dd = d.getDate();
//   const yy = d.getFullYear();
//   const deliverDate = yy + '-' + (mm > 9 ? mm : '0' + mm) + '-' + (dd > 9 ? dd : '0' + dd);
//   return (dispatch) => {
//     const q = {
//       deliverDate, // 'YYYY-MM-DD' {deliverDate: {$gte: 'YYYY-MM-DD', $lte: '<Today>YYYY-MM-DD' }}
//       status: {
//         $nin: [OrderStatus.BAD, OrderStatus.DELETED, OrderStatus.TEMP]
//       }
//     };
//     return orderSvc.find(q).then(
//        orders => dispatch(loadOrders(orders)),
//     );
//   }
// }
