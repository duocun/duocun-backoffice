import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import moment from "moment";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Searchbar from "components/Searchbar/Searchbar";
import TimePicker from "components/TimePicker/TimePicker";

import { Button, Box } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import Alert from "@material-ui/lab/Alert";
import ApiTransactionService from "services/api/ApiTransactionService";
import ApiAccountService from "services/api/ApiAccountService";

import { getQueryParam } from "helper/index";
import FlashStorage from "services/FlashStorage";

import { FinanceTable } from "./FinanceTable";
import SecondaryNav from "components/SecondaryNav/SecondaryNav";

import AccountSearch from "./AccountSearch";
//redux actions

// import { loadAccountsSearchAsync } from "redux/actions/account";

// import { loadAccountsAsync } from "redux/actions/account";



const useStyles = makeStyles(() => ({
  table: {
    minWidth: 750,
  },
}));

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

export const FinanceTablePage = ({ location, history }) => {
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

  const [selectedAccount, setAccount] = useState({_id:'', type: ''});
  const [showList, setShowList] = useState(false);
  const [searchOption, setSearchOption] = useState('name');
  const [startDate, setStartDate] = useState(
    moment()
      .utc()
      .toISOString()
  );
  const [endDate, setEndDate] = useState(
    moment()
      .utc()
      .toISOString()
  );

  const [processing, setProcessing] = useState(false);

  const [alert, setAlert] = useState(
    FlashStorage.get("TRANSACTION_ALERT") || { message: "", severity: "info" }
  );

  useEffect(() => {
    
    if(searchParams.has('accountId')){
      const accountId = searchParams.get('accountId');
      updateData(accountId);
    }else{
      updateData(selectedAccount._id);
    }
  }, [page, rowsPerPage, sort, selectedAccount, startDate, endDate]);

  // useEffect(() => {
  //   if (query) {
  //     // ApiAccountService.getAccountByKeyword(page, pageSize, keyword = "").then(({data}) => {

  //     // });
  //     // loadAccounts(query, searchOption);
  //   }
  // }, [query]);

  const updateData = (accountId) => {
    ApiTransactionService.getTransactionList(
      page,
      rowsPerPage,
      accountId,
      startDate,
      endDate,
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

  const handleSelectSearch = (id, name) => {
    // const account = accounts.find(a => a._id === id);
    // const type = account ? account.type : 'client';
    // setAccount({_id:id, type});
    // setQuery(name);
  };

  const handleSelectAccount = account => {
    const type = account ? account.type : 'client';
    setAccount({_id: account? account._id: '', type});
    setQuery(account? account.username:'');
  }

  const handleUpdateAccount = () => {
    if(selectedAccount && selectedAccount._id){
      removeAlert();
      setProcessing(true);
      ApiTransactionService.updateTransactions(selectedAccount._id).then(({ data }) => {
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

  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary">
              <GridContainer>
                <GridItem xs={12} lg={6}>
                  <h4>{t("Finance")}</h4>
                  {/* <SecondaryNav
                    tabs={[
                      { title: "Finance", route: "/finance" },
                      { title: "Exception", route: "/finance/exception" },
                    ]}
                    history={history}
                  /> */}
                    <Button
                      // href="finance/salary"
                      variant="contained"
                      color="default"
                      onClick={()=>{history.push("/finance/salary")}}
                    >
                      <AddCircleOutlineIcon />
                      {t("Pay Salary")}
                    </Button>
                </GridItem>
                <GridItem xs={12} lg={6} align="right">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <TimePicker
                      label="Start Date"
                      date={startDate}
                      getDate={setStartDate}
                    />
                    <TimePicker
                      label="End Date"
                      date={endDate}
                      getDate={setEndDate}
                    /> */}
                  </div>

                  <AccountSearch
                    val={query}
                    handleSelectAccount={handleSelectAccount}
                  />

                </GridItem>
                <GridItem>
                  <Button
                    variant="contained"
                    color="default"
                    onClick={()=>handleUpdateAccount()}
                    >
                    {t("Update")}
                  </Button>
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
                    account={selectedAccount}
                    rows={transactions}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalRows={totalRows}
                    sort={sort}
                    loading={loading}
                    setRowsPerPage={setRowsPerPage}
                    setSort={setSort}
                    setPage={setPage}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

FinanceTablePage.propTypes = {
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
// )(FinanceTablePage);
