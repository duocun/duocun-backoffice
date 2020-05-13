import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
// import { connect } from "react-redux";
import moment from "moment";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import SaveIcon from "@material-ui/icons/Save";
// import Searchbar from "components/Searchbar/Searchbar";

import { Button, Box } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import Alert from "@material-ui/lab/Alert";
import ApiTransactionService from "services/api/ApiTransactionService";
// import ApiAccountService from "services/api/ApiAccountService";

import { getQueryParam } from "helper/index";
import FlashStorage from "services/FlashStorage";

// import SecondaryNav from "components/SecondaryNav/SecondaryNav";

import AccountSearch from "./AccountSearch";
//redux actions

// import { loadAccountsSearchAsync } from "redux/actions/account";

// import { loadAccountsAsync } from "redux/actions/account";
import { FinanceTable } from "./FinanceTable";
import { TransactionForm } from "./TransactionForm";



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

  const [account, setAccount] = useState({ _id: '', type: '' }); // selected account

  const [model, setModel] = useState(defaultTransaction);


  const [processing, setProcessing] = useState(false);

  const [alert, setAlert] = useState(
    FlashStorage.get("TRANSACTION_ALERT") || { message: "", severity: "info" }
  );

  useEffect(() => {
    if (searchParams.has('accountId')) {
      const accountId = searchParams.get('accountId');
      updateData(accountId);
    } else {
      updateData(account._id);
    }
  }, [page, rowsPerPage, sort, account]);

  const updateData = (accountId) => {
    const condition = {
      $or: [
        {
          fromId: accountId,
        },
        {
          toId: accountId,
        },
      ],
      status: { $nin: ['bad', 'tmp'] }
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

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} lg={8}>
          <Card>
            <CardHeader color="primary">
              <GridContainer>
                <GridItem xs={12} lg={6}>
                  <h4>{t("Transaction")}</h4>
                </GridItem>
                <GridItem xs={12} sm={12} lg={6} align="right">
                  {/* <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                  </div> */}

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
                </GridItem>
              </GridContainer>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <TransactionForm account={account}
            transaction={model}
            update={updateData} />
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
