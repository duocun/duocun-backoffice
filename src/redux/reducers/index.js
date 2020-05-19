import { combineReducers } from "redux";
import authReducer from "./auth";
import { orders, order, filterOrders, deliverDate } from "./order";
import { loggedInAccount, accounts } from "./account";
import { statisticsSummary } from "./statistics";
import { drivers } from "./driver";
import { driverSummary } from "./statistics";

export default combineReducers({
  authReducer,
  orders,
  order,
  filterOrders,
  deliverDate,
  loggedInAccount,
  accounts,
  statisticsSummary,
  drivers,
  driverSummary
});
