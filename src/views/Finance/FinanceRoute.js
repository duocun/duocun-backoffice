import React from "react";
import { Switch, Route } from "react-router-dom";
import TransactionTablePage from "./TransactionTablePage";
import TransactionFormPage from "./TransactionFormPage";
import SalaryPage from "./SalaryPage";

// import {FinanceException} from "./FinanceException";

const Finance = () => {
  return (
    <Switch>
      <Route exact path="/finance/transactions" component={TransactionTablePage}></Route>
      <Route exact path="/finance/salary" component={SalaryPage}></Route>
      <Route exact path="/finance/transactions/:id" component={TransactionFormPage}></Route>
      {/* <Route exact path="/finance/exception" component={FinanceException}></Route> */}
    </Switch>
  );
};

export default Finance;
