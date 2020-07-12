export const OrderStatus = {
  BAD: 'B',          // client return, compansate
  DELETED: 'D',          // cancellation
  TEMP: 'T',             // generate a temp order for electronic order
  NEW: 'N',
  LOADED: 'L',           // The driver took the food from Merchant
  DONE: 'F',             // Finish delivery
  MERCHANT_CHECKED: 'MC'  // VIEWED BY MERCHANT
};

export const loadOrders = payload => {
  return {
    type: 'SET_ORDERS',
    payload
  }
}
export const loadFilterOrders = payload => {
  return {
    type: 'LOAD_FILTER_ORDERS',
    payload
  }
}

// payload --- deliverDate string
export const setDeliverDate = payload => ({
  type: 'SET_DELIVER_DATE',
  payload
})

// payload --- order created date string
export const setOrderDate = payload => ({
  type: 'SET_ORDER_DATE',
  payload
})

// payload --- order object
export const selectOrder = payload => ({
  type: 'SELECT_ORDER',
  payload
})

// async

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