import React from "react";
import { Switch, Route } from "react-router-dom";
import AccountTablePage from "views/Accounts/AccountTablePage";
import AccountsFormPage from "views/Accounts/AccountsFormPage";

const AccountsRoute = () => {
  return (
    <Switch>
      <Route exact path="/accounts" component={AccountTablePage}></Route>
      <Route exact path="/accounts/:id" component={AccountsFormPage}></Route>
    </Switch>
  );
};

export default AccountsRoute;
