import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import { IconButton, InputAdornment } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import {
  Clear as ClearIcon,
  InsertInvitation as CalendarIcon
} from "@material-ui/icons";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
// import CardFooter from "components/Card/CardFooter.js";

import Searchbar from "components/Searchbar/Searchbar";
import { getQueryParam } from "helper/index";
import FlashStorage from "services/FlashStorage";
import { Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import ApiOrderService, {OrderStatus} from "services/api/ApiOrderService";
import { OrderTable } from './OrderTable';

import * as moment from "moment";
// import { deliverDate } from "redux/reducers/order";
import { selectOrder, setDeliverDate } from 'redux/actions/order';
import {setAccount, setLoggedInAccount} from 'redux/actions/account';

import OrderForm from './OrderForm';
import ApiAuthService from 'services/api/ApiAuthService';

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);

const OrderTablePage = ({ order, selectOrder, account, deliverDate, setDeliverDate, setAccount, setLoggedInAccount, location, history }) => {
  const { t } = useTranslation();
  
  const [model, setModel] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(
    getQueryParam(location, "page")
      ? parseInt(getQueryParam(location, "page"))
      : 0
  );
  const [query, setQuery] = useState(getQueryParam(location, "search") || "");
  // states related to processing
  const [alert, setAlert] = useState(
    FlashStorage.get("ORDER_ALERT") || { message: "", severity: "info" }
  );

  const [totalRows, setTotalRows] = useState(0);
  const [sort, setSort] = useState(["_id", -1]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const updateData = () => {
    const qDeliverDate = deliverDate ? {deliverDate} : {};
    const keyword = query;
    const condition = {
      $or: [
        {clientName: { $regex: keyword }},
        {code: { $regex: keyword }}, 
        {'client.phone': { $regex: keyword }}
      ],
      status: {
        $nin: [OrderStatus.BAD, OrderStatus.DELETED, OrderStatus.TEMP],
      },
      ...qDeliverDate
    };
    ApiOrderService.getOrders(page, rowsPerPage, condition, [sort]).then(
      ({ data }) => {
        setOrders(data.data);
        setTotalRows(data.count);
        setLoading(false);
        if(data.data && data.data.length>0){
          const d = data.data[0];
          setModel(d);
          const _id = d.clientId ? d.clientId : '';
          const username = d.clientName ? d.clientName: '';
          setAccount({_id, username, type: 'client'});
        }
      }
    );
  };
  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };

  const [processing, setProcessing] = useState(false);

  const handleDeliverDateClear = (e) => {
    // const date = m ? m.format('YYYY-MM-DD') : '';
    // setDeliverDate(date);
    e.stopPropagation();
    setDeliverDate(null);
  }

  const handleDeliverDateChange = (m) => {
    const date = m ? m.format('YYYY-MM-DD') : null;
    setDeliverDate(date);
  }
  const handleToTransactionHistory = () => {
    history.push('/finance/transaction');
  }
  const handleDeliverDateClick = () => {

  }

  const handleUpdateData = () => {
    updateData();
  }

  const handleSelectOrder = (data) => {
    setModel(data);
    selectOrder(data);
    const _id = data.client ? data.client._id : '';
    const username = data.client ? data.client.username : '';
    setAccount({_id, username, type:'client'});
  }

  const handleDeleteOrder = (_id) => {
    if (window.confirm('Are you sure to delete ?')) {
      if (_id) {
        removeAlert();
        setProcessing(true);
        ApiOrderService.removeOrder(_id).then(({ data }) => {
          if (data.code === 'success') {
            setAlert({
              message: t("Delete successfully"),
              severity: "success"
            });
            updateData();
          } else {
            setAlert({
              message: t("Delete failed"),
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

  // const [deliverDate, setDeliverDate] = useState(
  //   moment.utc().toISOString()
  // );

  useEffect(() => {
    if(!account){
      ApiAuthService.getCurrentAccount().then(({ data }) => {
        setLoggedInAccount(data);
        updateData();
      });
    }else{
      updateData();
    }
  }, [page, rowsPerPage, sort, query, deliverDate]);


  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={8}>
        <Card>
          <CardHeader color="primary">
            <GridContainer>
              <GridItem xs={12} lg={6}>
                <h4>{t("Orders")}</h4>
              </GridItem>
              <GridItem xs={12} lg={6} align="right">
                <Box mr={2} style={{ display: "inline-block" }}>
                  {/* <Button
                      href="orders/new"
                      variant="contained"
                      color="default"
                    >
                      <AddCircleOutlineIcon />
                      {t("New Order")}
                    </Button> */}
                </Box>

              </GridItem>
              <GridItem xs={12} sm={12} lg={6} align="left">
                <KeyboardDatePicker
                  variant="inline"
                  label={t("Deliver Date")}
                  format="YYYY-MM-DD"
                  value={deliverDate ? moment.utc(deliverDate) : null}
                  onChange={handleDeliverDateChange}
                  onClick={handleDeliverDateClick}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  keyboardIcon={
                    deliverDate ? (
                        <IconButton onClick={handleDeliverDateClear}>
                          <ClearIcon />
                        </IconButton>
                    ) : (
                        <IconButton>
                          <CalendarIcon />
                        </IconButton>
                    )
                  }
                />
              </GridItem>
              <GridItem xs={12} sm={12} lg={6} align="left">
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
          {!!alert.message && (
              <GridItem xs={12}>
                <Alert severity={alert.severity} onClose={removeAlert}>
                  {alert.message}
                </Alert>
              </GridItem>
            )}
            <OrderTable rows={orders}
              page={page}
              rowsPerPage={rowsPerPage}
              totalRows={totalRows}
              sort={sort}
              loading={loading}
              setRowsPerPage={setRowsPerPage}
              setSort={setSort}
              setPage={setPage}
              selectData={handleSelectOrder}
              removeData={handleDeleteOrder} />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={4}>
          <OrderForm
            account={account}
            data={model}
            update={handleUpdateData}
            toTransactionHistory={handleToTransactionHistory}
             />
        </GridItem>
    </GridContainer>
  );
}

OrderTablePage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};


const mapStateToProps = (state) => ({
  order: state.order, 
  deliverDate: state.deliverDate,
  account: state.loggedInAccount
});
// const mapDispatchToProps = (dispatch) => ({
//   loadAccounts: (payload, searchOption) => {
//     dispatch(loadAccountsAsync(payload, searchOption));
//   },
// });
export default connect(
  mapStateToProps,
  {selectOrder, setDeliverDate, setAccount, setLoggedInAccount}
)(OrderTablePage);
