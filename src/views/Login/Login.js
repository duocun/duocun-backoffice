import React from "react";
import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useTranslation } from "react-i18next";
import AuthService from "services/AuthService";
import ApiAuthService from "services/api/ApiAuthService";
import { signIn, signOut } from "redux/actions";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const Login = ({ signIn, history, isAuthorized }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failed, setFailed] = useState(false);

  const handleLogin = useCallback(() => {
    ApiAuthService.login(email, password)
      .then(({ data }) => {
        if (data.code === "success") {
          const tokenId = data.token;
          ApiAuthService.getCurrentUser(tokenId).then(({ data }) => {
            const account = data;
            if (AuthService.isAuthorized(account)) {
              AuthService.login(tokenId);
              signIn();
              history.push("/admin/dashboard");
            } else {
              if (isAuthorized) {
                signOut();
              }
              setFailed(true);
            }
          });
        } else {
          setFailed(true);
        }
      })
      .catch(e => {
        console.error(e);
        setFailed(true);
      });
  }, [email, password]);
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t("Sign In")}
        </Typography>
        <form className={classes.form} noValidate>
          {failed && (
            <Alert severity="error" onClose={() => setFailed(false)}>
              {t("Login failed")}
            </Alert>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={t("Email")}
            name="email"
            autoFocus
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={t("Password")}
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleLogin}
          >
            {t("Sign In")}
          </Button>
        </form>
      </div>
    </Container>
  );
};

Login.propTypes = {
  signIn: PropTypes.func,
  signOut: PropTypes.func,
  history: PropTypes.object,
  isAuthorized: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthorized: state.isAuthorized
});

const mapDispatchToProps = dispatch => ({
  signIn: () => dispatch(signIn()),
  signOut: () => dispatch(signOut())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
