import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

// dashboard routes
import routes from "routes/dashboard.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";
import CustomLoader from "components/CustomLoader/CustomLoader";
import * as ApiRoleService from "services/api/ApiRoleService";
import ApiAccountService from "services/api/ApiAccountService";
import AuthService from "services/AuthService";
import RoleContext from "shared/RoleContext";
import AuthContext from "shared/AuthContext";
import { signOut } from "redux/actions";
import { connect } from "react-redux";

let ps;

const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/") {
        return <Route path={prop.path} component={prop.component} key={key} />;
      }
      return null;
    })}
    <Redirect from="/" to="/dashboard" />
  </Switch>
);

const useStyles = makeStyles(styles);
const useCustomStyles = makeStyles(_theme => ({
  pageContent: {
    padding: "0px",
    marginTop: "80px"
  },
  map: {
    height: "100%"
  }
}));

const Admin = ({ signOut, ...rest }) => {
  // styles
  const classes = useStyles();
  const customClasses = useCustomStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const image = bgImage;
  const color = "red";
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [roleLoading, setRoleLoading] = React.useState(true);
  const [roleData, setRoleData] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState(null);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  React.useEffect(() => {
    ApiRoleService.load().then(({ data }) => {
      if (data.code === "success") {
        setRoleLoading(false);
        setRoleData(data.data);
      }
    }).catch(e => {
      console.error(e);
      setRoleLoading(false);
      setRoleData({});
    });
    ApiAccountService.getCurrentAccount(AuthService.getAuthToken())
      .then(({ data }) => {
        if (data.code === "success") {
          setUserInfo(data.data);
        } else {
          signOut();
        }
      })
      .catch(e => {
        console.error(e);
        signOut();
      });
  }, [signOut]);

  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      if(mainPanel.current){
        ps = new PerfectScrollbar(mainPanel.current, {
          suppressScrollX: true,
          suppressScrollY: false
        });
        document.body.style.overflow = "hidden";
      }
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1 && typeof(ps) !== 'undefined') {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]); // mainPanel

  if (!roleData || !userInfo) {
    return <CustomLoader />;
  }

  return (
    <AuthContext.Provider value={userInfo}>
      <RoleContext.Provider value={roleData}>
      {
        !roleLoading &&

        <div className={classes.wrapper}>
          <Sidebar
            routes={routes}
            logoText={"Duocun"}
            logo={logo}
            image={image}
            handleDrawerToggle={handleDrawerToggle}
            open={mobileOpen}
            color={color}
            {...rest}
            />
          <div className={classes.mainPanel} ref={mainPanel}>
            <Navbar
              routes={routes}
              handleDrawerToggle={handleDrawerToggle}
              {...rest}
              />
            {getRoute() ? (
              <div className={customClasses.pageContent}>
                <div className={classes.container}>{switchRoutes}</div>
              </div>
            ) : (
              <div className={classes.map}>{switchRoutes}</div>
            )}
            {getRoute() ? <Footer /> : null}
          </div>
        </div>
    }
      </RoleContext.Provider>
    </AuthContext.Provider>
  );
};

Admin.propTypes = {
  signOut: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOut())
});

export default connect(
  null,
  mapDispatchToProps
)(Admin);
