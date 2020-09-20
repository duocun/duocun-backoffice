import React from "react";
import { Switch, Route } from "react-router-dom";
import OrderMapPage from "views/Maps/OrderMapPage";

const MapRoute = () => {
  return (
    <Switch>
      {/* <Route exact path="/orders/:id" component={MapFormPage} /> */}
      <Route exact path="/maps" component={OrderMapPage} />
    </Switch>
  );
};

export default MapRoute;
