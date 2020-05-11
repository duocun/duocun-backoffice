import React, { useState, useEffect } from "react";
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

import Alert from "@material-ui/lab/Alert";
import TableBodySkeleton from "components/Table/TableBodySkeleton";
import Searchbar from "components/Searchbar/Searchbar";

import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import RemoveIcon from "@material-ui/icons/Remove";

import ApiStockService from "services/api/ApiStockService";
import FlashStorage from "services/FlashStorage";
import { getQueryParam, countProductFromDate } from "helper/index";
import { getDateRangeStrings } from "helper";
import { useDebounce } from "index";

import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 750
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  textCenter: {
    textAlign: "center"
  },
  iconButton: {
    cursor: "pointer"
  },
  inputInRow: {
    maxWidth: "3.5rem",
    textAlign: "center"
  }
}));

const dates = getDateRangeStrings(7);

const StockRow = ({
  number,
  product,
  onToggleStockEnabled,
  onToggleAllowNegative,
  onSetQuantity
}) => {
  const classes = useStyles();
  const [quantity, setQuantity] = useState(
    product.stock ? product.stock.quantity || 0 : 0
  );
  const debouncedQuantity = useDebounce(quantity, 500);
  useEffect(() => {
    if (!product.stock) {
      return;
    }
    if (product.stock.quantity != debouncedQuantity) {
      onSetQuantity(product, debouncedQuantity);
    }
  }, [debouncedQuantity]);
  return (
    <TableRow className={classes.textCenter}>
      <TableCell>{number}</TableCell>
      <TableCell>{product.name}</TableCell>
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
            onChange={e => setQuantity(e.target.value)}
          ></Input>
        ) : (
          <>- - -</>
        )}
      </TableCell>
      {dates.map(date => (
        <TableCell key={date} className={classes.textCenter}>
          {product.stock && product.stock.enabled ? (
            <>
              {quantity -
                countProductFromDate(
                  date,
                  product.delivery,
                  product._id,
                  "before"
                )}
            </>
          ) : (
            <>- - -</>
          )}
        </TableCell>
      ))}
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [query, setQuery] = useState(getQueryParam(location, "search") || "");
  const [sort, setSort] = useState(["_id", 1]);

  // states related to processing
  const [alert, setAlert] = useState(
    FlashStorage.get("PRODUCT_ALERT") || { message: "", severity: "info" }
  );
  const [processing, setProcessing] = useState(false);

  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };

  const handleServerResponse = ({ data }, product) => {
    if (data.code === "success") {
      updateData();
      setAlert({
        message: t("Saved successfully") + ": " + product.name,
        severity: "success"
      });
    } else {
      setAlert({
        message: t("Save failed"),
        severity: "error"
      });
    }
    setProcessing(false);
  };

  const handleToggleStockEnabled = product => {
    if (processing) {
      return;
    }
    removeAlert();
    setProcessing(true);
    ApiStockService.toggleStockEnabled(product)
      .then(resp => {
        handleServerResponse(resp, product);
      })
      .catch(e => {
        console.error(e);
        setAlert({
          message: t("Save failed"),
          severity: "error"
        });
      });
  };

  const handleToggleAllowNegative = product => {
    if (processing) {
      return;
    }
    removeAlert();
    setProcessing(true);
    ApiStockService.toggleAllowNegative(product)
      .then(resp => {
        handleServerResponse(resp, product);
      })
      .catch(e => {
        console.error(e);
        setAlert({
          message: t("Save failed"),
          severity: "error"
        });
      });
  };

  const handleSetQuantity = (product, quantity) => {
    if (processing) {
      return;
    }
    removeAlert();
    setProcessing(true);
    ApiStockService.setQuantity(product, quantity).then(resp => {
      handleServerResponse(resp, product);
    }).catch(e => {
      console.error(e);
      setAlert({
        message: t("Save failed"),
        severity: "error"
      });
    });
  }

  const updateData = () => {
    ApiStockService.getStockList(page, rowsPerPage, query, {}, [sort]).then(
      ({ data }) => {
        if (data.code === "success") {
          setProducts(data.data);
          setTotalRows(data.count);
          setLoading(false);
        } else {
          setAlert({
            message: t("Cannnot load data"),
            severity: "error"
          });
        }
      }
    );
  };

  useEffect(() => {
    updateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, sort]);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary">
            <GridContainer>
              <GridItem xs={12} lg={6}>
                <h4>{t("Stock")}</h4>
              </GridItem>
              <GridItem xs={12} lg={6} align="right">
                <Searchbar
                  onChange={e => {
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
                <TableContainer>
                  <Table
                    className={classes.table}
                    aria-label="Stock Table"
                    size="small"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>{t("Product Name")}</TableCell>
                        <TableCell>{t("Stock Enabled")}</TableCell>
                        <TableCell>{t("Allow negative quantity")}</TableCell>
                        <TableCell>{t("Quantity")}</TableCell>
                        {dates.map(date => (
                          <TableCell key={date}>
                            {moment(date).format("MM-DD ddd")}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableBodySkeleton
                          colCount={12}
                          rowCount={rowsPerPage}
                        />
                      ) : (
                        products.map((product, index) => (
                          <React.Fragment key={index}>
                            <StockRow
                              number={rowsPerPage * page + index + 1}
                              product={product}
                              onToggleStockEnabled={handleToggleStockEnabled}
                              onToggleAllowNegative={handleToggleAllowNegative}
                              onSetQuantity={handleSetQuantity}
                            />
                          </React.Fragment>
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
  onSetQuantity: PropTypes.func
};

ListProductStock.propTypes = {
  location: PropTypes.object
};
