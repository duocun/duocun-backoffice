import React from "react";
import { Switch, Route } from "react-router-dom";
import ListCategories from "views/Categories/ListCategories";
import EditCategory from "./EditCategory";

// import EditCategory from "views/Categories/EditCategory";
const Attributes = () => {
  return (
    <Switch>
      <Route exact path="/categories" component={ListCategories}></Route>
      <Route exact path="/categories/:id" component={EditCategory}></Route>
    </Switch>
  );
};

export default Attributes;
