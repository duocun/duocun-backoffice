import * as moment from "moment";

export const deliverDate = (state = moment().format("YYYY-MM-DD"), action) => {
  if (action && action.type === "SET_DELIVER_DATE") {
    return action.payload;
  }
  return state;
};

export const orderDate = (state = moment().format("YYYY-MM-DD"), action) => {
  if (action && action.type === "SET_ORDER_DATE") {
    return action.payload;
  }
  return state;
};

export const orders = (state = [], action) => {
  if (action && action.type === "SET_ORDERS") {
    return action.payload;
  }
  return state;
};

export const order = (state = {}, action) => {
  if (action && action.type === "SELECT_ORDER") {
    return action.payload;
  }
  return state;
};

export const filterOrders = (state = {}, action) => {
  if (action && action.type === "LOAD_FILTER_ORDERS") {
    return action.payload;
  }
  return state;
};
