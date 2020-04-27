import React from "react";
import { Switch, Route } from "react-router-dom";
import AccountList from "views/Accounts/AccountList";
import AccountForm from "views/Accounts/AccountForm";
const AccountPage = () => {
  return (
    <Switch>
      <Route exact path="/accounts" component={AccountList}></Route>
      <Route exact path="/accounts/:id" component={AccountForm}></Route>
    </Switch>
  );
};

export default AccountPage;