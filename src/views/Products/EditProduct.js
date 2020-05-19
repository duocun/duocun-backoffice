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
import ApiProductService from "services/api/ApiProductService";
import ApiCategoryService from "services/api/ApiCategoryService";
import CategoryTree from "views/Categories/CategoryTree";
import ProductImage from "views/Products/ProductImage";
import { countProductFromDate } from "helper/index";

import moment from "moment";
import "moment/locale/zh-cn";
import {
  groupAttributeData,
  getAllCombinations,
  getDateRangeStrings
} from "helper/index";
import ImageUploader from "react-images-upload";
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
  },
  combinationTable: {
    display: "none"
  }
}));

const defaultProductModelState = {
  _id: "new",
  name: "",
  nameEN: "",
  description: "",
  descriptionEN: "",
  price: 0,
  cost: 0,
  categoryId: "",
  pictures: [],
  stock: {
    enabled: false,
    allowNegative: false,
    quantity: 0,
    outofstockMessage: "",
    outofstockMessageEN: ""
  },
  attributes: [],
  combinations: []
};

const defaultAttributeValueModelState = {
  attrIdx: -1,
  valIdx: -1,
  price: 0,
  cost: 0,
  quantity: 0
};

const defaultAttributesState = [];

const getCombinationDescription = (attributes, { values }) => {
  let descriptions = [];
  values.forEach(({ attrIdx, valIdx }) => {
    const attribute = attributes.find(({ _id }) => _id === attrIdx);
    if (attribute) {
      descriptions.push(`${attribute.name}: ${attribute.values[valIdx].name}`);
    }
  });
  return descriptions.join(", ");
};

const EditProductSkeleton = () => (
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
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={48} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={240} />
    </GridItem>
    <GridItem xs={12} lg={6}>
      <Skeleton height={240} />
    </GridItem>
  </React.Fragment>
);

const EditCombinationRow = ({ row, onSave, onCancel, ...extraProps }) => {
  const [model, setModel] = useState(row || defaultAttributeValueModelState);
  const classes = useStyles();
  return (
    <TableRow {...extraProps}>
      <TableCell>{row.combinationDescription}</TableCell>
      <TableCell className={classes.editingCell}>
        <TextField
          inputProps={{
            value: model.price,
            onChange: e => setModel({ ...model, price: e.target.value })
          }}
          size="small"
        />
      </TableCell>
      <TableCell className={classes.editingCell}>
        <TextField
          inputProps={{
            value: model.cost,
            onChange: e => setModel({ ...model, cost: e.target.value })
          }}
          size="small"
        />
      </TableCell>
      <TableCell className={classes.editingCell}>
        <TextField
          inputProps={{
            value: model.quantity,
            onChange: e => setModel({ ...model, quantity: e.target.value })
          }}
          size="small"
        />
      </TableCell>
      <TableCell>
        <IconButton onClick={() => onSave(model, row)}>
          <SaveIcon />
        </IconButton>
        <IconButton onClick={() => onCancel(model, row)}>
          <CancelIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const CombinationTable = ({
  combinations,
  processing,
  attributes,
  onSave,
  onDelete
}) => {
  const { t } = useTranslation();
  const [editRowIdx, setEditRowIdx] = useState(-1);
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t("Combinations")}</TableCell>
            <TableCell>{t("Price")}</TableCell>
            <TableCell>{t("Cost")}</TableCell>
            <TableCell>{t("Quantity")}</TableCell>
            <TableCell>{t("Actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!combinations || !combinations.length) && (
            <TableRow>
              <TableCell align="center" colSpan={5}>
                {t("No data to display")}
              </TableCell>
            </TableRow>
          )}
          {combinations &&
            combinations.length > 0 &&
            combinations.map((combination, index) =>
              index === editRowIdx ? (
                <EditCombinationRow
                  key={index}
                  row={{
                    combinationDescription: getCombinationDescription(
                      attributes,
                      combination
                    ),
                    price: parseFloat(combination.price),
                    cost: parseFloat(combination.cost),
                    quantity: parseInt(combination.quantity)
                  }}
                  onSave={model => {
                    onSave(index, model);
                    setEditRowIdx(-1);
                  }}
                  onCancel={() => setEditRowIdx(-1)}
                />
              ) : (
                <TableRow key={index}>
                  <TableCell>
                    {getCombinationDescription(attributes, combination)}
                  </TableCell>
                  <TableCell>{combination.price}</TableCell>
                  <TableCell>{combination.cost}</TableCell>
                  <TableCell>{combination.quantity}</TableCell>
                  <TableCell>
                    <IconButton
                      disabled={processing}
                      onClick={() => setEditRowIdx(index)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      disabled={processing}
                      onClick={() => onDelete(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const CombinationGenerator = ({ attributes, onGenerate }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [model, setModel] = useState([]);
  const getChecked = (attrIdx, valIdx) => {
    for (let i = 0; i < model.length; i++) {
      if (model[i].attrIdx === attrIdx && model[i].valIdx === valIdx) {
        return true;
      }
    }
    return false;
  };
  const handleChange = (attrIdx, valIdx) => {
    const newModel = [...model];
    const modelIndex = newModel.findIndex(
      m => m.attrIdx === attrIdx && m.valIdx === valIdx
    );
    if (modelIndex > -1) {
      newModel.splice(modelIndex, 1);
    } else {
      newModel.push({ attrIdx, valIdx });
    }
    setModel(newModel);
  };

  return (
    <div>
      {attributes.map(attribute => (
        <FormControl
          component="div"
          key={attribute._id}
          className={classes.formControl}
        >
          <FormLabel component="legend" className={classes.formControlLabel}>
            {attribute.name}
          </FormLabel>
          <FormGroup className={classes.formGroup}>
            {attribute.values.map((value, valIdx) => (
              <FormControlLabel
                key={attribute._id + "_" + valIdx}
                control={
                  <Checkbox
                    checked={getChecked(attribute._id, valIdx)}
                    onChange={() => handleChange(attribute._id, valIdx)}
                  />
                }
                label={value.name}
              />
            ))}
          </FormGroup>
        </FormControl>
      ))}
      <Box p={2} align="center">
        <Button
          variant="contained"
          color="secondary"
          disabled={!model.length}
          onClick={() => {
            onGenerate(groupAttributeData(model));
          }}
        >
          {t("Generate")}
        </Button>
      </Box>
    </div>
  );
};

const ProductQuantitySchedule = ({ productId, productQuantity, days = 7 }) => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [dates] = useState(getDateRangeStrings(days));
  useEffect(() => {
    ApiProductService.getProductDeliveries(productId).then(async ({ data }) => {
      moment.locale("zh-cn");
      if (data.code && data.code === "success") {
        setOrders(data.data);
      }
    });
  }, []);

  return (
    <Card>
      <CardHeader color="primary">{t("Product Quantity Schedule")}</CardHeader>
      <CardBody>
        <GridContainer>
          <GridItem xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {dates.map(date => (
                      <TableCell key={date}>
                        {moment(date).format("MM-DD ddd")}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {dates.map(date => (
                      <TableCell key={date}>
                        {parseInt(productQuantity) +
                          countProductFromDate(date, orders, productId)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </GridItem>
        </GridContainer>
      </CardBody>
    </Card>
  );
};

const EditProduct = ({ match, history }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [model, setModel] = useState(defaultProductModelState);
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
    ApiProductService.getProduct(match.params.id)
      .then(async ({ data }) => {
        if (data.code === "success") {
          setModel({ ...model, ...data.data });
          const categoryResp = await ApiCategoryService.getCategoryTree();
          if (categoryResp.data && categoryResp.data.code === "success") {
            setCategoryTreeData(categoryResp.data.data);
          }
          setAttributes(data.meta?.attributes || []);
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

  const uploadPicture = picture => {
    let file = picture;
    if (Array.isArray(file)) {
      file = file[0];
    }
    ApiProductService.uploadPicture(file, model._id).then(({ data }) => {
      if (data.code === "success") {
        const newModel = { ...model };
        newModel.pictures.push(data.data);
        setModel(newModel);
      } else {
        setAlert({
          message: t("Upload failed"),
          severity: "error"
        });
      }
    });
  };

  const saveModel = () => {
    removeAlert();
    setProcessing(true);
    ApiProductService.saveProduct(model)
      .then(({ data }) => {
        if (data.code === "success") {
          const newAlert = {
            message: t("Saved successfully"),
            severity: "success"
          };
          if (model._id === "new") {
            FlashStorage.set("PRODUCT_ALERT", newAlert);
            history.push("../products");
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
            {loading && <h4>{t("Product")}</h4>}
            {!loading && (
              <h4>
                {model._id && model._id !== "new"
                  ? t("Edit Product") + ": " + model.name
                  : t("Add Product")}
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
              {loading && <EditProductSkeleton />}
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
                          <CustomInput
                            labelText={t("Product Name (Chinese)")}
                            id="product-name"
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
                            labelText={t("Product Name (English)")}
                            id="product-name-english"
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
                            id="product-description"
                            label={t("Description (Chinese)")}
                            multiline
                            rowsMax={4}
                            onChange={e => {
                              setModel({
                                ...model,
                                description: e.target.value
                              });
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
                            id="product-description-english"
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
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          <CustomInput
                            labelText={t("Price")}
                            id="product-price"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.price,
                              onChange: e => {
                                setModel({ ...model, price: e.target.value });
                              }
                            }}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          <CustomInput
                            labelText={t("Cost")}
                            id="product-cost"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: model.cost,
                              onChange: e => {
                                setModel({ ...model, cost: e.target.value });
                              }
                            }}
                          />
                        </Box>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <h5 className={classes.heading}>{t("Stock")}</h5>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <Box pb={2}>
                          <FormControl className={classes.select}>
                            <InputLabel id="product-stock-enabled-label">
                              {t("Enabled")}
                            </InputLabel>
                            <Select
                              labelId="product-stock-enabled-label"
                              id="product-stock-enabled"
                              value={model.stock.enabled || false}
                              onChange={e => {
                                const newModel = { ...model };
                                newModel.stock.enabled = e.target.value;
                                setModel(newModel);
                              }}
                            >
                              <MenuItem value={false}>{t("No")}</MenuItem>
                              <MenuItem value={true}>{t("Yes")}</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </GridItem>
                      {model.stock.enabled && (
                        <>
                          <GridItem xs={12} lg={6}>
                            <Box pb={2}>
                              <FormControl className={classes.select}>
                                <InputLabel id="product-stock-allow-negative-label">
                                  {t("Allow negative quantity")}
                                </InputLabel>
                                <Select
                                  labelId="product-stock-allow-negative-label"
                                  id="product-stock-allow-negative"
                                  value={model.stock.allowNegative || false}
                                  onChange={e => {
                                    const newModel = { ...model };
                                    newModel.stock.allowNegative =
                                      e.target.value;
                                    setModel(newModel);
                                  }}
                                >
                                  <MenuItem value={false}>{t("No")}</MenuItem>
                                  <MenuItem value={true}>{t("Yes")}</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>
                          </GridItem>
                          {/* <GridItem xs={12} lg={6}>
                            <Box pb={2}>
                              <CustomInput
                                labelText={t("Quantity")}
                                id="product-quantity"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  type: "number",
                                  value: model.stock.quantity || 0,
                                  onChange: e => {
                                    const newModel = { ...model };
                                    newModel.stock.quantity = e.target.value;
                                    setModel(newModel);
                                  }
                                }}
                              />
                            </Box>
                          </GridItem> */}
                          <GridItem xs={12} lg={6}>
                            <Box pb={2}>
                              <CustomInput
                                labelText={t("Warning Threshold")}
                                id="product-warning-threshold"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  type: "number",
                                  value: model.stock.warningThreshold || 0,
                                  onChange: e => {
                                    const newModel = { ...model };
                                    newModel.stock.warningThreshold =
                                      e.target.value;
                                    setModel(newModel);
                                  }
                                }}
                              />
                            </Box>
                          </GridItem>
                          <GridItem xs={12} lg={6}>
                            <Box py={2}>
                              <TextField
                                id="product-outofstock-message"
                                label={t("Out of stock Message (Chinese)")}
                                multiline
                                rowsMax={4}
                                onChange={e => {
                                  const newModel = { ...model };
                                  newModel.stock.outofstockMessage =
                                    e.target.value;
                                  setModel(newModel);
                                }}
                                variant="outlined"
                                value={model.stock.outofstockMessage || ""}
                                className={classes.textarea}
                              />
                            </Box>
                          </GridItem>
                          <GridItem xs={12} lg={6}>
                            <Box py={2}>
                              <TextField
                                id="product-outofstock-message-english"
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
                                value={model.stock.outofstockMessageEN || ""}
                                className={classes.textarea}
                              />
                            </Box>
                          </GridItem>
                        </>
                      )}
                      <GridItem xs={12}>
                        <h5 className={classes.heading}>
                          {t("Product Image")}
                        </h5>
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <ImageUploader
                          withIcon={true}
                          buttonText="Upload image"
                          onChange={picture => uploadPicture(picture)}
                          imgExtension={[".jpg", ".gif", ".png"]}
                          maxFileSize={5242880}
                        />
                      </GridItem>
                      <GridItem xs={12} lg={6}>
                        <GridContainer>
                          {model.pictures &&
                            model.pictures.map((picture, index) => (
                              <GridItem key={index} xs={12} lg={6}>
                                <ProductImage
                                  src={picture.url}
                                  onRemove={() => {
                                    const confirm = window.confirm(
                                      t(
                                        "Do you really want to remove this image?"
                                      )
                                    );
                                    if (confirm) {
                                      const newModel = { ...model };
                                      newModel.pictures.splice(index, 1);
                                      setModel(newModel);
                                    }
                                  }}
                                ></ProductImage>
                              </GridItem>
                            ))}
                        </GridContainer>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </React.Fragment>
              )}
            </GridContainer>
          </CardBody>
        </Card>
        {/* Hide combination table until it's used in production mode */}
        <Card className={classes.combinationTable}>
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
        </Card>
        {/* {!loading && model.stock && model.stock.enabled && (
          <ProductQuantitySchedule
            productId={match.params.id}
            productQuantity={model.stock.quantity ? model.stock.quantity : 0}
            days={10}
          />
        )} */}
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
                  <Button variant="contained" href="../products">
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

ProductQuantitySchedule.propTypes = {
  productId: PropTypes.string,
  productQuantity: PropTypes.number,
  days: PropTypes.number
};

EditCombinationRow.propTypes = {
  row: PropTypes.shape({
    combinationDescription: PropTypes.string,
    price: PropTypes.number,
    cost: PropTypes.number,
    quantity: PropTypes.number
  }),
  onSave: PropTypes.func,
  onCancel: PropTypes.func
};

CombinationTable.propTypes = {
  attributes: PropTypes.array,
  combinations: PropTypes.array,
  processing: PropTypes.bool,
  onDelete: PropTypes.func,
  onSave: PropTypes.func
};

CombinationGenerator.propTypes = {
  attributes: PropTypes.array,
  onGenerate: PropTypes.func
};

EditProduct.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.object
};

export default EditProduct;
