import React from "react";
import { Switch, Route } from "react-router-dom";
import AssignmentPage from "./AssignmentPage";

const Assignment = () => {
  return (
    <Switch>
      <Route exact path="/assignment" component={AssignmentPage}></Route>
    </Switch>
  );
};

export default Assignment;
