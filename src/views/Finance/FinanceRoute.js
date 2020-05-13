import React from "react";
import { Switch, Route } from "react-router-dom";
import {TransactionPage} from "./TransactionPage";
import {FinanceForm} from "./FinanceForm";

// import {FinanceException} from "./FinanceException";
import SalaryPage from "./SalaryPage";
const Finance = () => {
  return (
    <Switch>
      <Route exact path="/finance/transaction" component={TransactionPage}></Route>
      <Route exact path="/finance/salary" component={SalaryPage}></Route>
      <Route exact path="/finance/transaction/:id" component={FinanceForm}></Route>
      {/* <Route exact path="/finance/exception" component={FinanceException}></Route> */}
    </Switch>
  );
};

export default Finance;
