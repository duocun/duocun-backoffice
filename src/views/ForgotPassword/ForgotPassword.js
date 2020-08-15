import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import { LockOutlined } from "@material-ui/icons";
import { Typography, Button } from "@material-ui/core";
import Alert from "components/CustomAlert/CustomAlert";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import ApiAccountService from "services/api/ApiAccountService";
import { connect } from "react-redux";
import AuthService from "services/AuthService";
import { signIn } from "redux/actions";

const ForgotPassword = ({ history, signIn }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const { t } = useTranslation();
  const [alert, setAlert] = useState(null);
  const classes = useStyles();
  const [processing, setProcessing] = useState(false);

  const handleSendCode = useCallback(() => {
    setProcessing(true);
    ApiAccountService.sendOtpCode(email)
      .then(({ data }) => {
        if (data.code === "success") {
          setAlert({
            severity: "info",
            message: t("Code was sent to email address"),
          });
          setCodeSent(true);
        } else {
          setAlert({
            severity: "error",
            message: t(data.message || "Code was not sent"),
          });
        }
      })
      .catch((e) => {
        setAlert({
          severity: "error",
          message: "Code was not sent",
        });
      }).finally(() => {
        setProcessing(false);
      });
  }, [email]);

  const handleLogin = useCallback(() => {
    ApiAccountService.verifyOtp(email, code)
      .then(({ data }) => {
        if (data.code === "success") {
          AuthService.login(data.token);
          signIn({ data: data.data });
        } else {
          setAlert({
            severity: "error",
            message: t(data.message || "Login failed"),
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setAlert({
          severity: "error",
          message: "Login failed",
        });
      })
      .finally(() => {
        setCodeSent(false);
        setProcessing(false);
      });
  }, [email, code]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t("Forgot Password")}
        </Typography>
        <form className={classes.form} novalidate>
          <Alert alert={alert} onClose={() => setAlert(null)}/>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={t("Email")}
            name="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
          {codeSent && (
            <React.Fragment>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="code"
                label={t("Code")}
                name="code"
                onChange={(e) => setCode(e.target.value)}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={processing}
                onClick={handleLogin}
              >
                {t("Log In")}
              </Button>
            </React.Fragment>
          )}
          {!codeSent && (
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={processing}
              onClick={handleSendCode}
            >
              {t("Send Code")}
            </Button>
          )}
          <Button
            type="button"
            fullWidth
            varaint="contained"
            className={classes.submit}
            onClick={history.goBack}
          >
            {t("Back")}
          </Button>
        </form>
      </div>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const mapStateToProps = (state) => ({
  isAuthorized: state.isAuthorized,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  signIn: () => dispatch(signIn()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPassword);
