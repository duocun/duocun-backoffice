import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import * as moment from 'moment';
import { KeyboardDatePicker } from "@material-ui/pickers";
// import {useForm} from "react-hook-form";
// import TimePicker from "components/TimePicker/TimePicker";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

// import FormLabel from "@material-ui/core/FormLabel";
// import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";

// import Skeleton from "@material-ui/lab/Skeleton";
import Alert from "@material-ui/lab/Alert";
// import CustomInput from "components/CustomInput/CustomInput";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
// import IconButton from "@material-ui/core/IconButton";

// icons
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import SaveIcon from "@material-ui/icons/Save";
import HistoryIcon from '@material-ui/icons/History';



import FlashStorage from "services/FlashStorage";

import AddressSearch from "components/AddressSearch/AddressSearch";
import OrderItemEditor from "views/Orders/OrderItemEditor";

import AuthService from "services/AuthService";
import ApiAuthService from 'services/api/ApiAuthService';
import ApiAccountService from 'services/api/ApiAccountService';
import ApiOrderService from 'services/api/ApiOrderService';
import ApiMerchantService from "services/api/ApiMerchantService";
// import ApiLocationService from 'services/api/ApiLocationService';

// import moment from 'moment-timezone/moment-timezone';
const useStyles = makeStyles(theme => ({

}));

/**
 * props: data, onAfterUpdate
 * 
 */
const OrderForm = ({ data, onAfterUpdate, history }) => {
  // const { register, handleSubmit, watch, errors } = useForm();
  // moment.tz.add("America/Toronto|EST EDT EWT EPT|50 40 40 40|01010101010101010101010101010101010101010101012301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TR0 1in0 11Wu 1nzu 1fD0 WJ0 1wr0 Nb0 1Ap0 On0 1zd0 On0 1wp0 TX0 1tB0 TX0 1tB0 TX0 1tB0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 4kM0 8x40 iv0 1o10 11z0 1nX0 11z0 1o10 11z0 1o10 1qL0 11D0 1nX0 11B0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|65e5");

  // // localTime --- 'YYYY-MM-DDTHH:mm:ss'
  // const getMomentFromLocal = (localTime, zone='America/Toronto') => {
  //   return moment.tz(localTime, zone);
  // }
  // const history = useHistory({
  //   basename: "admin2" // backoffice
  // });

  const { t } = useTranslation();
  const classes = useStyles();
  const [modifyByAccount, setModifyByAccount] = useState({ _id: '', username: '' });
  const [accounts, setAccounts] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [model, setModel] = useState(data);
  const [itemMap, setItemMap] = useState({});
  const [drivers, setDriverList] = useState([]);
  const [productMap, setCheckMap] = useState({});

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
    ApiMerchantService.getMerchants({type: 'G', status:'A'}).then(({data}) => {
      setMerchants(data.data);
    });
  }, []);


  useEffect(() => {
    ApiAccountService.getAccounts({ type: 'driver', status: 'A' }).then((d) => {
      const staffs = d.data.data;
      setDriverList(staffs);
      // set products for remove products function
      if(data){
        if (data.items && data.items.length > 0) {
          const checkMap = {};
          data.items.forEach(it => {
            checkMap[it.productId] = { ...it, status: false };
          });
          setCheckMap(checkMap);
        }

        // set model for save function
        if (data.actionCode === 'PS') {
          setModel({
            ...data,
            modifyBy: modifyByAccount._id
          });
        } else {
          setModel({ ...data, modifyBy: modifyByAccount._id });
        }
      }
    });
  }, [data]);

  useEffect(() => {
    const token = AuthService.getAuthToken();
    ApiAuthService.getCurrentUser(token).then(({ data }) => {
      const account = { ...data.data };
      setModifyByAccount(account);
      ApiAccountService.getAccountList(null, null, { type: { $in: ['driver', 'system'] } }).then(({ data }) => {
        setAccounts(data.data);
      });
    });
  }, []);


  const handleCreate = () => {
    if (model._id === 'clone') {
      const vs = Object.values(itemMap);
      const items = vs.filter(v => v._id !== 'new');

      if (model.clientId && items && items.length > 0) {
        let d = {...model, items};
        delete d._id;
        delete d.code;

        removeAlert();
        setProcessing(true);
        ApiOrderService.createOrder(d).then(({ data }) => {
          if (data.code === 'success') {
            const newAlert = {
              message: t("Saved successfully"),
              severity: "success"
            };
            if (model._id === "new") {
              FlashStorage.set("ORDER_ALERT", newAlert);
              return;
            } else {
              setAlert(newAlert);
              onAfterUpdate();
            }
          } else {
            setAlert({
              message: t("Save failed"),
              severity: "error"
            });
          }
          setProcessing(false);
        }).catch(e => {
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
    if (model._id !== 'new' && model._id !== 'clone' && modifyByAccount._id) {
      removeAlert();
      setProcessing(true);
      setModel({ ...model, modifyBy: modifyByAccount._id })
      ApiOrderService.updateOrder(model).then(({ data }) => {
        if (data.code === 'success') {
          setAlert({
            message: t("Update successfully"),
            severity: "success"
          });
          onAfterUpdate();
        } else {
          setAlert({
            message: t("Update failed"),
            severity: "error"
          });
        }
        setProcessing(false);
      }).catch(e => {
        console.error(e);
        setAlert({
          message: t("Update failed"),
          severity: "error"
        });
        setProcessing(false);
      });
    }
  }

  const canSplit = () => {
    const vs = Object.keys(productMap).map(pId => productMap[pId]);
    const checked = vs.filter(v => v.status);
    const unchecked = vs.filter(v => !v.status);
    return (checked.length > 0 && unchecked.length > 0);
  }

  const handleSplitOrder = () => {
    const vs = Object.keys(productMap).map(pId => productMap[pId]);
    const checked = vs.filter(v => v.status);
    // const unchecked = vs.filter(v => !v.status);
    if (canSplit()) {
      const r = window.confirm('拆分送货单, 为选中的商品新建一个送货单。');
      if (r) {
        ApiOrderService.splitOrder(model._id, checked).then(({ data }) => {
          const r = data;
          updateFormData(model._id);
        });
      }
    }
  }

  // location --- ILocation
  const getAddrString = (location) => {
    if (location) {
      const city = location.subLocality ? location.subLocality : location.city;
      const province = location.province;
      const streetName = location.streetName;
      return location.streetNumber + ' ' + streetName + ', ' + city + ', ' + province;
    } else {
      return '';
    }
  }

  const handleSubmit = () => {
    if (model._id && model._id !== 'new' && model._id !== 'clone') {
      handleUpdate();
    } else {
      handleCreate();
    }
  }
  const handleToggleProduct = (e, it) => {
    const c = { ...productMap };
    c[it.productId].status = e.target.checked;
    setCheckMap(c);
  }

  const updateFormData = (id) => {
    if (id) {
      ApiOrderService.getOrder(id).then(({ data }) => {
        const order = data.data;
        setModel(order);
      });
    }
  }

  const handleBack = () => {

  }

  const handleUpdateItemMap = (itemMap) => {
    setItemMap(itemMap);
    const vs = Object.values(itemMap);
    const items = vs.filter(v => v._id !== 'new');
    const charge = ApiOrderService.getChargeFromOrderItems(items, 0);
    setModel({...model, ...charge, items});
  }

  const handleSelectDeliverLocation = (location) => {
    setModel({ ...model, location });
  }

  const handleDeliverDateChange = (m) => {
    const deliverDate = m.toISOString().split('T')[0];
    setModel({ ...model, deliverDate, delivered: `${deliverDate}T15:00:00.000Z` });
  }

  const handleSelectProduct = (item) => {
    setModel({ ...model, items: [item] });
  }

  const handleDriverChange = (e) => {
    const driverId = e.target.value;
    const driver = drivers.find(d => d._id === driverId);
    setModel({
      ...model,
      driverId: e.target.value,
      driverName: driver ? driver.username: ''
    });
  }

  const getTitle = () => {
    if (model._id === 'new' || model._id === 'clone') {
      return 'New Order';
    } else {
      return 'Edit Order';
    }
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} lg={12}>
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
              {
                !(model._id === 'new' || model._id === 'clone') &&
                <GridItem xs={12} lg={12}>
                  <Box pb={2}>
                    <TextField id="order-code"
                      label={`${t("Code")}`}
                      value={model.code}
                      InputLabelProps={{ shrink: model.code ? true : false }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>
                </GridItem>
              }
              <GridItem xs={12} lg={6}>
                <Box pb={2}>
                  <TextField id="order-client"
                    label={`${t("Client")}`}
                    value={model.clientName ? model.clientName : ''}
                    InputLabelProps={{ shrink: model.clientId ? true : false }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
              </GridItem>
              <GridItem xs={12} lg={6}>
                <Box pb={2}>
                  <TextField id="order-client-phone"
                    label={`${t("Client Phone")}`}
                    value={model.clientPhone ? model.clientPhone : ''}
                    InputLabelProps={{ shrink: model.clientPhone ? true : false }}
                    onChange={e => {
                      setModel({ ...model, clientPhone: e.target.value });
                    }}
                  />
                </Box>
              </GridItem>
              <GridItem xs={12} lg={12}>
                <Box pb={2}>
                  <AddressSearch
                    label={'Deliver Address'}
                    placeholder={'Search Address'}
                    handleSelectLocation={handleSelectDeliverLocation}
                    location={model.location}
                  />
                </Box>
              </GridItem>

              {
                (model._id === "new" || model._id === "clone") &&
                <GridItem xs={12} lg={6}>
                  <Box pb={2}>
                    <FormControl className={classes.select}>
                      <InputLabel id="merchant-label">
                        {t("Merchant")}
                      </InputLabel>
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
                            <MenuItem
                              key={merchant._id}
                              value={merchant._id}
                            >
                              {merchant.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                </GridItem>
              }

              {
                (model._id === "new" || model._id === "clone") &&
                <GridItem xs={12} lg={12}>
                  <Box pb={2}>
                    <OrderItemEditor merchantId={model.merchantId} onUpdateItemMap={handleUpdateItemMap} />
                  </Box>
                </GridItem>
              }

              {
                !(model._id === 'new' || model._id === 'clone') &&
                <GridItem xs={12} lg={12}>
                  <Box pb={2}>
                    {
                      model.items && model.items.length > 0 &&
                      model.items.map(it => <div key={it.productId}>
                        <FormControlLabel
                          control={<Checkbox checked={productMap[it.productId].status}
                            onChange={(e) => handleToggleProduct(e, it)}
                            name={`${it.productId}`} />}
                          label={`${it.productName} x ${it.quantity}`}
                          color="primary"
                        />
                      </div>)
                    }
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
              }
              <GridItem xs={12} lg={6}>
                <Box pb={2}>
                  <TextField id="order-total"
                    label={`${t("Total")}`}
                    value={model.total ? model.total : ''}
                    InputLabelProps={{ shrink: model.total ? true : false }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
              </GridItem>

              <GridItem xs={12} lg={6}>
                {/* <Box pb={5}> */}
                  {/* <TextField id="order-driver"
                    label={`${t("Driver")}`}
                    value={model.driverName}
                    InputLabelProps={{ shrink: model.driverId ? true : false }}
                    InputProps={{
                      readOnly: true,
                    }}
                  /> */}
                  {
                    model.driverId &&
                  <FormControl className={classes.select}>
                      <InputLabel id="driver-label">{t("Driver")}</InputLabel>
                      <Select id="driver"
                        labelId="driver-label"
                        value={model.driverId}
                        onChange={handleDriverChange}>
                          <MenuItem key="unassigned" value="unassigned">
                              {t("Unassigned")}
                          </MenuItem>
                        {
                          drivers.map(driver => 
                            <MenuItem key={driver._id} value={driver._id}>
                              {driver.username}
                            </MenuItem>
                          )
                        }
                      </Select>
                    </FormControl>
                    }
                {/* </Box> */}
              </GridItem>
              <GridItem xs={12} lg={6}>
                <Box pb={2}>
                  <TextField id="order-driver-phone"
                    label={`${t("Driver Phone")}`}
                    value={model.driverPhone ? model.driverPhone : ''}
                    InputLabelProps={{ shrink: model.driverPhone ? true : false }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
              </GridItem>

              <GridItem xs={12} lg={12}>
                <Box pb={2}>
                  <TextField id="order-note"
                    label={`${t("Note")}`}
                    fullWidth
                    value={model.note ? model.note : ''}
                    InputLabelProps={{ shrink: model.note ? true : false }}
                    // InputProps={{}}
                    onChange={e => {
                      setModel({ ...model, note: e.target.value });
                    }}
                  />
                </Box>
              </GridItem>
              <GridItem>
                <KeyboardDatePicker
                  variant="inline"
                  label={t("Deliver Date")}
                  format="YYYY-MM-DD"
                  value={moment.utc(model.delivered)}
                  onChange={(m) => handleDeliverDateChange(m)}
                  InputLabelProps={{
                    shrink: model.delivered,
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
      </GridItem>
    </GridContainer>
  )
}


OrderForm.propTypes = {
  // match: PropTypes.shape({
  //   params: PropTypes.shape({
  //     id: PropTypes.string
  //   })
  // }),
  history: PropTypes.object
};

// const mapStateToProps = (state) => ({
//   order: state.order
// });
// // const mapDispatchToProps = (dispatch) => ({
// //   loadAccounts: (payload, searchOption) => {
// //     dispatch(loadAccountsAsync(payload, searchOption));
// //   },
// // });
// export default connect(
//   mapStateToProps,
//   null
// )(OrderForm);

export default OrderForm;