import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
// core components
import Button from "components/CustomButtons/Button.js";
import { useTranslation } from "react-i18next";
import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import AuthService from "services/AuthService";
import { signOut } from "redux/actions";
// socket
import Snackbar from '@material-ui/core/Snackbar';
import { useSnackbar } from 'helper/useSnackbar';
import ApiAuthService from 'services/api/ApiAuthService';
import { getSocket } from "services/SocketService";
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles(styles);

let socket = null;
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AdminNavbarLinks = ({ signOut }) => {
  const { t } = useTranslation();
  const history = useHistory({
    basename: "", // admin2 backoffice
  });
  const classes = useStyles();
  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);
  const snackbar = useSnackbar();
  // eslint-disable-next-line
  const {open: openToast, showSnackbar, hideSnackbar} = snackbar;
  const snackbarRef = React.useRef(snackbar);
  React.useEffect(() => {
    snackbarRef.current = snackbar;
  }, [snackbar])
  const handleClickNotification = React.useCallback((event) => {
    setOpenNotification((oldOpenNotification) => {
      if (oldOpenNotification && oldOpenNotification.contains(event.target)) {
        return null;
      } else {
        return event.currentTarget;
      }
    })

  }, []);
  const handleCloseNotification = React.useCallback(() => {
    setOpenNotification(null);
  }, []);
  const handleClickProfile = React.useCallback((event) => {
    setOpenProfile(oldOpenProfile => {
      if (oldOpenProfile && oldOpenProfile.contains(event.target)) {
        return null;
      } else {
        return event.currentTarget;
      }
    });
  }, []);
  const handleCloseProfile = React.useCallback(() => {
    setOpenProfile(null);
  }, []);
  const handleLogout = React.useCallback(() => {
    AuthService.logout();
    signOut();
    history.push("/login");
  }, [signOut, history]);

  React.useEffect(() => {
    const token = AuthService.getAuthToken();
    ApiAuthService.getCurrentUser(token).then(({ data }) => {
      if (data && data.code === "success") {
        // socket initialization
        if (socket === null) {
          console.log("now connecting to socket...");
          socket = getSocket();
          socket.emit('admin_init', {
            'id': data.data._id
          });

          socket.off('to_manager').on('to_manager', (data) => {
            snackbarRef.current.showSnackbar();
          });
        }
      }
    });
  }, []);

  useEffect(() => {
    console.log('open toast: ' + openToast);
  }, [openToast]);

  const handleCloseToast = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    hideSnackbar();
  }, [hideSnackbar]);

  return (
    <div>
      <div className={classes.alertBox}>
        <Snackbar open={openToast} autoHideDuration={6000} onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert onClose={handleCloseToast} severity="info">
            {t("Message arrived from customer!")}
          </Alert>
        </Snackbar>
      </div>
      <Button
        color={window.innerWidth > 959 ? "transparent" : "white"}
        justIcon={window.innerWidth > 959}
        simple={!(window.innerWidth > 959)}
        aria-label="Dashboard"
        className={classes.buttonLink}
      >
        <Dashboard className={classes.icons} />
        <Hidden mdUp implementation="css">
          <p className={classes.linkText}>Dashboard</p>
        </Hidden>
      </Button>
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openNotification ? "notification-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickNotification}
          className={classes.buttonLink}
        >
          <Notifications className={classes.icons} />
          <span className={classes.notifications}>5</span>
          <Hidden mdUp implementation="css">
            <p onClick={handleCloseNotification} className={classes.linkText}>
              Notification
            </p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openNotification)}
          anchorEl={openNotification}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openNotification }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="notification-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseNotification}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={classes.dropdownItem}
                    >
                      Mike John responded to your email
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={classes.dropdownItem}
                    >
                      You have 5 new tasks
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={classes.dropdownItem}
                    >
                      You{"'"}re now friend with Andrew
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={classes.dropdownItem}
                    >
                      Another Notification
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={classes.dropdownItem}
                    >
                      Another One
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={() => {
                        handleCloseProfile();
                        history.push("/profile");
                      }}
                      className={classes.dropdownItem}
                    >
                      {t("My Profile")}
                    </MenuItem>
                    <MenuItem
                      onClick={handleLogout}
                      className={classes.dropdownItem}
                    >
                      {t("Logout")}
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
    </div>
  );
};

AdminNavbarLinks.propTypes = {
  signOut: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(signOut()),
});

export default connect(
  null,
  mapDispatchToProps
)(AdminNavbarLinks);
