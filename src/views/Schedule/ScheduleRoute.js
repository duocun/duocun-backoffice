import React from "react";
import { Switch, Route } from "react-router-dom";
import ScheduleList from "./ScheduleList";
import ScheduleEdit from "./ScheduleEdit/ScheduleEdit";

const ScheduleRoute = () => (
  <Switch>
    <Route exact path="/schedules/:id" component={ScheduleEdit}></Route>
    <Route exact path="/schedules" component={ScheduleList}></Route>
  </Switch>
);

export default ScheduleRoute;
