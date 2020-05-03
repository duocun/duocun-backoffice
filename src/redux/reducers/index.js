import { combineReducers } from "redux";
import authReducer from "./auth";
import { orders, order, filterOrders } from "./order";
import { accounts } from "./account";
import { statisticsSummary } from "./statistics";
import { drivers } from "./driver";

export default combineReducers({
  authReducer,
  orders,
  order,
  filterOrders,
  accounts,
  statisticsSummary,
  drivers
});
