import React from "react";
import { Switch, Route } from "react-router-dom";
import DriverSummaryPage from "views/Dashboard/DriverSummaryPage";
import OrderAnalytics from "views/Dashboard/OrderAnalytics";
import ProductAnalytics from "views/Dashboard/ProductAnalytics";
import SalesPage from "views/Dashboard/SalesPage";
import ProductsPage from "views/Dashboard/ProductsPage";
import Dashboard from "views/Dashboard/Dashboard";

const DashboardRoute = () => {
  return (
    <Switch>
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/dashboard/pickup" component={DriverSummaryPage} />
      <Route exact path="/dashboard/sales" component={SalesPage} />
      <Route exact path="/dashboard/products" component={ProductsPage} />
      <Route exact path="/dashboard/order-analytics" component={OrderAnalytics} />
      <Route exact path="/dashboard/product-analytics" component={ProductAnalytics} />
    </Switch>
  );
};

export default DashboardRoute;
