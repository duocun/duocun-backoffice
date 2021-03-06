import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import moment from "moment";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import SearchDropDown from "components/SearchDropDown/SearchDropDown.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Searchbar from "components/Searchbar/Searchbar";
import TimePicker from "components/TimePicker/TimePicker";

import Alert from "@material-ui/lab/Alert";
import ApiTransactionService from "services/api/ApiTransactionService";

import { getQueryParam } from "helper/index";
import FlashStorage from "services/FlashStorage";

import { TransactionTable } from "./TransactionTable";
import SecondaryNav from "components/SecondaryNav/SecondaryNav";

//redux actions
// import { loadAccountsAsync } from "redux/actions/account";

import { Throttle } from "react-throttle";

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 750
  }
}));

export const FinanceException = ({ location, history }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  // states related to list and pagniation
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(
    getQueryParam(location, "page")
      ? parseInt(getQueryParam(location, "page"))
      : 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  // const [query, setQuery] = useState(getQueryParam(location, "search") || "");
  const [sort, setSort] = useState(["_id", 1]);
  const [selectUserId, setSelectUserId] = useState("");
  const [showList, setShowList] = useState(false);

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

  // states related to processing
  const [alert, setAlert] = useState(
    FlashStorage.get("TRANSACTION_ALERT") || { message: "", severity: "info" }
  );

  useEffect(() => {
    updateData();
  }, [page, rowsPerPage, sort, selectUserId, startDate, endDate]);

  useEffect(() => {
    if (query) {
      loadAccounts(query);
    }
  }, [query]);

  const handleOnchange = e => {
    const { target } = e;
    setQuery(target.value);
  };

  const updateData = () => {
    const condition = {
      $or: [
        {
          fromId: selectUserId
        },
        {
          toId: selectUserId
        }
      ],
      status: { $nin: ["bad", "tmp"] }
    };
    ApiTransactionService.getTransactionList(page, rowsPerPage, condition, [
      sort
    ]).then(({ data }) => {
      setTransactions(data.data);
      setTotalRows(data.count);
      setLoading(false);
    });
  };

  const handleSelectSearch = (id, name) => {
    setSelectUserId(id);
    setQuery(name);
  };

  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };

  const handleShowList = () => {
    setShowList(true);
  };

  const handleHideList = () => {
    setTimeout(() => {
      setShowList(false);
    }, 500);
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary">
              <GridContainer>
                <GridItem xs={12} lg={6}>
                  <h4>{t("Exception")}</h4>
                  <SecondaryNav
                    tabs={[
                      { title: "Finance", route: "/finance" },
                      { title: "Exception", route: "/finance/exception" }
                    ]}
                    history={history}
                  />
                </GridItem>
                <GridItem xs={12} lg={6} align="right">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <TimePicker
                      label="Start Date"
                      date={startDate}
                      getDate={setStartDate}
                    />
                    <TimePicker
                      label="End Date"
                      date={endDate}
                      getDate={setEndDate}
                    />
                  </div>
                  <Throttle time="1000" handler="onChange">
                    <Searchbar
                      value={query}
                      onChange={handleOnchange}
                      onSearch={() => {
                        setLoading(true);
                        if (page === 0) {
                          updateData();
                        } else {
                          setPage(0);
                        }
                      }}
                      onFocus={handleShowList}
                      onBlur={handleHideList}
                      ifSearch={false}
                    />
                  </Throttle>
                  <SearchDropDown
                    data={accounts}
                    hasMore={hasMoreAccounts}
                    fetchData={fetchAccounts}
                    onClick={handleSelectSearch}
                    show={showList}
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
                  <TransactionTable
                    rows={transactions}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalRows={totalRows}
                    // sort={sort}
                    loading={loading}
                    setRowsPerPage={setRowsPerPage}
                    // setSort={setSort}
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
};

FinanceException.propTypes = {
  location: PropTypes.object,
  loadAccounts: PropTypes.func,
  accounts: PropTypes.array,
  history: PropTypes.object
};

// const mapStateToProps = (state) => ({ accounts: state.accounts });
// const mapDispatchToProps = (dispatch) => ({
//   loadAccounts: (payload) => {
//     dispatch(loadAccountsAsync(payload));
//   },
// });
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(FinanceException);
