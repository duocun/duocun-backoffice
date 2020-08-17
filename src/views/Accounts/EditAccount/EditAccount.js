import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import { DEFAULT_MODEL } from "models/account.js";
import ApiAccountService from "services/api/ApiAccountService";
import Alert from "components/CustomAlert/CustomAlert";
import FlashStorage from "services/FlashStorage";

const EMPTY_ALERT = { message: "", severity: "info" };

const EditAccount = ({ match, history }) => {
  const { t } = useTranslation();
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState(
    FlashStorage.get("ACCOUNT_ALERT") || EMPTY_ALERT
  );
  const loadModel = useCallback(async () => {
    const userId = match.params.id;
    if (userId && userId !== "new") {
      try {
        const accountData = await ApiAccountService.getAccount(userId);
        if (accountData && accountData.data.code === "success") {
          setModel(accountData.data.data);
        } else {
          setAlert({
            severity: "error",
            message: "Cannot load data" // t("Cannot load data")
          });
        }
      } catch (e) {
        console.error(e);
        setAlert({
          severity: "error",
          message: "Cannot load data" // t("Cannot load data")
        });
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [match]);

  const saveModel = useCallback(() => {
    const { id } = match.params;
    ApiAccountService.saveAccount(model)
      .then(({ data }) => {
        if (data.code === "success") {
          if (id && id === "new") {
            FlashStorage.set("ACCOUNT_ALERT", {
              severity: "info",
              message: t("Saved successfully")
            });
            history.goBack();
          } else {
            setAlert({
              severity: "info",
              message: t("Saved successfully")
            });
            setModel(data.data);
          }
        } else {
          setAlert({
            severity: "error",
            message: data.message || t("Save failed")
          });
        }
      })
      .catch(e => {
        console.error(e);
        setAlert({
          severity: "error",
          message: t("Save failed")
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  }, [model, history, match.params, t]);

  useEffect(() => {
    loadModel();
  }, [loadModel]);

  return (
    <GridContainer>
      <GridItem xs={12}>
        {
          !processing &&
        <Card>
          <CardHeader model={model} loading={loading} />
          <Alert alert={alert} onClose={() => setAlert(EMPTY_ALERT)} />
          <CardBody
            model={model}
            loading={loading}
            onChange={newModel => setModel(newModel)}
            />
          <CardFooter
            processing={false}
            onBack={history.goBack}
            onSave={saveModel}
            ></CardFooter>
        </Card>
        }
      </GridItem>
    </GridContainer>
  );
};

export default EditAccount;
