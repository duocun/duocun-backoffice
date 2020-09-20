import React from "react";
import { Switch, Route } from "react-router-dom";
import AccountTablePage from "views/Accounts/AccountTablePage";
import EditAccount from "views/Accounts/EditAccount/EditAccount";

const AccountsRoute = () => {
  return (
    <Switch>
      <Route exact path="/accounts" component={AccountTablePage}></Route>
      <Route exact path="/accounts/:id" component={EditAccount}></Route>
    </Switch>
  );
};

export default AccountsRoute;
