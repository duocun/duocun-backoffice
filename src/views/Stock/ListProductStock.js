import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "components/Table/TablePagniation.js";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import { InputLabel, MenuItem, Select, Box } from "@material-ui/core";

import Alert from "@material-ui/lab/Alert";
import TableBodySkeleton from "components/Table/TableBodySkeleton";
import Searchbar from "components/Searchbar/Searchbar";
import DateRangePicker from "components/DateRangePicker/DateRangePicker";

import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import RemoveIcon from "@material-ui/icons/Remove";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

import ApiStockService from "services/api/ApiStockService";
import FlashStorage from "services/FlashStorage";
import { getQueryParam, countProductFromDate } from "helper/index";
import { getDateStrArrayBetween } from "helper";
import { useDebounce } from "index";

import moment from "moment";
import "moment/locale/zh-cn";
import ApiCategoryService from "services/api/ApiCategoryService";

moment.locale("zh-cn");

const useStyles = makeStyles((theme) => ({
  heading: {
    marginTop: "0.5rem",
    marginBottom: "0.5rem",
  },
  tableContainer: {
    maxHeight: "calc(100vh - 240px)",
  },
  table: {
    minWidth: 1024,
    "& td": {
      minWidth: "50px",
      padding: "0.5rem",
    },
    "& th": {
      minWidth: "50px",
      padding: "0.5rem",
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  textCenter: {
    textAlign: "center",
  },
  iconButton: {
    cursor: "pointer",
  },
  inputInRow: {
    maxWidth: "3.5rem",
    textAlign: "center",
  },
  linkLabel: {
    color: "#3f51b5",
  },
  headerBox: {
    marginTop: "28px",
    marginRight: "2rem",
    display: "inline-block",
  },
  headerLabel: {
    color: "#eeeeee",
    display: "inline-block",
    marginRight: "1rem",
  },
  headerSelect: {
    "&:before": {
      borderColor: "#eeeeee",
    },
    "&:after": {
      borderColor: "#eeeeee",
    },
    color: "#eeeeee",
  },
  headerSelectIcon: {
    fill: "#eeeeee",
  },
  textDanger: {
    color: "#f44336",
  },
}));

const isQuantityDeficient = (quantity, product) => {
  if (!product.stock || !product.stock.enabled) return false;
  return (product.stock.warningThreshold || 0) >= quantity;
};

const isProductQuantityDeficient = (product) => {
  if (!product.stock || !product.stock.enabled) return false;
  let quantity = product.stock.quantity || 0;
  if (product.delivery) {
    product.delivery.forEach((order) => {
      order.items
        .filter((item) => item.productId === product._id)
        .forEach((item) => {
          quantity -= item.quantity;
        });
    });
  }
  return isQuantityDeficient(quantity || 0, product);
};

const getCategoryName = (categories, product) => {
  let category = categories.find((c) => c._id === product.categoryId);
  if (category) {
    return category.name;
  } else {
    return "";
  }
};

const StockRow = ({
  number,
  product,
  onToggleStockEnabled,
  onToggleAllowNegative,
  onSetQuantity,
  dates,
}) => {
  const classes = useStyles();
  const [quantity, setQuantity] = useState(
    product.stock ? parseInt(product.stock.quantity) ?? 0 : 0
  );
  const [add, setAdd] = useState(0);
  const debouncedQuantity = useDebounce(quantity, 1000);
  // useEffect(() => {
  //   setAdd(quantity - product.stock ? product.stock.quantity || 0 : 0);
  // }, [quantity]);
  useEffect(() => {
    if (!product.stock || !product.stock.enabled) {
      return;
    }
    if (product.stock.quantity !== debouncedQuantity) {
      onSetQuantity(product, debouncedQuantity);
    }
    setAdd(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuantity]);

  return (
    <TableRow className={classes.textCenter}>
      <TableCell>{number}</TableCell>
      <TableCell>{product.categoryName}</TableCell>
      <TableCell>
        <Link to={`products/${product._id}`}>
          <span className={classes.linkLabel}>{product.name}</span>
          {isProductQuantityDeficient(product) && (
            <ErrorOutlineIcon color="secondary" fontSize="small" />
          )}
        </Link>
      </TableCell>
      <TableCell className={classes.textCenter}>
        {product.stock && product.stock.enabled ? (
          <CheckIcon
            color="primary"
            className={classes.iconButton}
            onClick={() => {
              onToggleStockEnabled(product);
            }}
          />
        ) : (
            <CloseIcon
              color="error"
              className={classes.iconButton}
              onClick={() => {
                onToggleStockEnabled(product);
              }}
            />
          )}
      </TableCell>
      <TableCell className={classes.textCenter}>
        {product.stock &&
          product.stock.enabled &&
          (product.stock.allowNegative ? (
            <CheckIcon
              color="primary"
              className={classes.iconButton}
              onClick={() => {
                onToggleAllowNegative(product);
              }}
            />
          ) : (
              <CloseIcon
                color="error"
                className={classes.iconButton}
                onClick={() => {
                  onToggleAllowNegative(product);
                }}
              />
            ))}
        {(!product.stock || !product.stock.enabled) && <RemoveIcon />}
      </TableCell>
      <TableCell className={classes.textCenter}>
        {product.stock && product.stock.enabled ? (
          <Input
            inputProps={{ type: "number", className: classes.textCenter }}
            className={classes.inputInRow}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          ></Input>
        ) : (
            <>- - -</>
          )}
      </TableCell>
      <TableCell className={classes.textCenter}>
        {product.stock && product.stock.enabled ? (
          <Input
            inputProps={{ type: "number", className: classes.textCenter }}
            className={classes.inputInRow}
            onChange={(e) => {
              const newQuantity =
                parseInt(quantity || "0") + parseInt(e.target.value);
              setAdd(e.target.value);
              setQuantity(newQuantity);
            }}
            value={add}
          ></Input>
        ) : (
            <>- - -</>
          )}
      </TableCell>
      {dates.map((date) => {
        const dateQuantity = product.stock
          ? quantity -
          countProductFromDate(date, product.delivery, product._id, "before")
          : null;
        return (
          <TableCell key={date} className={classes.textCenter}>
            {product.stock && product.stock.enabled ? (
              <span
                className={
                  product.stock &&
                    product.stock.enabled &&
                    isQuantityDeficient(dateQuantity, product)
                    ? classes.textDanger
                    : null
                }
              >
                {dateQuantity}
              </span>
            ) : (
                <>- - -</>
              )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default function ListProductStock({ location }) {
  const { t } = useTranslation();
  const classes = useStyles();
  // states related to list and pagniation
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(
    getQueryParam(location, "page")
      ? parseInt(getQueryParam(location, "page"))
      : 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalRows, setTotalRows] = useState(0);
  const [query, setQuery] = useState(getQueryParam(location, "search") || "");
  const [sort] = useState(["_id", -1]);
  const [categories, setCategories] = useState([]);
  const [filterParams, setFilterParams] = useState({
    "stock.enabled": true,
  });
  // states related to stock dates
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment().add("+7", "days"));
  // states related to processing
  const [alert, setAlert] = useState(
    FlashStorage.get("PRODUCT_ALERT") || { message: "", severity: "info" }
  );
  const [processing, setProcessing] = useState(false);

  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info",
    });
  };

  const handleServerResponse = ({ data }, product) => {
    if (data.code === "success") {
      updateData();
      setAlert({
        message: t("Saved successfully") + ": " + product.name,
        severity: "success",
      });
    } else {
      setAlert({
        message: t("Save failed"),
        severity: "error",
      });
    }
    setProcessing(false);
  };

  const handleToggleStockEnabled = (product) => {
    if (processing) {
      return;
    }
    removeAlert();
    setProcessing(true);
    ApiStockService.toggleStockEnabled(product)
      .then((resp) => {
        handleServerResponse(resp, product);
      })
      .catch((e) => {
        console.error(e);
        setAlert({
          message: t("Save failed"),
          severity: "error",
        });
      });
  };

  const handleToggleAllowNegative = (product) => {
    if (processing) {
      return;
    }
    removeAlert();
    setProcessing(true);
    ApiStockService.toggleAllowNegative(product)
      .then((resp) => {
        handleServerResponse(resp, product);
      })
      .catch((e) => {
        console.error(e);
        setAlert({
          message: t("Save failed"),
          severity: "error",
        });
      });
  };

  const handleSetQuantity = (product, quantity) => {
    if (processing) {
      return;
    }
    removeAlert();
    setProcessing(true);
    ApiStockService.setQuantity(product, quantity)
      .then((resp) => {
        handleServerResponse(resp, product);
      })
      .catch((e) => {
        console.error(e);
        setAlert({
          message: t("Save failed"),
          severity: "error",
        });
      });
  };

  const updateData = React.useCallback(() => {
    ApiStockService.getStockList(page, rowsPerPage, query, filterParams, [
      sort,
    ]).then(({ data }) => {
      if (data.code === "success") {
        data.data = data.data.map((product) => {
          product.categoryName = getCategoryName(categories, product);
          return product;
        });
        setProducts(data.data);
        setTotalRows(data.count);
        setLoading(false);
      } else {
        setAlert({
          message: t("Cannnot load data"),
          severity: "error",
        });
      }
    });
  }, [categories, filterParams, page, query, rowsPerPage, sort, t]);

  useEffect(() => {
    setLoading(true);
    ApiCategoryService.getCategories({ type: "G" }).then(({ data }) => {
      if (data.code === "success") {
        setCategories(data.data);
      }
    });
  }, []);

  useEffect(() => {
    if (categories.length) {
      setLoading(true);
      updateData();
    }
  }, [categories, updateData]); // page, rowsPerPage, sort, categories

  useEffect(() => {
    setLoading(true);
    if (page === 0) {
      updateData();
    } else {
      setPage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParams]);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary">
            <GridContainer>
              <GridItem xs={12} lg={12}>
                <h4 className={classes.heading}>{t("Stock")}</h4>
              </GridItem>
              <GridItem xs={12} lg={12}>
                <GridContainer>
                  <GridItem xs={12} md={9}>
                    <Box className={classes.headerBox}>
                      <InputLabel
                        className={classes.headerLabel}
                        id="labelCategory"
                      >
                        {t("Category")}
                      </InputLabel>
                      <Select
                        className={classes.headerSelect}
                        labelId="labelCategory"
                        inputProps={{
                          classes: {
                            icon: classes.headerSelectIcon,
                          },
                          placeholder: t("Category"),
                        }}
                        value={filterParams.categoryId ?? "all"}
                        onChange={(e) => {
                          if (e.target.value) {
                            const newParams = { ...filterParams };
                            if (e.target.value !== "all") {
                              newParams.categoryId = e.target.value;
                            } else {
                              delete newParams.categoryId;
                            }
                            setFilterParams(newParams);
                          }
                        }}
                      >
                        <MenuItem value="all">{t("All")}</MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category._id} value={category._id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                    <Box className={classes.headerBox}>
                      <InputLabel
                        className={classes.headerLabel}
                        id="labelStockEnabled"
                      >
                        {t("Stock Enabled")}
                      </InputLabel>
                      <Select
                        className={classes.headerSelect}
                        labelId="labelStockEnabled"
                        inputProps={{
                          classes: {
                            icon: classes.headerSelectIcon,
                          },
                          placeholder: t("Stock Enabled"),
                        }}
                        value={filterParams["stock.enabled"] === true || filterParams["stock.enabled"] === false ? filterParams["stock.enabled"].toString() : "all"}
                        onChange={(e) => {
                          const newParams = { ...filterParams };
                          if (e.target.value) {
                            if (e.target.value === "true") {
                              newParams["stock.enabled"] = true;
                            } else {
                              newParams["stock.enabled"] = false;
                            }
                          } else {
                            delete newParams["stock.enabled"];
                          }
                          setFilterParams(newParams);
                        }}
                      >
                        <MenuItem value="all">{t("All")}</MenuItem>
                        <MenuItem value="true">{t("Yes")}</MenuItem>
                        <MenuItem value="false">{t("No")}</MenuItem>
                      </Select>
                    </Box>
                    <Box className={classes.headerBox}>
                      <InputLabel
                        className={classes.headerLabel}
                        id="labelAllowNegative"
                      >
                        {t("Allow negative quantity")}
                      </InputLabel>
                      <Select
                        className={classes.headerSelect}
                        labelId="labelAllowNegative"
                        inputProps={{
                          classes: {
                            icon: classes.headerSelectIcon,
                          },
                          placeholder: t("Allow negative quantity"),
                        }}
                        value={filterParams["stock.allowNegative"] === true || filterParams["stock.allowNegative"] === false ? filterParams["stock.allowNegative"].toString() : "all" }
                        onChange={(e) => {
                          if (e.target.value) {
                            const newParams = { ...filterParams };
                            if (e.target.value !== "all") {
                              if (e.target.value === "true") {
                                newParams["stock.allowNegative"] = true;
                              } else {
                                newParams["stock.allowNegative"] = false;
                              }
                            } else {
                              delete newParams["stock.allowNegative"];
                            }
                            setFilterParams(newParams);
                          }
                        }}
                      >
                        <MenuItem value="all">{t("All")}</MenuItem>
                        <MenuItem value="true">{t("Yes")}</MenuItem>
                        <MenuItem value="false">{t("No")}</MenuItem>
                      </Select>
                    </Box>
                    <Box className={classes.headerBox}>
                      <DateRangePicker
                        defaultStartDate={moment()}
                        defaultEndDate={moment().add("+6", "days")}
                        onChange={(start, end) => {
                          const newParams = { ...filterParams };
                          newParams.startDate = moment(start).format(
                            "YYYY-MM-DD"
                          );
                          setFilterParams(newParams);
                          setStartDate(start);
                          setEndDate(end);
                        }}
                      />
                    </Box>
                  </GridItem>
                  <GridItem xs={12} md={3} align="right">
                    <Searchbar
                      onChange={(e) => {
                        const { target } = e;
                        setQuery(target.value);
                      }}
                      onSearch={() => {
                        setLoading(true);
                        if (page === 0) {
                          updateData();
                        } else {
                          setPage(0);
                        }
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
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
              <GridItem xs={12}>
                <TableContainer className={classes.tableContainer}>
                  <Table
                    stickyHeader
                    className={classes.table}
                    aria-label="Stock Table"
                    size="small"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>{t("Category")}</TableCell>
                        <TableCell>{t("Product Name")}</TableCell>
                        <TableCell>{t("Stock Enabled")}</TableCell>
                        <TableCell>{t("Allow negative quantity")}</TableCell>
                        <TableCell>{t("Quantity")}</TableCell>
                        <TableCell>{t("Add Quantity")}</TableCell>
                        {getDateStrArrayBetween(startDate, endDate).map(
                          (date) => (
                            <TableCell key={date}>
                              {moment(date).format("MM-DD ddd")}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableBodySkeleton
                          colCount={20}
                          rowCount={rowsPerPage}
                        />
                      ) : (
                          products.map((product, index) => (
                            <StockRow
                              key={product._id}
                              number={rowsPerPage * page + index + 1}
                              product={product}
                              dates={getDateStrArrayBetween(startDate, endDate)}
                              onToggleStockEnabled={handleToggleStockEnabled}
                              onToggleAllowNegative={handleToggleAllowNegative}
                              onSetQuantity={handleSetQuantity}
                            />
                          ))
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter>
            {!loading && (
              <TablePagination
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={(e, newPage) => setPage(newPage)}
                count={totalRows}
                onChangeRowsPerPage={({ target }) => {
                  setPage(0);
                  setRowsPerPage(target.value);
                }}
              ></TablePagination>
            )}
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

StockRow.propTypes = {
  number: PropTypes.number,
  product: PropTypes.object,
  onToggleStockEnabled: PropTypes.func,
  onToggleAllowNegative: PropTypes.func,
  onSetQuantity: PropTypes.func,
  dates: PropTypes.array,
};

ListProductStock.propTypes = {
  location: PropTypes.object,
};
