import ApiAccountService from "../../services/api/ApiAccountService";

// export const loadAccountsSearchAsync = (payload, option) => {}

export const loadAccountsAsync = (page, pageSize, payload, option) => {
    return (dispatch) => {
    dispatch({ type: "LOAD_ACCOUNTS" });
    if(option === 'name'){
      ApiAccountService.getAccountAllKeyword(page, pageSize, payload).then(res=>res.data).then(
        (res) => dispatch(setAccounts(res.data)),
        (err) => {throw err}
      ).catch(err=>{
        console.log(err)
      })
    }else if(option === 'phone' && payload.length >= 3){
      ApiAccountService.getAccountAllPhone(page, pageSize, payload).then(res=>res.data).then(
        (res) => dispatch(setAccounts(res.data)),
        (err) => {throw err}
      ).catch(err=>{
        console.log(err)
      })
    }
  };
};

export const loadAccountsByTypeAsync = (payload) =>{
  return (dispatch) => {
    dispatch({ type: "LOAD_ACCOUNTS" });
      ApiAccountService.getAccountsByType(payload).then(res=>res.data).then(
        (res) => dispatch(setAccounts(res.data)),
        (err) => {throw err}
      ).catch(err=>{
        console.log(err)
      })
  };
}

export const setAccounts = (payload) => {
  return {
    type: "SET_ACCOUNTS",
    payload,
  };
};

export const setAccount = (payload) => {
  return {
    type: "SET_ACCOUNT",
    payload,
  };
};

export const setLoggedInAccount = (payload) => {
  return {
    type: "SET_LOGGED_IN_ACCOUNT",
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
