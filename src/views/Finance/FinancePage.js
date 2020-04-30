import React from "react";
import { Switch, Route } from "react-router-dom";
import FinanceTablePage from "./FinanceTablePage";

const Finance = () => {
  return (
    <Switch>
      <Route exact path="/finance" component={FinanceTablePage}></Route>
      {/* <Route exact path="/categories/:id" component={EditCategory}></Route> */}
    </Switch>
  );
};

export default Finance;
