import React from "react";
import { Switch, Route } from "react-router-dom";
import {FinanceTablePage} from "./FinanceTablePage";
// import {FinanceException} from "./FinanceException";
import SalaryPage from "./SalaryPage";
const Finance = () => {
  return (
    <Switch>
      <Route exact path="/finance" component={FinanceTablePage}></Route>
      <Route exact path="/finance/salary" component={SalaryPage}></Route>
      {/* <Route exact path="/finance/exception" component={FinanceException}></Route> */}
    </Switch>
  );
};

export default Finance;
