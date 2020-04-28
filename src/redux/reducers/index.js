import { combineReducers } from "redux";
import authReducer from "./auth";
import { orders, order, filterOrders } from "./order";

export default combineReducers({
  authReducer,
  orders,
  order,
  filterOrders
});
