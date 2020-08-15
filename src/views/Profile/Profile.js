import React, { useState, useContext, useCallback } from "react";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem.js";
import { Box, Card, Button } from "@material-ui/core";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";
import { useTranslation } from "react-i18next";
import Alert from "components/CustomAlert/CustomAlert";
import AuthContext from "shared/AuthContext";
import CustomTextField from "components/CustomInput/CustomTextField";
import SaveIcon from "@material-ui/icons/Save";
import ApiAccountService from "services/api/ApiAccountService";

const isValid = (model) => {
  if (!model.username) {
    return { isValid: false, message: "Username field is required" };
  }
  if (!model.email) {
    return { isValid: false, message: "Email field is required" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(model.email)) {
    return { isValid: false, message: "Email is invalid" };
  }
  if (model.passwordRaw) {
    if (model.passwordRaw.length < 6) {
      return { isValid: false, message: "Password is too short" };
    }
    if (model.passwordRaw != model.passwordConfirm) {
      return { isValid: false, message: "Please confirm your password again" };
    }
  }
  return { isValid: true };
};

const Profile = ({ history }) => {
  const { t } = useTranslation();
  const [alert, setAlert] = useState(null);
  const [processing, setProcessing] = useState(false);
  const user = useContext(AuthContext);
  const [model, setModel] = useState({
    ...user,
    password: "",
    passwordConfirm: "",
  });
  const handleSave = useCallback(() => {
    const validation = isValid(model);
    if (!validation.isValid) {
      setAlert({ severity: "error", message: validation.message });
      return;
    }
    setProcessing(true);
    ApiAccountService.saveAccount(model)
      .then(({ data }) => {
        if (data.code === "success") {
          window.location.reload();
        } else {
          setAlert({
            severity: "error",
            message: t(data.message || "Save failed"),
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setAlert({ severity: "error", message: t("Save failed") });
      })
      .finally(() => {
        setProcessing(false);
      });
  }, [model]);
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary">
            <h4>{t("My Profile")}</h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                <Alert alert={alert} onClose={() => setAlert(null)} />
              </GridItem>
              <GridItem xs={12} container>
                <GridItem xs={12} md={6} lg={4}>
                  <CustomTextField
                    label="Name"
                    value={model.username}
                    onChange={(value) => {
                      setModel({ ...model, username: value });
                    }}
                  />
                </GridItem>
                <GridItem xs={12} md={6} lg={4}>
                  <CustomTextField
                    label="Email"
                    type="email"
                    value={model.email}
                    onChange={(value) => {
                      setModel({ ...model, email: value });
                    }}
                  />
                </GridItem>
                <GridItem xs={12} md={6} lg={4}>
                  <CustomTextField
                    label="Phone"
                    value={model.phone}
                    onChange={(value) => {
                      setModel({ ...model, phone: value });
                    }}
                  />
                </GridItem>
                <GridItem xs={12} md={6} lg={4}>
                  <CustomTextField
                    label="Password"
                    type="password"
                    value={model.passwordRaw}
                    onChange={(value) => {
                      setModel({ ...model, passwordRaw: value });
                    }}
                  />
                </GridItem>
                <GridItem xs={12} md={6} lg={4}>
                  <CustomTextField
                    label="Password Confirm"
                    type="password"
                    value={model.passwordConfirm}
                    onChange={(value) =>
                      setModel({ ...model, passwordConfirm: value })
                    }
                  />
                </GridItem>
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter>
            <GridItem xs={12} container direction="row-reverse">
              <Box>
                <Button variant="contained" onClick={history.goBack}>
                  {t("Back")}
                </Button>
              </Box>
              <Box mr={2}>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={processing}
                  onClick={handleSave}
                >
                  <SaveIcon />
                  {t("Save")}
                </Button>
              </Box>
            </GridItem>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

export default Profile;
