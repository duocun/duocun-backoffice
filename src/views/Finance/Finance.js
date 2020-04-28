import React from "react";
import { Switch, Route } from "react-router-dom";
import FinanceDetails from "./FinanceDetails";

const Finance = () => {
  return (
    <Switch>
      <Route exact path="/finance" component={FinanceDetails}></Route>
      {/* <Route exact path="/categories/:id" component={EditCategory}></Route> */}
    </Switch>
  );
};

export default Finance;
