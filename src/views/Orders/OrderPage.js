import React from "react";
import { Switch, Route } from "react-router-dom";
import OrderListPage from "views/Orders/OrderListPage";
// import OrderFormPage from "views/Orders/OrderFormPage";

const OrderPage = () => {
  return (
    <Switch>
      {/* <Route exact path="/orders/:id" component={OrderFormPage} /> */}
      <Route exact path="/orders" component={OrderListPage} />
    </Switch>
  );
};

export default OrderPage;