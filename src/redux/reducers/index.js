import { combineReducers } from "redux";
import authReducer from "./auth";
import { orders, order, filterOrders, deliverDate, orderDate } from "./order";
import { transactions, transaction } from "./transaction";
import { account, loggedInAccount, accounts } from "./account";
import { statisticsSummary } from "./statistics";
import { drivers } from "./driver";
import { driverSummary } from "./statistics";

export default combineReducers({
  authReducer,
  orders,
  order,
  transactions,
  transaction,
  filterOrders,
  deliverDate,
  orderDate,
  account,
  loggedInAccount,
  accounts,
  statisticsSummary,
  drivers,
  driverSummary
});
