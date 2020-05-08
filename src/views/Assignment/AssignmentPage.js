import React, { useState, useEffect } from "react";
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

import Alert from "@material-ui/lab/Alert";
import ApiOrderService from "services/api/ApiOrderService";

import { getQueryParam } from "helper/index";
import FlashStorage from "services/FlashStorage";

import { OrderTable } from "./OrderTable";
import DriverTable from "./DriverTable";
import AssignmentMap from "./Map";

//redux actions
import { loadDriversAsync } from "redux/actions/driver";

import { Throttle } from "react-throttle";

const useStyles = makeStyles({
  flexCard: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
});

function AssignmentPage({ location, accounts, loadDrivers, history, drivers }) {
  const { t } = useTranslation();
  const classes = useStyles();
  // states related to list and pagniation
  const [orders, setOrders] = useState([]);
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
  const [selectUserId, setSelectUserId] = useState("");

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
    loadDrivers();
  }, []);

  const updateData = () => {
    ApiOrderService.getOrderListByDate(
      page,
      rowsPerPage,
      query,
      startDate,
      endDate,
      [sort]
    ).then(({ data }) => {
      console.log(data);
      setOrders(data.data);
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

  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary">
              <GridContainer>
                <GridItem xs={12} lg={6}>
                  <h4>{t("Assignment")}</h4>
                </GridItem>
                <GridItem xs={12} lg={6} align="right">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
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
                  </Throttle>
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
                  <div className={classes.flexCard}>
                    <OrderTable
                      rows={orders}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      totalRows={totalRows}
                      sort={sort}
                      loading={loading}
                      setRowsPerPage={setRowsPerPage}
                      setSort={setSort}
                      setPage={setPage}
                    />
                    <div style={{width:'50%' ,display:'flex', justifyContent:'center'}}>
                      <AssignmentMap orders={orders}/>
                      <DriverTable drivers={drivers} />
                    </div>
                  </div>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

AssignmentPage.propTypes = {
  location: PropTypes.object,
  loadAccounts: PropTypes.func,
  accounts: PropTypes.array,
  history: PropTypes.object,
  drivers: PropTypes.array,
};

const mapStateToProps = (state) => ({
  accounts: state.accounts,
  drivers: state.drivers,
});
const mapDispatchToProps = (dispatch) => ({
  loadDrivers: () => {
    dispatch(loadDriversAsync());
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignmentPage);
