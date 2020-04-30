import { combineReducers } from "redux";
import authReducer from "./auth";
import { orders, order, filterOrders } from "./order";
import { accounts } from "./account";

export default combineReducers({
  authReducer,
  orders,
  order,
  filterOrders,
  accounts
});
