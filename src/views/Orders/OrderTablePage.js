import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import { DatePicker } from "components/DatePicker/DatePicker.js";
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

// import { Button } from "@material-ui/core";
// import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
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
import ProductSearch from "components/ProductSearch/ProductSearch";
import AccountSearch from "components/AccountSearch/AccountSearch";
import ApiAccountService from "services/api/ApiAccountService";

const styles = {
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

const OrderTablePage = ({ selectOrder, account, deliverDate, setDeliverDate, setAccount, location, history }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [model, setModel] = useState({});
  const [orders, setOrders] = useState([]);
  const [product, setProduct] = useState({_id:'', name:''});
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
  const [sort, setSort] = useState(["delivered", -1]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [processing, setProcessing] = useState(false);

  const updateData = (product) => {
    const qProduct = product && product._id ? {'items.productId': product._id} : {};
    const qDeliverDate = deliverDate ? {deliverDate} : {};
    const keyword = query;
    const qKeyword = keyword ? {
      $or: [
      { clientName: { $regex: keyword }},
      { clientPhone: { $regex: keyword }},
      { code: { $regex: keyword }}
    ]} : {};

    const condition = {
      status: {
        $nin: [OrderStatus.BAD, OrderStatus.DELETED, OrderStatus.TEMP],
      },
      type: 'G',
      ...qKeyword,
      ...qDeliverDate,
      ...qProduct,
    };

    ApiOrderService.getOrders(page, rowsPerPage, condition, [sort]).then(
      ({ data }) => {
        setOrders(data.data);
        setTotalRows(data.count);
        setLoading(false);
        // ?
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

  const handleDeliverDateClick = () => {

  }

  const handleNewOrder = () => {
    setModel({
      ...defaultOrder,
      modifyBy: account ? account._id : '',
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
            updateData(product);
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

  const handleSearch = () => {
    setLoading(true);
    if (page === 0) {
      updateData(product);
    } else {
      setPage(0);
    }
  }

  const handleSelectProduct = (product) => {
    setProduct(product);
    setLoading(true);
    updateData(product);
  }
  const handleClearProduct = () => {
    setProduct({_id:'', name:''});
    setLoading(true);
    updateData(null);
  }
  // const [deliverDate, setDeliverDate] = useState(
  //   moment.utc().toISOString()
  // );

  const handleSelectClient = account => {
    const type = account ? account.type : 'client';
    setAccount({ _id: account ? account._id : '', type });
    setQuery(account ? account.username : '');
    // updateData(product);
  }

  const handleClearClient = () => {
    setQuery("");
  }

  const handleSearchClient = (page, rowsPerPage, keyword) => {
    return ApiAccountService.getAccountByKeyword(page, rowsPerPage, keyword);
  }

  useEffect(() => {
    // if(!account){
    //   ApiAuthService.getCurrentAccount().then(({ data }) => {
    //     setLoggedInAccount(data);
    //     updateData(product);
    //   });
    // }else{
      updateData(product);
    // }
  }, [page, rowsPerPage, sort, query, deliverDate]);


  return (
    <div className={classes.orderPage}>
        <Card>
          <CardHeader color="primary">
            <GridContainer>
            <GridItem xs={12} sm={12} lg={6}>
                <Box pb={2} mt={2}>
                  {/* <Searchbar
                    onChange={e => {setQuery(e.target.value);}}
                    onSearch={handleSearch}
                    placeholder={t("Search Code or Phone number")}
                  /> */}
                    <AccountSearch
                      label="Account"
                      placeholder="Search name or phone"
                      val={query}
                      onSelect={handleSelectClient}
                      onSearch={handleSearchClient}
                      onClear={handleClearClient}
                    />
                </Box>
              </GridItem>
              <GridItem xs={12} sm={12} lg={6}>
                <GridItem xs={12} sm={12} lg={12}>
                  <DatePicker label={"Deliver Date"}
                    date={deliverDate}
                    onChange={handleDeliverDateChange}
                    onClick={handleDeliverDateClick}
                    onClear={handleDeliverDateClear}
                    />
                </GridItem>
                <GridItem xs={12} sm={12} lg={12}>
                  <ProductSearch 
                    label={t("Product")}
                    placeholder="Search Product Name"
                    name={product ? product.name:''}
                    id={product ? product._id:''}
                    onSelect={handleSelectProduct}
                    onClear={handleClearProduct}
                  />
                </GridItem>
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
          <CardFooter>

          </CardFooter>
        </Card>
    </div>
  );
}

OrderTablePage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};


const mapStateToProps = (state) => ({
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
  {
    selectOrder, setDeliverDate, setAccount, 
    // setLoggedInAccount
  }
)(OrderTablePage);
