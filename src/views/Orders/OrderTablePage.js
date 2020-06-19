import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
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
import CardFooter from "components/Card/CardFooter.js";

import { Button } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { getQueryParam } from "helper/index";
import { Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import FlashStorage from "services/FlashStorage";
import Searchbar from "components/Searchbar/Searchbar";
import ApiOrderService, {OrderStatus} from "services/api/ApiOrderService";
import { OrderTable } from './OrderTable';

import * as moment from "moment";
// import { deliverDate } from "redux/reducers/order";
import { selectOrder, setDeliverDate } from 'redux/actions/order';
import {setAccount, setLoggedInAccount} from 'redux/actions/account';

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

const defaultOrder = {
  code:'',
  clientId: '',
  clientName: '',
  merchantId: '',
  merchantName: '',
  items: [],
  location: null,
  price:0,
  cost:0,
  total: 0,
  type:"G",
  status:"N",
  paymentStatus: "U",
  paymentMethod: 'PC',
  paymentId: "",
  deliverDate: moment().format('YYYY-MM-DD'),
  delivered: moment().toISOString(),
  note: ''
}

const OrderTablePage = ({ order, selectOrder, loggedInAccount, deliverDate, setDeliverDate, setAccount, setLoggedInAccount, location, history }) => {
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

  const updateData = (deliverDate, merchants) => {
    const qDeliverDate = deliverDate ? {deliverDate} : {};
    const keyword = query;
    const condition = keyword ? {
      $or: [
        { clientName: { $regex: keyword }},
        { clientPhone: { $regex: keyword }},
        { code: { $regex: keyword }}
      ],
      merchantId: {$in: merchants},
      status: {
        $nin: [OrderStatus.BAD, OrderStatus.DELETED, OrderStatus.TEMP],
      },
      ...qDeliverDate
    } : {
      merchantId: {$in: merchants},
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
    updateData(null, loggedInAccount.merchants);
  }

  const handleDeliverDateChange = (m) => {
    const date = m ? m.format('YYYY-MM-DD') : null;
    setDeliverDate(date);
    updateData(date, loggedInAccount.merchants);
  }

  const handleDeliverDateClick = () => {

  }

  const handleNewOrder = () => {
    setModel({
      ...defaultOrder,
      modifyBy: loggedInAccount ? loggedInAccount._id : '',
      created: moment.utc().toISOString()
    });
  }

  const handleSelectOrder = (data) => {
    setModel(data);
    selectOrder(data);
    const _id = data.clientId;
    const username = data.clienName;
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
            updateData(deliverDate, loggedInAccount.merchants);
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
    if(!loggedInAccount){
      ApiAuthService.getCurrentAccount().then(({ data }) => {
        setLoggedInAccount(data.data);
        updateData(deliverDate, data.data.merchants);
      });
    }else{
      updateData(deliverDate, loggedInAccount.merchants);
    }
  }, [page, rowsPerPage, sort, query, deliverDate]);


  return (
    <GridContainer>
        <Card>
          <CardHeader color="primary">
            <GridContainer>
              <GridItem xs={12} sm={12} lg={12}>
                <h4>{t("Orders")}</h4>
              </GridItem>
              <GridItem xs={12} sm={12} lg={3}>
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
              {/* <GridItem xs={12} sm={12} lg={3}>
                <Box mt={2}>
                  <Link to="/orders/new">
                  <Button
                    color="default"
                    variant="contained"
                    disabled={processing}
                  >
                    <AddCircleOutlineIcon />
                    {t("New Order")}
                  </Button>
                  </Link>
                </Box>
              </GridItem> */}
              {/* <GridItem xs={12} sm={12} lg={6}>
                <Box pb={2} mt={2}>
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
                </Box>
              </GridItem> */}
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
          <CardFooter>

          </CardFooter>
        </Card>
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
  loggedInAccount: state.loggedInAccount
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
