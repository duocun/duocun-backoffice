import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import * as moment from "moment";
import { KeyboardDatePicker } from "@material-ui/pickers";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";

import Alert from "@material-ui/lab/Alert";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

// icons
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import SaveIcon from "@material-ui/icons/Save";
import HistoryIcon from "@material-ui/icons/History";

import FlashStorage from "services/FlashStorage";

import AccountSearch from "components/AccountSearch/AccountSearch";
import AddressSearch from "components/AddressSearch/AddressSearch";
import OrderItemEditor from "views/Orders/OrderItemEditor";

import AuthService from "services/AuthService";
import ApiAuthService from "services/api/ApiAuthService";
import ApiAccountService from "services/api/ApiAccountService";
import ApiOrderService from "services/api/ApiOrderService";
import ApiMerchantService from "services/api/ApiMerchantService";

import { selectOrder, setDeliverDate } from "redux/actions/order";
import { setAccount } from "redux/actions/account";

const useStyles = makeStyles(() => ({}));

const FormMode = {
  NEW: "new",
  EDIT: "edit",
  CLONE: "clone"
};

const defaultOrdersModel = {
  _id: FormMode.NEW,
  code: "",
  clientId: "",
  merchantId: "",
  items: [],
  price: 0,
  cost: 0,
  location: {},
  delivered: "",
  created: "",
  type: "",
  actionCode: ""
};

/**
 * props --- None
 * redux --- order, account, deliverDate
 */
const OrderFormPage = ({ match, order, history }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [modifyByAccount, setModifyByAccount] = useState({
    _id: "",
    username: ""
  });
  // const [accounts, setAccounts] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [model, setModel] = useState(defaultOrdersModel);
  const [itemMap, setItemMap] = useState({});
  const [productMap, setCheckMap] = useState({});
  const [driverKeyword, setDriverKeyword] = useState("");
  const [processing, setProcessing] = useState(false);
  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };

  const [alert, setAlert] = useState(
    FlashStorage.get("FINANCE_ALERT") || { message: "", severity: "info" }
  );

  useEffect(() => {
    const token = AuthService.getAuthToken();
    ApiAuthService.getCurrentUser(token).then(({ data }) => {
      const account = { ...data.data };
      setModifyByAccount(account);
    });
  }, []);

  useEffect(() => {
    ApiMerchantService.getMerchants({ type: "G", status: "A" }).then(
      ({ data }) => {
        setMerchants(data.data);
      }
    );
  }, []);

  // useEffect(() => {
  //   ApiAccountService.getAccountList(null, null, { type: { $in: ['driver', 'system'] } }).then(({ data }) => {
  //     setAccounts(data.data);
  //   });
  // }, []);

  useEffect(() => {
    if (match.params && match.params.id === FormMode.NEW) {
      // setModel(cloned);
    } else if (match.params && match.params.id === FormMode.CLONE) {
      let cloned = {
        ...order,
        price: 0,
        cost: 0,
        tax: 0,
        total: 0,
        _id: FormMode.CLONE
      };
      setCheckMap(getCheckMap(cloned));
      setDriverKeyword(cloned ? cloned.driverName : "");
      setModel({
        ...cloned,
        modifyBy: modifyByAccount._id
      });
    } else {
      const orderId = match.params.id;
      ApiOrderService.getOrder(orderId).then(({ data }) => {
        const order = data.data;
        setCheckMap(getCheckMap(order));
        setDriverKeyword(order ? order.driverName : "");
        setModel({
          ...order,
          modifyBy: modifyByAccount._id
        });
      });
    }
  }, [match.params, modifyByAccount._id, order]);

  const getCheckMap = model => {
    if (model.items && model.items.length > 0) {
      const checkMap = {};
      model.items.forEach(it => {
        checkMap[it.productId] = { ...it, status: false };
      });
      return checkMap; // setCheckMap(checkMap);
    } else {
      return {};
    }
  };

  const handleCreate = () => {
    if (model._id === "clone") {
      const vs = Object.values(itemMap);
      const items = vs.filter(v => v._id !== "new");

      if (model.clientId && items && items.length > 0) {
        let d = { ...model, items };
        delete d._id;
        delete d.code;

        removeAlert();
        setProcessing(true);
        ApiOrderService.createOrder(d)
          .then(({ data }) => {
            if (data.code === "success") {
              const newAlert = {
                message: t("Saved successfully"),
                severity: "success"
              };
              if (model._id === "new") {
                FlashStorage.set("ORDER_ALERT", newAlert);
                return;
              } else {
                setAlert(newAlert);
              }
            } else {
              setAlert({
                message: t("Save failed"),
                severity: "error"
              });
            }
            setProcessing(false);
          })
          .catch(e => {
            console.error(e);
            setAlert({
              message: t("Save failed"),
              severity: "error"
            });
            setProcessing(false);
          });
      }
    }
  };

  const handleUpdate = () => {
    if (model._id !== "new" && model._id !== "clone" && modifyByAccount._id) {
      removeAlert();
      setProcessing(true);
      setModel({ ...model, modifyBy: modifyByAccount._id });


      ApiOrderService.updateOrder(model)
        .then(({ data }) => {
          if (data.code === "success") {
            setAlert({
              message: t("Update successfully"),
              severity: "success"
            });
          } else {
            setAlert({
              message: t("Update failed"),
              severity: "error"
            });
          }
          setProcessing(false);
        })
        .catch(e => {
          console.error(e);
          setAlert({
            message: t("Update failed"),
            severity: "error"
          });
          setProcessing(false);
        });
    }
  };

  const canSplit = () => {
    const vs = Object.keys(productMap).map(pId => productMap[pId]);
    const checked = vs.filter(v => v.status);
    const unchecked = vs.filter(v => !v.status);
    return checked.length > 0 && unchecked.length > 0;
  };

  const handleSplitOrder = () => {
    const vs = Object.keys(productMap).map(pId => productMap[pId]);
    const checked = vs.filter(v => v.status);
    // const unchecked = vs.filter(v => !v.status);
    if (canSplit()) {
      const r = window.confirm("拆分送货单, 为选中的商品新建一个送货单。");
      if (r) {
        ApiOrderService.splitOrder(model._id, checked).then(({ data }) => {
          updateFormData(model._id);
        });
      }
    }
  };

  const handleSubmit = () => {
    if (model._id && model._id !== "new" && model._id !== "clone") {
      handleUpdate();
    } else {
      handleCreate();
    }
  };
  const handleToggleProduct = (e, it) => {
    const c = { ...productMap };
    c[it.productId].status = e.target.checked;
    setCheckMap(c);
  };

  const updateFormData = id => {
    if (id) {
      ApiOrderService.getOrder(id).then(({ data }) => {
        const order = data.data;
        setModel(order);
      });
    }
  };

  const handleUpdateItemMap = itemMap => {
    setItemMap(itemMap);
    const vs = Object.values(itemMap);
    const items = vs.filter(v => v._id !== "new");
    const charge = ApiOrderService.getChargeFromOrderItems(items, 0);
    setModel({ ...model, ...charge, items });
  };

  const handleSelectDeliverLocation = location => {
    setModel({ ...model, location });
  };

  const handleDeliverDateChange = m => {
    const deliverDate = m.toISOString().split("T")[0];
    setModel({
      ...model,
      deliverDate,
      delivered: `${deliverDate}T15:00:00.000Z`
    });
  };

  const handleSelectDriver = account => {
    setDriverKeyword(account ? account.username : "");
    setModel({
      ...model,
      driverId: account._id,
      driverName: account ? account.username : ""
    });
  };

  const handleClearDriver = () => {
    setDriverKeyword("");
  };

  const handleSearchDriver = (page, rowsPerPage, keyword) => {
    return ApiAccountService.getAccountByKeyword(page, rowsPerPage, keyword, [
      "driver"
    ]);
  };

  const getTitle = () => {
    if (model._id === "new" || model._id === "clone") {
      return "New Order";
    } else {
      return "Edit Order";
    }
  };

  // const [alert, setAlert] = useState({ message: "", severity: "info" });

  //////////////////// For data fetch


  /////////////////// For render and events

  return (
    <Card>
      <CardHeader color="primary">
        <GridContainer>
          <GridItem xs={12} lg={6}>
            <h4>{t(getTitle())}</h4>
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
          {!(model._id === "new" || model._id === "clone") && (
            <GridItem xs={12} md={4} lg={4}>
              <Box pb={2}>
                <TextField
                  id="order-code"
                  label={`${t("Code")}`}
                  value={model.code}
                  InputLabelProps={{ shrink: model.code ? true : false }}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Box>
            </GridItem>
          )}
          <GridItem xs={12} md={4} lg={4}>
            <Box pb={2}>
              <TextField
                id="order-client"
                label={`${t("Client")}`}
                value={model.clientName ? model.clientName : ""}
                InputLabelProps={{ shrink: model.clientId ? true : false }}
                InputProps={{
                  readOnly: true
                }}
              />
            </Box>
          </GridItem>
          <GridItem xs={12} md={4} lg={4}>
            <Box pb={2}>
              <TextField
                id="order-client-phone"
                label={`${t("Client Phone")}`}
                value={model.clientPhone ? model.clientPhone : ""}
                InputLabelProps={{ shrink: model.clientPhone ? true : false }}
                onChange={e => {
                  setModel({ ...model, clientPhone: e.target.value });
                }}
              />
            </Box>
          </GridItem>
          <GridItem xs={12} md={8} lg={8}>
            <Box pb={2}>
              <AddressSearch
                label={"Deliver Address"}
                placeholder={"Search Address"}
                handleSelectLocation={handleSelectDeliverLocation}
                location={model.location}
              />
            </Box>
          </GridItem>

          {(model._id === "new" || model._id === "clone") && (
            <GridItem xs={12} lg={6}>
              <Box pb={2}>
                <FormControl className={classes.select}>
                  <InputLabel id="merchant-label">{t("Merchant")}</InputLabel>
                  <Select
                    id="merchant"
                    labelId="merchant-label"
                    value={model.merchantId}
                    onChange={e => {
                      setModel({
                        ...model,
                        merchantId: e.target.value
                      });
                    }}
                  >
                    {merchants.map(merchant => {
                      return (
                        <MenuItem key={merchant._id} value={merchant._id}>
                          {merchant.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </GridItem>
          )}

          {(model._id === "new" || model._id === "clone") && (
            <GridItem xs={12} lg={12}>
              <Box pb={2}>
                <OrderItemEditor
                  merchantId={model.merchantId}
                  onUpdateItemMap={handleUpdateItemMap}
                />
              </Box>
            </GridItem>
          )}

          {!(model._id === "new" || model._id === "clone") && (
            <GridItem xs={12} lg={12}>
              <Box pb={2}>
                {model.items &&
                  model.items.length > 0 &&
                  model.items.map(it => (
                    <div key={it.productId}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              productMap[it.productId]
                                ? productMap[it.productId].status
                                : false
                            }
                            onChange={e => handleToggleProduct(e, it)}
                            name={`${it.productId}`}
                          />
                        }
                        label={`${it.productName} x ${it.quantity}`}
                        color="primary"
                      />
                    </div>
                  ))}
                <Button
                  color="primary"
                  variant="contained"
                  disabled={processing}
                  onClick={handleSplitOrder}
                >
                  <SaveIcon />
                  {t("Split Order")}
                </Button>
              </Box>
            </GridItem>
          )}
          <GridItem xs={12} md={4} lg={4}>
            <Box pb={2}>
              <TextField
                id="order-total"
                label={`${t("Total")}`}
                value={model.total ? model.total : ""}
                InputLabelProps={{ shrink: model.total ? true : false }}
                InputProps={{
                  readOnly: true
                }}
              />
            </Box>
          </GridItem>

          <GridItem xs={12} md={3} lg={3}>
            <AccountSearch
              label="Driver"
              placeholder="Search name or phone"
              val={driverKeyword}
              onSelect={handleSelectDriver}
              onSearch={handleSearchDriver}
              onClear={handleClearDriver}
            />
          </GridItem>
          <GridItem xs={12} md={3} lg={3}>
            <Box pb={2}>
              <TextField
                id="order-driver-phone"
                label={`${t("Driver Phone")}`}
                value={model.driverPhone ? model.driverPhone : ""}
                InputLabelProps={{ shrink: model.driverPhone ? true : false }}
                InputProps={{
                  readOnly: true
                }}
              />
            </Box>
          </GridItem>

          <GridItem xs={12} md={9} lg={9}>
            <Box pb={2}>
              <TextField
                id="order-note"
                label={`${t("Note")}`}
                fullWidth
                value={model.note ? model.note : ""}
                InputLabelProps={{ shrink: model.note ? true : false }}
                // InputProps={{}}
                onChange={e => {
                  setModel({ ...model, note: e.target.value });
                }}
              />
            </Box>
          </GridItem>
          <GridItem xs={12} md={4} lg={4}>
            <KeyboardDatePicker
              variant="inline"
              label={t("Deliver Date")}
              format="YYYY-MM-DD"
              value={moment.utc(model.delivered)}
              onChange={m => handleDeliverDateChange(m)}
              InputLabelProps={{
                shrink: model.delivered ? true : false
              }}
            />
          </GridItem>
          <GridItem xs={12} container direction="row-reverse">
            <Box mt={2} mr={2}>
              <Link to={`../orders`}>
                <Button variant="contained">
                  <FormatListBulletedIcon />
                  {t("Back")}
                </Button>
              </Link>
            </Box>
            <Box mt={2} mr={2}>
              <Button
                color="primary"
                variant="contained"
                disabled={processing}
                onClick={handleSubmit}
              >
                <SaveIcon />
                {t("Save")}
              </Button>
            </Box>
            <Box mt={2} mr={2}>
              <Link to={`../finance/transactions`}>
                <Button color="primary" variant="contained">
                  <HistoryIcon />
                  {t("Transaction History")}
                </Button>
              </Link>
            </Box>
          </GridItem>
        </GridContainer>
      </CardBody>
    </Card>
  );
};

OrderFormPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.object
};

const mapStateToProps = state => ({
  order: state.order
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
)(OrderFormPage);
