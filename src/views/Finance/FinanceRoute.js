import React from "react";
import { Switch, Route } from "react-router-dom";
import TransactionTablePage from "./TransactionTablePage";
import TransactionFormPage from "./TransactionFormPage";
import SalaryTablePage from "./SalaryTablePage";
import SalaryFormPage from "./SalaryFormPage";

// import {FinanceException} from "./FinanceException";

const Finance = () => {
  return (
    <Switch>
      <Route exact path="/finance/transactions" component={TransactionTablePage}></Route>
      <Route exact path="/finance/salary" component={SalaryTablePage}></Route>
      <Route exact path="/finance/salary/:id" component={SalaryFormPage}></Route>
      <Route exact path="/finance/transactions/:id" component={TransactionFormPage}></Route>
      {/* <Route exact path="/finance/exception" component={FinanceException}></Route> */}
    </Switch>
  );
};

export default Finance;
