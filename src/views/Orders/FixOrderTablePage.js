import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { DatePicker } from "components/DatePicker/DatePicker.js";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";


import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "components/Table/TablePagniation.js";
import TableRow from "@material-ui/core/TableRow";
import TableBodySkeleton from "components/Table/TableBodySkeleton";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";


import Alert from "@material-ui/lab/Alert";

import FlashStorage from "services/FlashStorage";
import ApiOrderService, { OrderStatus } from "services/api/ApiOrderService";
import PaymentService from "services/api/ApiPaymentService";

import { OrderTable } from "./OrderTable";

import { selectOrder, setDeliverDate } from "redux/actions/order";
import { setAccount } from "redux/actions/account";

import ProductSearch from "components/ProductSearch/ProductSearch";
import AccountSearch from "components/AccountSearch/AccountSearch";
import ApiAccountService from "services/api/ApiAccountService";
import { UNASSIGNED_DRIVER_ID } from "views/Maps/OrderMapPage";

import { TableHeader } from "components/Table/TableHeader";


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

const formatAddress = location => {
  if (!location) return "";
  return location.streetNumber + " " + location.streetName;
};

const formatAddressLine2 = location => {
  if (!location) return "";
  return location.city + " " + location.province + ", " + location.postalCode;
};


const FixOrderTablePage = ({
  selectOrder,
  account,
  deliverDate,
  setDeliverDate,
  setAccount
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [orders, setOrders] = useState([]);
  const [product, setProduct] = useState({ _id: "", name: "" });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const [clientKeyword, setClientKeyword] = useState(
    account ? account.username : ""
  );
  // states related to processing
  const [alert, setAlert] = useState(
    FlashStorage.get("ORDER_ALERT") || { message: "", severity: "info" }
  );
  const [driverKeyword, setDriverKeyword] = useState("");
  const [driver, setDriver] = useState({ _id: "", username: "" });

  const [totalRows, setTotalRows] = useState(0);
  const [sort, setSort] = useState(["delivered", -1]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [processing, setProcessing] = useState(false);

  const updateData = useCallback(
   (product, keyword) => {
    const qProduct =
      product && product._id ? { "items.productId": product._id } : {};
    const qDeliverDate = deliverDate ? { deliverDate } : {};
    const qDriver =
      driver._id && driver._id !== UNASSIGNED_DRIVER_ID
        ? { driverId: driver._id }
        : {};
    const qKeyword = keyword
      ? {
          $or: [
            { clientName: { $regex: keyword } },
            { clientPhone: { $regex: keyword } },
            { code: { $regex: keyword } }
          ]
        }
      : {};

    const condition = {
      status:  OrderStatus.TEMP,
      paymentStatus: 'U',
      type: "G",
      ...qKeyword,
      ...qDeliverDate,
      ...qProduct,
      ...qDriver
    };

    ApiOrderService.getOrders(page, rowsPerPage, condition, [sort]).then(
      ({ data }) => {
        setOrders(data.data);
        setTotalRows(data.count);
        setLoading(false);
        // ?
        if (data.data && data.data.length > 0) {
          const d = data.data[0];
          const _id = d.clientId ? d.clientId : "";
          const username = d.clientName ? d.clientName : "";
          setAccount({ _id, username, type: "client" });
        }
      }
    );
  }, [deliverDate, driver._id, page, rowsPerPage, setAccount, sort]);

  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };

  const handleDeliverDateClear = e => {
    // const date = m ? m.format('YYYY-MM-DD') : '';
    // setDeliverDate(date);
    e.stopPropagation();
    setDeliverDate(null);
  };

  const handleDeliverDateChange = m => {
    const date = m ? m.format("YYYY-MM-DD") : null;
    setDeliverDate(date);
  };

  const handleDeliverDateClick = () => {};

  const handleSelectOrder = data => {
    selectOrder(data);
    const _id = data.clientId;
    const username = data.clienName;
    setAccount({ _id, username, type: "client" });
  };

  const handleDeleteOrder = _id => {
    if (window.confirm("Are you sure to delete ?")) {
      if (_id) {
        removeAlert();
        setProcessing(true);
        ApiOrderService.removeOrder(_id)
          .then(({ data }) => {
            if (data.code === "success") {
              setAlert({
                message: t("Delete successfully"),
                severity: "success"
              });
              updateData(product, clientKeyword);
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

  // const handleSearch = () => {
  //   setLoading(true);
  //   if (page === 0) {
  //     updateData(product);
  //   } else {
  //     setPage(0);
  //   }
  // }

  const handleSelectProduct = product => {
    setProduct(product);
    setLoading(true);
    updateData(product, clientKeyword);
  };
  const handleClearProduct = () => {
    setProduct({ _id: "", name: "" });
    setLoading(true);
    updateData(null, clientKeyword);
  };
  // const [deliverDate, setDeliverDate] = useState(
  //   moment.utc().toISOString()
  // );

  const handleSelectClient = account => {
    const type = account ? account.type : "client";
    const username = account ? account.username : "";
    setAccount({ _id: account ? account._id : "", username, type });
    setClientKeyword(username);
    // updateData(product);
  };

  const handleClearClient = () => {
    setAccount({ _id: "", username: "", type: "client" });
    setClientKeyword("");
  };

  const handleSearchClient = (page, rowsPerPage, keyword) => {
    return ApiAccountService.getAccountByKeyword(page, rowsPerPage, keyword);
  };

  const handleSelectDriver = account => {
    const type = account ? account.type : "driver";
    setDriver({ _id: account ? account._id : "", type });
    setDriverKeyword(account ? account.username : "");
    // updateData(product);
  };

  const handleClearDriver = () => {
    setDriverKeyword("");
    setDriver({ _id: "", username: "" });
  };

  const handleSearchDriver = (page, rowsPerPage, keyword) => {
    return ApiAccountService.getAccountByKeyword(page, rowsPerPage, keyword, [
      "driver"
    ]);
  };

  const selectData = () => {

  }
  const removeData = () => {

  }
  const toDateString = s => {
    return s ? s.split("T")[0] : "";
  };

  const handleFix = order => {
    // payment_method string,  trans_amount: number, out_order_no: string(paymentId)
    // export const SnappayPaymentMethod = {
    //   ALI: 'ALIPAY',
    //   WECHAT: 'WECHATPAY',
    //   UNIONPAY: 'UNIONPAY_QR'
    // }
    
    const paymentId = order.paymentId;
    const paymentMethod = order.paymentMethod;

    ApiOrderService.queryOrders({paymentId}).then( ({data}) => {
      if(data.code === 'success'){

        const orders = data.data;
        let total = 0;
        orders.forEach(x => {
          total += x.total;
        })

        const amount = Math.round(total*100)/100;
        PaymentService.fixSnappay(paymentId, paymentMethod, amount).then(({data}) => {
          if(data.code === "0"){
            updateData(product, clientKeyword);
            console.log('update success!');
            setAlert({
              message: "update payment successfully",
              severity: "success"
            });
          }
        });
      }
    });
  }

  // useEffect(() => {
  //   const keyword = account? account.username : '';
  //   setClientKeyword(keyword);
  // }, [account]);

  useEffect(() => {
    // if(!account){
    //   ApiAuthService.getCurrentAccount().then(({ data }) => {
    //     setLoggedInAccount(data);
    //     updateData(product);
    //   });
    // }else{
    updateData(product, clientKeyword);
    // }
  }, [page, rowsPerPage, sort, clientKeyword, driverKeyword, deliverDate, product, updateData]);

  return (
    <div className={classes.orderPage}>
      <Card>
        <CardHeader color="primary">
          <GridContainer>
            <GridItem xs={12} sm={4} lg={3}>
              <AccountSearch
                label="Client"
                placeholder="Search name or phone"
                val={clientKeyword}
                onSelect={handleSelectClient}
                onSearch={handleSearchClient}
                onClear={handleClearClient}
                onEndClicked={keyword => {
                  setClientKeyword(keyword);
                }}
              />
            </GridItem>

            <GridItem xs={12} sm={4} lg={3}>
              <DatePicker
                label={"Deliver Date"}
                date={deliverDate}
                onChange={handleDeliverDateChange}
                onClick={handleDeliverDateClick}
                onClear={handleDeliverDateClear}
              />
            </GridItem>
            <GridItem xs={12} sm={4} lg={3}>
              <AccountSearch
                label="Driver"
                placeholder="Search name or phone"
                val={driverKeyword}
                onSelect={handleSelectDriver}
                onSearch={handleSearchDriver}
                onClear={handleClearDriver}
              />
            </GridItem>
            <GridItem xs={12} sm={4} lg={3}>
              <ProductSearch
                label={t("Product")}
                placeholder="Search Product Name"
                name={product ? product.name : ""}
                id={product ? product._id : ""}
                onSelect={handleSelectProduct}
                onClear={handleClearProduct}
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

          {
            !processing &&
            // <OrderTable
            // rows={orders}
            // page={page}
            // rowsPerPage={rowsPerPage}
            // totalRows={totalRows}
            // sort={sort}
            // loading={loading}
            // setRowsPerPage={setRowsPerPage}
            // setSort={setSort}
            // setPage={setPage}
            // selectData={handleSelectOrder}
            // removeData={handleDeleteOrder}
            // />

            <TableContainer>
        <Table className={classes.table} aria-label="Order Table" size="small">
          <TableHeader
            data={[
              { field: "code", label: "Code" },
              { field: "delivered", label: "Deliver Date" },
              { field: "clientName", label: "Client" },
              { field: "address", label: "Address" },
              { field: "merchantName", label: "Merchant" },
              { field: "items", label: "Product" },
              { field: "note", label: "Note" },
              { field: "actions", label: "Actions" }
            ]}
            sort={sort}
            onSetSort={setSort}
          />
          <TableBody>
            {loading ? (
              <TableBodySkeleton colCount={7} rowCount={rowsPerPage} />
            ) : (
              // <OrderTable rows={orders} page={page} rowsPerPage={rowsPerPage} processing={processing}/>
              <React.Fragment>
                {orders &&
                  orders.length > 0 &&
                  orders.map((row, idx) => (
                    <TableRow key={idx} onClick={() => selectData(row)}>
                      <TableCell>{row.code}</TableCell>
                      <TableCell>{toDateString(row.delivered)}</TableCell>
                      <TableCell>
                        <div>{row.clientName ? row.clientName : ""}</div>
                        <div>{row.clientPhone ? row.clientPhone : "N/A"}</div>
                      </TableCell>
                      <TableCell>
                        <div>{formatAddress(row.location)}</div>
                        <div>{formatAddressLine2(row.location)}</div>
                      </TableCell>
                      <TableCell>
                        {row.merchantName ? row.merchantName : "N/A"}
                      </TableCell>
                      <TableCell>
                        {row.items &&
                          row.items.length > 0 &&
                          row.items.map(it => (
                            <div key={it.productId}>
                              {it.productName} x{it.quantity}
                            </div>
                          ))}
                      </TableCell>
                      <TableCell>
                        {row.note ? row.note : ""}
                      </TableCell>
                      <TableCell className={classes.operationRow}>
                        {/* <Link to={`orders/clone`}>
                          <IconButton aria-label="clone">
                            <FileCopyIcon />
                          </IconButton>
                        </Link> */}
                        {/* <Link to={`orders/${row._id}`}> */}
                          <IconButton aria-label="edit" onClick={(e) => handleFix(row)}>
                            <EditIcon />
                          </IconButton>
                        {/* </Link> */}
                        {/* <IconButton
                          aria-label="delete"
                          disabled={processing}
                          onClick={() => removeData(row._id)}
                        >
                          <DeleteIcon />
                        </IconButton> */}
                      </TableCell>
                    </TableRow>
                  ))}
              </React.Fragment>
            )}
          </TableBody>
        </Table>

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
      </TableContainer>
          }

        </CardBody>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

FixOrderTablePage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};

const mapStateToProps = state => ({
  deliverDate: state.deliverDate,
  account: state.account
});
// const mapDispatchToProps = (dispatch) => ({
//   loadAccounts: (payload, searchOption) => {
//     dispatch(loadAccountsAsync(payload, searchOption));
//   },
// });
export default connect(
  mapStateToProps,
  {
    selectOrder,
    setDeliverDate,
    setAccount
  }
)(FixOrderTablePage);
