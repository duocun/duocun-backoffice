import React from "react";
import { Switch, Route } from "react-router-dom";
import ListCategories from "views/Categories/ListCategories";
import {CategoryFormPage} from "views/Categories/CategoryFormPage";

// import EditCategory from "views/Categories/EditCategory";
const Attributes = () => {
  return (
    <Switch>
      <Route exact path="/categories" component={ListCategories}></Route>
      <Route exact path="/categories/:id" component={CategoryFormPage}></Route>
    </Switch>
  );
};

export default Attributes;
