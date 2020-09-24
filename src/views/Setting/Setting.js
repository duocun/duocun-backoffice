import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Box, Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";
import Alert from "components/CustomAlert/CustomAlert";
import CustomLoader from "components/CustomLoader/CustomLoader";
import CustomSelect from "components/CustomInput/SelectWithLabel";
import TextField from '@material-ui/core/TextField';
import { DEFAULT_MODEL } from "models/setting";
import * as ApiSettingService from "services/api/ApiSettingService";


const Setting = ({ history }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [alert, setAlert] = useState(null);

  const loadModel = useCallback(() => {
    ApiSettingService.load()
      .then(({ data }) => {
        if (data.code !== "success") {
          setAlert({ message: t("Cannot load data"), severity: "error" });
        } else {
          setModel(data.data);
        }
      })
      .catch((e) => {
        console.error(e);
        setAlert({ message: t("Cannot load data"), severity: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [t]);

  const saveModel = useCallback(
    (data) => {
      setProcessing(true);
      setAlert(null);
      ApiSettingService.save(data)
        .then(({ data }) => {
          if (data.code !== "success") {
            setAlert({ message: t("Save failed"), severity: "error" });
          } else {
            setAlert({ message: t("Saved successfully"), severity: "success" });
            setModel(data.data);
          }
        })
        .catch((e) => {
          console.error(e);
          setAlert({ message: t("Save failed"), severity: "error" });
        })
        .finally(() => {
          setProcessing(false);
        });
    },
    [t]
  );

  useEffect(() => loadModel(), [loadModel]);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary">
            <GridItem xs={12} container>
              <h4>{t("Setting")}</h4>
            </GridItem>
          </CardHeader>
          <CardBody>
            <GridContainer>
              {loading ? (
                <CustomLoader />
              ) : (
                <React.Fragment>
                  <GridItem xs={12}>
                    <Alert alert={alert} onClose={() => setAlert(null)} />
                  </GridItem>
                  <GridItem xs={12} md={6}>
                    <CustomSelect
                      label="Payment Method"
                      value={model.payment_method}
                      itemData={[
                        { text: "Snappay", value: "snappay" },
                        { text: "Alphapay", value: "alphapay" },
                      ]}
                      onChange={(value) =>
                        setModel({ ...model, payment_method: value })
                      }
                    />                    
                  </GridItem>
                  <GridItem xs = {12} md = {6}>
                    <TextField
                      id="welcome-message"
                      label={t('Welcome Message')}
                      value={model.welcome_message}
                      onChange={(e) =>
                        setModel({ ...model, welcome_message: e.target.value })
                      }
                      fullWidth
                    />
                  </GridItem>
                </React.Fragment>
              )}
            </GridContainer>
          </CardBody>
          <CardFooter>
            <GridItem xs={12} container direction="row-reverse">
              <Box>
                <Button variant="contained" onClick={history.goBack}>
                  <FormatListBulletedIcon />
                  {t("Back")}
                </Button>
              </Box>
              <Box mr={2}>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={processing}
                  onClick={() => saveModel(model)}
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

Setting.propTypes = {
  history: PropTypes.object,
};

export default Setting;
