import React from "react";
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
const useCustomStyles = makeStyles(theme => ({
  pageContent: {
    padding: '0px',
    marginTop: '80px'
  },
  map:{
    height: '100%'
  }
}));


export default function Admin({ ...rest }) {
  // styles
  const classes = useStyles();
  const customClasses = useCustomStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const image = bgImage;
  const color = "red";
  const [mobileOpen, setMobileOpen] = React.useState(false);
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
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);
  
  return (
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
        {/* {getRoute() ? <Footer /> : null} */}
      </div>
    </div>
  );
}
