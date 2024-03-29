import React from "react";
import { Switch, Route } from "react-router-dom";
import DriverSummaryPage from "views/Dashboard/DriverSummaryPage";
import DriverByOrderSummaryPage from "views/Dashboard/DriverByOrderSummaryPage";
import SalarySummaryPage from "views/Dashboard/SalarySummaryPage";
import ProductSummaryPage from "views/Dashboard/ProductSummaryPage";
import OrderSummaryPage from "views/Dashboard/OrderSummaryPage";
import OrderAnalytics from "views/Dashboard/OrderAnalytics";
import ProductAnalytics from "views/Dashboard/ProductAnalytics";
import SalesPage from "views/Dashboard/SalesPage";
import Dashboard from "views/Dashboard/Dashboard";

const DashboardRoute = () => {
  return (
    <Switch>
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/dashboard/pickup/:id" component={DriverSummaryPage} />
      <Route exact path="/dashboard/pickup-by-order/:id" component={DriverByOrderSummaryPage} />
      <Route exact path="/dashboard/salary" component={SalarySummaryPage} />
      <Route
        exact
        path="/dashboard/productSummary"
        component={ProductSummaryPage}
      />
      <Route exact path="/dashboard/sales" component={SalesPage} />
      <Route
        exact
        path="/dashboard/order-summary"
        component={OrderSummaryPage}
      />
      <Route
        exact
        path="/dashboard/order-analytics"
        component={OrderAnalytics}
      />
      <Route
        exact
        path="/dashboard/product-analytics"
        component={ProductAnalytics}
      />
    </Switch>
  );
};

export default DashboardRoute;
