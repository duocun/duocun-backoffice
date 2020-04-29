import React from "react";
import { Switch, Route } from "react-router-dom";
import MerchantsTablePage from "views/Merchants/MerchantsTablePage";
import MerchantsForm from "views/Merchants/MerchantsForm";
const MerchantsPage = () => {
  return (
    <Switch>
      <Route exact path="/merchants" component={MerchantsTablePage}></Route>
      <Route exact path="/merchants/:id" component={MerchantsForm}></Route>
    </Switch>
  );
};

export default MerchantsPage;
