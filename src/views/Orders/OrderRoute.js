import React from "react";
import { Switch, Route } from "react-router-dom";
import OrderTablePage from "views/Orders/OrderTablePage";
import OrderFormPage from "views/Orders/OrderFormPage";

const OrderRoute = () => {
  return (
    <Switch>
      <Route exact path="/orders/:id" component={OrderFormPage} />
      <Route exact path="/orders" component={OrderTablePage} />
    </Switch>
  );
};

export default OrderRoute;
