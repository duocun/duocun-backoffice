import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Box from "@material-ui/core/Box";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";

import Skeleton from "@material-ui/lab/Skeleton";
import Alert from "@material-ui/lab/Alert";
import CustomInput from "components/CustomInput/CustomInput";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";

import FlashStorage from "services/FlashStorage";
import ApiOrderService from "services/api/ApiOrderService";
import CategoryTree from "views/Categories/CategoryTree";
import { groupAttributeData, getAllCombinations } from "helper/index";

const useStyles = makeStyles(() => ({
  textarea: {
    width: "100%"
  },
  select: {
    width: "100%",
    marginTop: 27
  },
  heading: {
    marginBottom: "0.5rem",
    size: "1.5rem",
    fontWeight: 600
  },
  table: {
    minWidth: 750
  },
  editingCell: {
    padding: "0 5px"
  },
  formControl: {
    display: "block"
  },
  formControlLabel: {
    marginTop: "1rem",
    marginBottom: "1rem",
    fontWeight: 600
  },
  formGroup: {
    border: "1px solid #eee",
    borderRadius: 5,
    padding: 5
  }
}));

const defaultOrderModelState = {
  _id: "new",
  name: "",
  nameEN: "",
  description: "",
  descriptionEN: "",
  price: 0,
  cost: 0,
  categoryId: "",
  stock: {
    enabled: false,
    quantity: 0,
    outofstockMessage: "",
    outofstockMessageEN: ""
  },
  attributes: [],
  combinations: []
};


const OrderFormPage = ({ match, history }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [model, setModel] = useState(defaultOrderModelState);
  const [categoryTreeData, setCategoryTreeData] = useState([]);
  const [attributes, setAttributes] = useState(defaultAttributesState);
  const [alert, setAlert] = useState(
    FlashStorage.get("PRODUCT_ALERT") || { message: "", severity: "info" }
  );

  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };

  const updatePage = () => {
    ApiOrderService.getOrder(match.params.id)
      .then(({ data }) => {
        if (data.success) {
          setModel({ ...model, ...data.data });
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

  const saveModel = () => {
    removeAlert();
    setProcessing(true);
    ApiOrderService.saveOrder(model)
      .then(({ data }) => {
        if (data.success) {
          const newAlert = {
            message: t("Saved successfully"),
            severity: "success"
          };
          if (model._id === "new") {
            FlashStorage.set("PRODUCT_ALERT", newAlert);
            history.push("../orders");
            return;
          } else {
            setAlert(newAlert);
            updatePage();
          }
        } else {
          setAlert({
            message: t("Save failed"),
            severity: "error"
          });
        }
        setProcessing(false);
      })
      .catch(e => {
        console.error(e);
        setAlert({
          message: t("Save failed"),
          severity: "error"
        });
        setProcessing(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    updatePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12} lg={8}>
        <Card>
          <CardHeader color="primary">
            {loading && <h4>{t("Order")}</h4>}
            {!loading && (
              <h4>
                {model._id && model._id !== "new"
                  ? t("Edit Order") + ": " + model.name
                  : t("Add Order")}
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
              {loading && <EditOrderSkeleton />}
              {!loading && (
                <React.Fragment>
                  <GridItem xs={12}>
                    <GridContainer>
                      <GridItem xs={12}>
                        <h5 className={classes.heading}>
                          {t("Basic Information")}
                        </h5>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          {/* <CustomInput
                            labelText={t("Order Name (Chinese)")}
                            id="order-name"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.name,
                              onChange: e => {
                                setModel({ ...model, name: e.target.value });
                              }
                            }}
                          /> */}
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          {/* <CustomInput
                            labelText={t("Order Name (English)")}
                            id="order-name-english"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.nameEN,
                              onChange: e => {
                                setModel({ ...model, nameEN: e.target.value });
                              }
                            }}
                          /> */}
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box py={2}>
                          <TextField
                            id="order-note"
                            label={t("Note (Chinese)")}
                            multiline
                            rowsMax={4}
                            onChange={e => {
                              setModel({
                                ...model,
                                note: e.target.value
                              });
                            }}
                            variant="outlined"
                            value={model.note}
                            className={classes.textarea}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box py={2}>
                          {/* <TextField
                            id="order-description-english"
                            label={t("Description (English)")}
                            multiline
                            rowsMax={4}
                            onChange={e => {
                              setModel({
                                ...model,
                                descriptionEN: e.target.value
                              });
                            }}
                            variant="outlined"
                            value={model.descriptionEN}
                            className={classes.textarea}
                          /> */}
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          {/* <CustomInput
                            labelText={t("Price")}
                            id="order-price"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.price,
                              onChange: e => {
                                setModel({ ...model, price: e.target.value });
                              }
                            }}
                          /> */}
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          {/* <CustomInput
                            labelText={t("Cost")}
                            id="order-cost"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.cost,
                              onChange: e => {
                                setModel({ ...model, cost: e.target.value });
                              }
                            }}
                          /> */}
                        </Box>
                      </GridItem>
                      <GridItem xs={12}>
                        <h5 className={classes.heading}>{t("Stock")}</h5>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          {/* <FormControl className={classes.select}>
                            <InputLabel id="order-stock-enabled-label">
                              {t("Enabled")}
                            </InputLabel>
                            <Select
                              labelId="order-stock-enabled-label"
                              id="order-stock-enabled"
                              value={model.stock.enabled}
                              onChange={e => {
                                const newModel = { ...model };
                                newModel.stock.enabled = e.target.value;
                                setModel(newModel);
                              }}
                            >
                              <MenuItem value={false}>{t("No")}</MenuItem>
                              <MenuItem value={true}>{t("Yes")}</MenuItem>
                            </Select>
                          </FormControl> */}
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          {/* <CustomInput
                            labelText={t("Quantity")}
                            id="order-quantity"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.stock.quantity,
                              onChange: e => {
                                const newModel = { ...model };
                                newModel.stock.quantity = e.target.value;
                                setModel(newModel);
                              }
                            }}
                          /> */}
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box py={2}>
                          {/* <TextField
                            id="order-outofstock-message"
                            label={t("Out of stock Message (Chinese)")}
                            multiline
                            rowsMax={4}
                            onChange={e => {
                              const newModel = { ...model };
                              newModel.stock.outofstockMessage = e.target.value;
                              setModel(newModel);
                            }}
                            variant="outlined"
                            value={model.stock.outofstockMessage}
                            className={classes.textarea}
                          /> */}
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box py={2}>
                          {/* <TextField
                            id="order-outofstock-message-english"
                            label={t("Out of stock Message (English)")}
                            multiline
                            rowsMax={4}
                            onChange={e => {
                              const newModel = { ...model };
                              newModel.stock.outofstockMessageEN =
                                e.target.value;
                              setModel(newModel);
                            }}
                            variant="outlined"
                            value={model.stock.outofstockMessageEN}
                            className={classes.textarea}
                          /> */}
                        </Box>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </React.Fragment>
              )}
            </GridContainer>
          </CardBody>
        </Card>
        {/* <Card>
          <CardHeader>
            <h5 className={classes.heading}>{t("Combinations")}</h5>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                <GridContainer>
                  <GridItem xs={12} lg={7}>
                    <CombinationTable
                      processing={processing}
                      attributes={attributes}
                      combinations={model.combinations}
                      onSave={(index, value) => {
                        const newModel = { ...model };
                        newModel.combinations[index].price = value.price;
                        newModel.combinations[index].cost = value.cost;
                        newModel.combinations[index].quantity = value.quantity;
                        setModel(newModel);
                      }}
                      onDelete={index => {
                        const newModel = { ...model };
                        newModel.combinations.splice(index, 1);
                        setModel(newModel);
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} lg={5}>
                    <CombinationGenerator
                      attributes={attributes}
                      onGenerate={groupData => {
                        const values = getAllCombinations(groupData);
                        const combinations = [];
                        values.forEach(value => {
                          combinations.push({
                            values: value,
                            price: model.price,
                            cost: model.cost,
                            quantity: model.stock.quantity
                          });
                        });
                        const newModel = { ...model };
                        newModel.combinations = combinations;
                        newModel.attributes = groupData.map(({ attrIdx }) => {
                          return attributes.find(({ _id }) => _id === attrIdx);
                        });
                        setModel(newModel);
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card> */}
      </GridItem>
      <GridItem xs={12} lg={4}>
        <Card>
          <CardHeader>
            <h5 className={classes.heading}>{t("Category")}</h5>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                {!loading && (
                  <CategoryTree
                    treeData={categoryTreeData}
                    selectedCategoryId={model.categoryId}
                    onSelect={categoryId => setModel({ ...model, categoryId })}
                  />
                )}
              </GridItem>
              <GridItem xs={12} container direction="row-reverse">
                <Box mt={2}>
                  <Button variant="contained" href="../orders">
                    <FormatListBulletedIcon />
                    {t("Back")}
                  </Button>
                </Box>
                <Box mt={2} mr={2}>
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

// EditCombinationRow.propTypes = {
//   row: PropTypes.shape({
//     combinationDescription: PropTypes.string,
//     price: PropTypes.number,
//     cost: PropTypes.number,
//     quantity: PropTypes.number
//   }),
//   onSave: PropTypes.func,
//   onCancel: PropTypes.func
// };

// CombinationTable.propTypes = {
//   attributes: PropTypes.array,
//   combinations: PropTypes.array,
//   processing: PropTypes.bool,
//   onDelete: PropTypes.func,
//   onSave: PropTypes.func
// };

// CombinationGenerator.propTypes = {
//   attributes: PropTypes.array,
//   onGenerate: PropTypes.func
// };

OrderFormPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.object
};

export default OrderFormPage;