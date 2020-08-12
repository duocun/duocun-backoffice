import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Box from "@material-ui/core/Box";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import Alert from "@material-ui/lab/Alert";
import Skeleton from "@material-ui/lab/Skeleton";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";

import CustomInput from "components/CustomInput/CustomInput";

import SaveIcon from "@material-ui/icons/Save";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";

import FlashStorage from "services/FlashStorage";
import ApiCategoryService from "services/api/ApiCategoryService";

const useStyles = makeStyles(() => ({
  textarea: {
    width: "100%"
  }
}));

const defaultModelState = {
  _id: "new",
  name: "",
  nameEN: "",
  description: "",
  descriptionEN: "",
  parentId: "0"
};

const EditCategorySkeleton = () => (
  <React.Fragment>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} align="center">
      <Skeleton width="70%" height={300} />
    </GridItem>
  </React.Fragment>
);

const EditCategory = ({ match, history }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  // states related to model
  const [model, setModel] = useState(defaultModelState);
  // const [categoryTreeData, setCategoryTreeData] = useState(defaultTreeState);
  const [loading, setLoading] = useState(false);
  // states related to processing
  const [alert, setAlert] = useState(
    FlashStorage.get("CATEGORY_ALERT") || { message: "", severity: "info" }
  );
  const [processing, setProcessing] = useState(false);

  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };

  const saveModel = () => {
    removeAlert();
    setProcessing(true);
    ApiCategoryService.saveCategory(model)
      .then(({ data }) => {
        if (data.code === "success") {
          const newAlert = {
            message: t("Saved successfully"),
            severity: "success"
          };
          if (model._id === "new") {
            FlashStorage.set("CATEGORY_ALERT", newAlert);
            history.push("../categories");
          } else {
            setAlert(newAlert);
            updateData();
          }
        } else {
          setAlert({
            message: t(data.message || "Save failed"),
            severity: "error"
          });
        }
      })
      .catch(e => {
        console.error(e);
        setAlert({
          message: t("Save failed"),
          severity: "error"
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  const updateData = () => {
    ApiCategoryService.getCategory(match.params.id)
      .then(({ data }) => {
        if (data.code === "success") {
          setModel(data.data);
        } else {
          setAlert({
            message: t("Data not found"),
            severity: "error"
          });
        }
      })
      .catch(e => {
        console.error(e);
        setAlert({
          message: t("Data not found"),
          severity: "error"
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    if (match.params.id && match.params.id !== "new") {
      updateData();
    } else if (match.params.id === "new") {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary">
            {loading && <h4>{t("Category")}</h4>}
            {!loading && (
              <h4>
                {model._id && model._id !== "new"
                  ? t("Edit Category") + ": " + model.name
                  : t("Add Category")}
              </h4>
            )}
          </CardHeader>
          <CardBody>
            <GridContainer>
              {!!alert.message && (
                <GridItem xs={12}>
                  <Alert severity={alert.severity} onClose={removeAlert}>
                    {alert.message}
                  </Alert>
                </GridItem>
              )}
              {loading && <EditCategorySkeleton />}
              {!loading && (
                <React.Fragment>
                  <GridItem xs={12} lg={6}>
                    <Box pb={2}>
                      <CustomInput
                        labelText={t("Category Name (Chinese)")}
                        id="category-name"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: model.name,
                          onChange: e => {
                            setModel({ ...model, name: e.target.value });
                          }
                        }}
                      />
                    </Box>
                  </GridItem>
                  <GridItem xs={12} lg={6}>
                    <Box pb={2}>
                      <CustomInput
                        labelText={t("Category Name (English)")}
                        id="category-name-english"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: model.nameEN,
                          onChange: e => {
                            setModel({ ...model, nameEN: e.target.value });
                          }
                        }}
                      />
                    </Box>
                  </GridItem>
                  <GridItem xs={12} lg={6}>
                    <Box py={2}>
                      <TextField
                        id="category-description"
                        label={t("Description (Chinese)")}
                        multiline
                        rowsMax={4}
                        onChange={e => {
                          setModel({ ...model, description: e.target.value });
                        }}
                        variant="outlined"
                        value={model.description}
                        className={classes.textarea}
                      />
                    </Box>
                  </GridItem>
                  <GridItem xs={12} lg={6}>
                    <Box py={2}>
                      <TextField
                        id="category-description-english"
                        label={t("Description (English)")}
                        multiline
                        rowsMax={4}
                        onChange={e => {
                          setModel({ ...model, descriptionEN: e.target.value });
                        }}
                        variant="outlined"
                        value={model.descriptionEN}
                        className={classes.textarea}
                      />
                    </Box>
                  </GridItem>
                  {/* <GridItem xs={12} container direction="row" justify="center">
                    <GridItem xs={12} lg={8}>
                      <Box p={4}>
                        <FormLabel component="legend">
                          {t("Parent Category")}
                        </FormLabel>
                        <CategoryTree
                          treeData={categoryTreeData}
                          selectedCategoryId={model.parentId}
                          checkDisable={({ categoryId }) =>
                            categoryId === model._id
                          }
                          onSelect={val =>
                            setModel({ ...model, parentId: val })
                          }
                        />
                      </Box>
                    </GridItem>
                  </GridItem> */}
                </React.Fragment>
              )}
              <GridItem xs={12} container direction="row-reverse">
                <Box>
                  <Button variant="contained" href="../categories">
                    <FormatListBulletedIcon />
                    {t("Back")}
                  </Button>
                </Box>
                <Box mr={2}>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={loading || processing || !model.name}
                    onClick={saveModel}
                  >
                    <SaveIcon />
                    {t("Save")}
                  </Button>
                </Box>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

EditCategory.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.object
};

export default EditCategory;
