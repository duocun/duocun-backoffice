import React from "react";
import { Switch, Route } from "react-router-dom";
import DriverSummaryPage from "views/Dashboard/DriverSummaryPage";
import OrderSummaryPage from "views/Dashboard/OrderSummaryPage";
import Dashboard from "views/Dashboard/Dashboard";

const DashboardRoute = () => {
  return (
    <Switch>
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/dashboard/order" component={OrderSummaryPage} />
      <Route exact path="/dashboard/pickup" component={DriverSummaryPage} />
    </Switch>
  );
};

export default DashboardRoute;
