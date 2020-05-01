import React from "react";
import { Switch, Route } from "react-router-dom";
import DriverSummaryPage from "views/Dashboard/DriverSummaryPage";
import OrderSummaryPage from "views/Dashboard/OrderSummaryPage";
import Dashboard from "views/Dashboard/Dashboard";

const DashboardRoute = () => {
  return (
    <Switch>
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/dashboard/pickup" component={DriverSummaryPage} />
      <Route exact path="/dashboard/summary" component={OrderSummaryPage} />
    </Switch>
  );
};

export default DashboardRoute;
