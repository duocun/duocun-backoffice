import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import { signIn } from "redux/actions";
import {setLoggedInAccount} from "redux/actions/account";
import AuthService from "services/AuthService";
import ApiAuthService from 'services/api/ApiAuthService';
import Admin from "layouts/Admin.js";
import Login from "views/Login/Login.js";
const history = createBrowserHistory({
  basename: "/" // "/duocun-backoffice"
});



const Root = ({setLoggedInAccount}) => {
  const [isAuthorized, setIsAuthorized] = useState(AuthService.isLoggedIn());

  useEffect(() => {
    ApiAuthService.getCurrentAccount().then(({data}) => {
      setLoggedInAccount(data.data);
      if(AuthService.isAdmin(data.data) || AuthService.isMerchant(data.data)){
        setIsAuthorized(isAuthorized);
      }else{
        setIsAuthorized(false);
      }
    });
  }, []);

  useEffect(() => {
    if (AuthService.isLoggedIn()) {
      signIn();
    }
  }, []);

  return isAuthorized ? (
    <Router history={history}>
      <Switch>
        <Route path="/" component={Admin} />
      </Switch>
    </Router>
  ) : (
    <Router history={history}>
      <Switch>
        <Route path="/login" component={Login} />
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
};

Root.propTypes = {
  isAuthorized: PropTypes.bool,
  signIn: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    // isAuthorized: state.isAuthorized,
    loggedInAccount: state.loggedInAccount
  };
};

// const mapDispatchToProps = dispatch => ({
//   signIn: () => dispatch(signIn())
// });

export default connect(
  mapStateToProps,
  { signIn, setLoggedInAccount }
)(Root);
