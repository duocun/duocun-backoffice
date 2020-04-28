import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import moment from 'moment';
import { DateRangePicker } from "react-dates";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

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
import TableSortLabel from "@material-ui/core/TableSortLabel";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import LocalMallIcon from "@material-ui/icons/LocalMall";

import Avatar from "@material-ui/core/Avatar";
import Alert from "@material-ui/lab/Alert";
import TableBodySkeleton from "components/Table/TableBodySkeleton";
import Searchbar from "components/Searchbar/Searchbar";

import ApiTransactionService from "services/api/ApiTransactionService";
import { getQueryParam } from "helper/index";
import FlashStorage from "services/FlashStorage";
import { Button, Box } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 750,
  },
}));
export default function FinanceDetails({ location }) {
  const { t } = useTranslation();
  const classes = useStyles();
  // states related to list and pagniation
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [focusDate, setFocusDate] = useState('START_DATE');
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
    FlashStorage.get("TRANSACTION_ALERT") || { message: "", severity: "info" }
  );
  const [processing, setProcessing] = useState(false);

  const updateData = () => {
    ApiTransactionService.getTransactionList(page, rowsPerPage, query, [
      sort,
    ]).then(({ data }) => {
      setTransactions(data.data);
      setTotalRows(data.count);
      setLoading(false);
    });
  };
  const toggleSort = (fieldName) => {
    // sort only one field
    if (sort && sort[0] === fieldName) {
      setSort([fieldName, sort[1] === 1 ? -1 : 1]);
    } else {
      setSort([fieldName, 1]);
    }
  };
  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info",
    });
  };

  const toggleFeature = (productId) => {
    removeAlert();
    setProcessing(true);
    ApiTransactionService.toggleFeature(productId)
      .then(({ data }) => {
        if (data.success) {
          setAlert({
            message: t("Saved successfully"),
            severtiy: "success",
          });
          updateData();
        } else {
          setAlert({
            message: t("Save failed"),
            severity: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setAlert({
          message: t("Save failed"),
          severity: "error",
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  };
  const renderRows = (rows) => {
    if (!rows.length) {
      return (
        <TableRow>
          <TableCell align="center" colSpan={7} size="medium">
            {t("No data to display")}
          </TableCell>
        </TableRow>
      );
    }
    return (
      <React.Fragment>
        {rows.map((row, idx) => (
          <TableRow key={idx}>
            <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
            {/* <TableCell>
              <Avatar
                variant="square"
                alt="product"
                src={
                  row.pictures && row.pictures[0] ? row.pictures[0].url : "#"
                }
              >
                <LocalMallIcon></LocalMallIcon>
              </Avatar>
            </TableCell> */}
            <TableCell>{row.created}</TableCell>
            <TableCell>{row.modified}</TableCell>
            <TableCell>{row.fromName}</TableCell>
            <TableCell>{row.toName}</TableCell>
            <TableCell>{row.action}</TableCell>
            <TableCell>{row.amount}</TableCell>
            <TableCell>{row.toBalance}</TableCell>
            <TableCell>
              <IconButton
                disabled={processing}
                onClick={() => {
                  toggleFeature(row._id);
                }}
              >
                {row.featured ? (
                  <CheckIcon color="primary"></CheckIcon>
                ) : (
                  <CloseIcon color="error"></CloseIcon>
                )}
              </IconButton>
            </TableCell>
            <TableCell>
              <IconButton aria-label="edit" href={`finance/${row._id}`}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="delete" disabled={processing}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </React.Fragment>
    );
  };
  const renderSort = (fieldName) => {
    return (
      <TableSortLabel
        active={sort && sort[0] === fieldName}
        direction={sort && sort[1] === -1 ? "desc" : "asc"}
        onClick={() => {
          toggleSort(fieldName);
        }}
      ></TableSortLabel>
    );
  };

  useEffect(() => {
    updateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, sort]);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary">
              <GridContainer>
                <GridItem xs={12} lg={6}>
                  <h4>{t("Finance")}</h4>
                </GridItem>
                <GridItem xs={12} lg={6} align="right">
                  {/* <Box mr={2} style={{ display: "inline-block" }}>
                    <Button
                      href="products/new"
                      variant="contained"
                      color="default"
                    >
                      <AddCircleOutlineIcon />
                      {t("New Product")}
                    </Button>
                  </Box> */}
                  <DateRangePicker
                    startDate={startDate} // momentPropTypes.momentObj or null,
                    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                    endDate={endDate} // momentPropTypes.momentObj or null,
                    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                    onDatesChange={({ startDate, endDate }) =>
                      {
                        setStartDate(startDate);
                        setEndDate(endDate);
                      }
                    } // PropTypes.func.isRequired,
                    focusedInput={focusDate}
                    onFocusChange={focusDate => setFocusDate(focusDate)}
                  />

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
                      aria-label="Transaction Table"
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          {/* <TableCell>{t("Image")}</TableCell> */}
                          <TableCell
                            onClick={() => {
                              toggleSort("created");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("Created")}
                            {renderSort("created")}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("modified");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("Modified")}
                            {renderSort("modified")}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("fromName");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("fromName")}
                            {renderSort("fromName")}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("toName");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("toName")}
                            {renderSort("toName")}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("action");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("action")}
                            {renderSort("action")}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("amount");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("amount")}
                            {renderSort("amount")}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("toBalance");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("balance")}
                            {renderSort("toBalance")}
                          </TableCell>
                          <TableCell>{t("Actions")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableBodySkeleton
                            colCount={7}
                            rowCount={rowsPerPage}
                          />
                        ) : (
                          renderRows(transactions)
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
    </div>
  );
}

FinanceDetails.propTypes = {
  location: PropTypes.object,
};
