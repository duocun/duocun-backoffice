import React from "react";
import { Switch, Route } from "react-router-dom";
import ListProducts from "views/Products/ListProducts";
import EditProduct from "views/Products/EditProduct";

const Products = () => {
  return (
    <Switch>
      <Route exact path="/products/:id" component={EditProduct} />
      <Route exact path="/products" component={ListProducts} />
    </Switch>
  );
};

export default Products;
