import React from "react";
import { Switch, Route } from "react-router-dom";
import ListAccount from "views/Accounts/ListAccount";
import AccountForm from "views/Accounts/AccountForm";
const AccountPage = () => {
  return (
    <Switch>
      <Route exact path="/accounts" component={ListAccount}></Route>
      <Route exact path="/accounts/:id" component={AccountForm}></Route>
    </Switch>
  );
};

export default AccountPage;
