import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import { signIn } from "redux/actions";
import AuthService from "services/AuthService";
import Admin from "layouts/Admin.js";
import Login from "views/Login/Login.js";
import ForgotPassword from "views/ForgotPassword/ForgotPassword";

const history = createBrowserHistory({
  basename: "/", // admin2"/duocun-backoffice"
});
const Root = ({user, isAuthorized, signIn}) => {
  const [authorized, setIsAuthorized] = useState(AuthService.isLoggedIn());

  useEffect(() => {
    setIsAuthorized(isAuthorized);
  }, [isAuthorized]);

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  useEffect(() => {
    if (AuthService.isLoggedIn()) {
      signIn();
    }
  }, [signIn]);

  return authorized ? (
    <Router history={history}>
      <Switch>
        <Route path="/" component={Admin} />
      </Switch>
    </Router>
  ) : (
    <Router history={history}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
};

Root.propTypes = {
  isAuthorized: PropTypes.bool,
  signIn: PropTypes.func,
  user: PropTypes.any,
};

const mapStateToProps = ({ authReducer }) => {
  return {
    isAuthorized: authReducer.isAuthorized,
    user: authReducer.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  signIn: () => dispatch(signIn()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
