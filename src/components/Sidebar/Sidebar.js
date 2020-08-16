/*eslint-disable*/
import React, { useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";
import RoleContext from "shared/RoleContext";
import AuthContext from "shared/AuthContext";

import styles from "assets/jss/material-dashboard-react/components/sidebarStyle.js";
import { ROLE_ENUM } from "models/account";

const useStyles = makeStyles(styles);

const hasRole = (currentUser, perm, rbacData) => {
  if (!perm) {
    return true;
  }
  if (!rbacData) {
    return false;
  }
  if (!currentUser || !currentUser.roles) {
    return false;
  }
  if (currentUser.roles.includes(Number(ROLE_ENUM.SUPER))) {
    return true;
  }
  let hasRole = true;
  if (perm.role) {
    hasRole = hasRole && currentUser.roles.includes(Number(perm.role));
  }
  if (perm.resource) {
    for (const r of currentUser.roles) {
      if (rbacData[r][perm.resource]) {
        return hasRole;
      }
    }
  }
  return false;
};

export default function Sidebar(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return window.location.href.indexOf(routeName) > -1 ? true : false;
  }
  const { color, logo, image, logoText, routes } = props;
  const rbacData = useContext(RoleContext);
  const currentUser = useContext(AuthContext);
  var links = (
    <List className={classes.list}>
      {routes
        .filter((prop) => !prop.hide)
        .map((prop, key) => {
          const isAllowed = hasRole(currentUser, prop.perm, rbacData);
          if (!isAllowed) {
            return null;
          }
          var activePro = " ";
          var listItemClasses;
          listItemClasses = classNames({
            [" " + classes[color]]: activeRoute(prop.path),
          });
          const whiteFontClasses = classNames({
            [" " + classes.whiteFont]: activeRoute(prop.path),
          });
          return (
            <NavLink
              to={prop.path}
              className={activePro + classes.item}
              activeClassName="active"
              key={key}
            >
              <ListItem button className={classes.itemLink + listItemClasses}>
                {typeof prop.icon === "string" ? (
                  <Icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: props.rtlActive,
                    })}
                  >
                    {prop.icon}
                  </Icon>
                ) : (
                  <prop.icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: props.rtlActive,
                    })}
                  />
                )}
                <ListItemText
                  primary={t(prop.name)}
                  className={classNames(classes.itemText, whiteFontClasses, {
                    [classes.itemTextRTL]: props.rtlActive,
                  })}
                  disableTypography={true}
                />
              </ListItem>
            </NavLink>
          );
        })}
    </List>
  );
  var brand = (
    <div className={classes.logo}>
      <NavLink
        to="/"
        className={classNames(classes.logoLink, {
          [classes.logoLinkRTL]: props.rtlActive,
        })}
      >
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </NavLink>
    </div>
  );
  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? "left" : "right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            <AdminNavbarLinks />
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={props.rtlActive ? "right" : "left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};
