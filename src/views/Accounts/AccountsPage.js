import React from "react";
import { Switch, Route } from "react-router-dom";
import AccountsTablePage from "views/Accounts/AccountsTablePage";
import AccountsForm from "views/Accounts/AccountsForm";
const AccountsPage = () => {
  return (
    <Switch>
      <Route exact path="/accounts" component={AccountsTablePage}></Route>
      <Route exact path="/accounts/:id" component={AccountsForm}></Route>
    </Switch>
  );
};

export default AccountsPage;
