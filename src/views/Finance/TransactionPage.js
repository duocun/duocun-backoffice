import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
// import { connect } from "react-redux";

import * as moment from 'moment';
import { KeyboardDatePicker } from "@material-ui/pickers";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import SaveIcon from "@material-ui/icons/Save";
import { Button, Box } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import Alert from "@material-ui/lab/Alert";
import ApiTransactionService from "services/api/ApiTransactionService";
import { getQueryParam } from "helper/index";
import FlashStorage from "services/FlashStorage";

import AccountSearch from "./AccountSearch";

import { FinanceTable } from "./FinanceTable";
import { TransactionForm } from "./TransactionForm";
import { StayCurrentLandscapeTwoTone } from "../../../node_modules/@material-ui/icons";



const useStyles = makeStyles(() => ({
  table: {
    minWidth: 750,
  },
}));

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const defaultTransaction = {
  actionCode: '',
  amount: 0,
  fromId: '',
  toId: '',
  note: '',
  staffId: '',
  staffName: '',
  modifyBy: '',
}

const defaultActions = [
  { code: 'A', text: 'All' },
  { code: 'ACTC', text: 'Add Credit to Client' },
  { code: 'PS', text: 'Pay Salary' },
  { code: 'PDCH', text: 'Pay Driver Cash' },
  { code: 'PC', text: 'Client Pay by card' },
  { code: 'PW', text: 'Client Pay by Wechat' },
  { code: 'T', text: 'Transfer' },
  { code: 'RC', text: 'Refund to Client' },
  { code: 'PMCH', text: 'Pay Merchant Cash' },
  { code: 'PMC', text: 'Pay Merchant from Bank' },
  { code: 'POR', text: 'Pay Office Rent' },
  { code: 'D', text: 'Discount' },
  { code: 'BM', text: 'Buy Material' },
  { code: 'BE', text: 'Buy Equipment' },
  { code: 'BA', text: 'Buy Advertisement' }
];

export const TransactionPage = ({ location, history }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  // states related to list and pagniation
  const searchParams = useQuery();
  const [transactions, setTransactions] = useState([]);
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

  // filters
  const [account, setAccount] = useState({ _id: '', type: '' }); // selected account
  const [actionCode, setActionCode] = useState('A');
  const [startDate, setStartDate] = useState(moment.utc().toISOString());
  const [endDate, setEndDate] = useState(moment.utc().toISOString());

  const [model, setModel] = useState(defaultTransaction);
  const [processing, setProcessing] = useState(false);

  const [alert, setAlert] = useState(
    FlashStorage.get("TRANSACTION_ALERT") || { message: "", severity: "info" }
  );

  useEffect(() => {
    if (searchParams.has('accountId')) {
      const accountId = searchParams.get('accountId');
      updateData(accountId, actionCode, startDate, endDate);
    } else {
      updateData(account._id, actionCode, startDate, endDate);
    }
  }, [page, rowsPerPage, sort, account, actionCode, startDate, endDate]);

  const updateData = (accountId, actionCode, startDate, endDate) => {
    const createdQuery = {}; // (startDate && endDate) ? {created: {$gte: startDate, $lte: endDate}} : {};
    const accountQuery = accountId ? {
      $or: [
        {fromId: accountId},
        {toId: accountId},
      ]
    } : {};

    const condition = actionCode === 'A' ? 
    {
      ...createdQuery,
      ...accountQuery,
      status: { $nin: ['bad', 'tmp'] }
    }
    :
    {
      ...createdQuery,
      ...accountQuery,
      status: { $nin: ['bad', 'tmp'] },
      actionCode
    };

    ApiTransactionService.getTransactionList(
      page,
      rowsPerPage,
      condition,
      [sort]
    ).then(({ data }) => {
      setTransactions(data.data);
      setTotalRows(data.count);
      setLoading(false);
    });
  };

  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info",
    });
  };

  const handleNewTransaction = () => {
    setModel({
      ...defaultTransaction,
      modifyBy: account ? account._id : '',
      created: moment.utc().toISOString()
    });
  }

  const handelEditTransaction = (tr) => {
    if (tr.note) {
      setModel({ ...tr, modifyBy: account ? account._id : '' });
    } else {
      setModel({ ...tr, note: '', modifyBy: account ? account._id : '' });
    }
  }

  const handleSelectAccount = account => {
    const type = account ? account.type : 'client';
    setAccount({ _id: account ? account._id : '', type });
    setQuery(account ? account.username : '');
  }

  const handleActionChange = (actionCode) => {
    setActionCode(actionCode);
    updateData(account._id, actionCode, startDate, endDate);
  }

  const handleUpdateData = (accountId) => {
    updateData(accountId, actionCode, startDate, endDate);
  }

  const handleStartDateChange = (s) => {
    setStartDate(s);
    updateData(account._id, actionCode, startDate, endDate);
  }

  const handleEndDateChange = (s) => {
    setEndDate(s);
    updateData(account._id, actionCode, startDate, endDate);
  }

  const handleUpdateAccount = () => {
    if (account && account._id) {
      removeAlert();
      setProcessing(true);
      ApiTransactionService.updateTransactions(account._id).then(({ data }) => {
        if (data.code === 'success') {
          setAlert({
            message: t("Update account balance successfully"),
            severity: "success"
          });
        } else {
          setAlert({
            message: t("Update account balance failed"),
            severity: "error"
          });
        }
        setProcessing(false);
      })
        .catch(e => {
          console.error(e);
          setAlert({
            message: t("Update account balance failed"),
            severity: "error"
          });
          setProcessing(false);
        });
    }
  };

  const handleDeleteTransaction = (transactionId) => {
    if (window.confirm('Are you sure to delete this transaction?')) {
      if (transactionId) {
        removeAlert();
        setProcessing(true);
        ApiTransactionService.deleteTransaction(transactionId).then(({ data }) => {
          if (data.code === 'success') {
            setAlert({
              message: t("Delete transaction successfully"),
              severity: "success"
            });
          } else {
            setAlert({
              message: t("Delete transaction failed"),
              severity: "error"
            });
          }
          setProcessing(false);
        })
          .catch(e => {
            console.error(e);
            setAlert({
              message: t("Delete transaction failed"),
              severity: "error"
            });
            setProcessing(false);
          });
      }
    }
  };

  const handleExportRevenue = () => {
    if (window.confirm(`Are you sure to export the revenue from ${startDate}?`)) {
      if (startDate) {
        removeAlert();
        setProcessing(true);
        ApiTransactionService.exportRevenue(startDate, endDate).then(({ data }) => {

          // if (data.code === 'success') {
            setAlert({
              message: t("Export Revenue successfully"),
              severity: "success"
            });
          // } else {
          //   setAlert({
          //     message: t("Export Revenue failed"),
          //     severity: "error"
          //   });
          // }
          setProcessing(false);
        })
        .catch(e => {
          console.error(e);
          setAlert({
            message: t("Export Revenue failed"),
            severity: "error"
          });
          setProcessing(false);
        });
      }
    }
  };
  

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} lg={8}>
          <Card>
            <CardHeader color="primary">
              <GridContainer>
                <GridItem xs={12} sm={12} lg={12}>
                  <h4>{t("Transaction")}</h4>
                </GridItem>
                <GridItem xs={12} sm={12} lg={6} align="left">
                <GridItem xs={12} sm={12} lg={12} align="left">
                  <Box pb={2}>
                    <FormControl className={classes.select}>
                      <InputLabel id="action-label">Action</InputLabel>
                      <Select required
                        labelId="action-label"
                        id="action-select"
                        value={actionCode}
                        onChange={e => handleActionChange(e.target.value)}
                      >
                        {
                          defaultActions.map(d => <MenuItem key={d.code} value={d.code}>{d.text}</MenuItem>)
                        }
                      </Select>
                    </FormControl>
                  </Box>
                  </GridItem>
                  {/* <GridItem xs={12} sm={12} lg={12} align="left">
                  <KeyboardDatePicker
                  variant="inline"
                  label="Start Date"
                  format="YYYY-MM-DD"
                  value={moment.utc(startDate)}
                  onChange={(m) => handleStartDateChange(m.toISOString())}
                />
                  </GridItem>
                  <GridItem xs={12} sm={12} lg={12} align="left">
                  <KeyboardDatePicker
                  variant="inline"
                  label="End Date"
                  format="YYYY-MM-DD"
                  value={moment.utc(endDate)}
                  onChange={(m) => handleEndDateChange(m.toISOString()) }
                />
                  </GridItem> */}
                </GridItem>
                <GridItem xs={12} sm={12} lg={6} align="left">
                  <AccountSearch
                    label="Account"
                    placeholder="Search name or phone"
                    val={query}
                    handleSelectAccount={handleSelectAccount}
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
                  <FinanceTable
                    account={account}
                    rows={transactions}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalRows={totalRows}
                    sort={sort}
                    loading={loading}
                    setRowsPerPage={setRowsPerPage}
                    setSort={setSort}
                    setPage={setPage}
                    editRow={handelEditTransaction}
                    deleteRow={handleDeleteTransaction}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <GridContainer>
                <GridItem xs={12} container direction="row-reverse">
                  <Box mt={2}>
                    <Button
                      color="primary"
                      variant="contained"
                      disabled={processing}
                      onClick={handleNewTransaction}
                    >
                      <AddCircleOutlineIcon />
                      {t("New Transaction")}
                    </Button>
                  </Box>
                  <Box mt={2} mr={2}>
                    <Button
                      color="primary"
                      variant="contained"
                      disabled={processing}
                      onClick={handleUpdateAccount}
                    >
                      <SaveIcon />
                      {t("Update")}
                    </Button>
                  </Box>
                  <Box mt={2} mr={2}>
                    <Button
                      color="primary"
                      variant="contained"
                      disabled={processing}
                      onClick={handleExportRevenue}
                    >
                      <SaveIcon />
                      {t("Export Revenue")}
                    </Button>
                    {/* <a href="http://localhost:8001/uploads/revenue.csv" download="revenue.csv">Download revenue.csv</a> */}
                  </Box>
                </GridItem>
              </GridContainer>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <TransactionForm account={account}
            transaction={model}
            update={handleUpdateData} />
        </GridItem>
      </GridContainer>
    </div>
  );
}

TransactionPage.propTypes = {
  location: PropTypes.object,
  loadAccounts: PropTypes.func,
  accounts: PropTypes.array,
  history: PropTypes.object
};


// const mapStateToProps = (state) => ({ accounts: state.accounts });
// const mapDispatchToProps = (dispatch) => ({
//   loadAccounts: (payload, searchOption) => {
//     dispatch(loadAccountsAsync(payload, searchOption));
//   },
// });
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(TransactionPage);
