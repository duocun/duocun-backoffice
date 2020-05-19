import React from "react";
import { Switch, Route } from "react-router-dom";
import EditPage from "views/Pages/EditPage";
import ListPages from "views/Pages/ListPages";

const Pages = () => {
  return (
    <Switch>
      <Route exact path="/pages" component={ListPages}></Route>
      <Route exact path="/pages/:id" component={EditPage}></Route>
    </Switch>
  );
};
export default Pages;
