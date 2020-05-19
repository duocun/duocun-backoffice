import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import * as moment from 'moment';
import { KeyboardDatePicker } from "@material-ui/pickers";
// import {useForm} from "react-hook-form";
// import TimePicker from "components/TimePicker/TimePicker";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Box from "@material-ui/core/Box";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

// import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
// import FormGroup from "@material-ui/core/FormGroup";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
// import Checkbox from "@material-ui/core/Checkbox";

// import Skeleton from "@material-ui/lab/Skeleton";
import Alert from "@material-ui/lab/Alert";
import CustomInput from "components/CustomInput/CustomInput";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import SaveIcon from "@material-ui/icons/Save";
// import EditIcon from "@material-ui/icons/Edit";
// import DeleteIcon from "@material-ui/icons/Delete";
// import CancelIcon from "@material-ui/icons/Cancel";

import FlashStorage from "services/FlashStorage";

import AuthService from "services/AuthService";
import ApiAuthService from 'services/api/ApiAuthService';
import ApiAccountService from 'services/api/ApiAccountService';
import ApiOrderService from 'services/api/ApiOrderService';

// import moment from 'moment-timezone/moment-timezone';
const useStyles = makeStyles(theme => ({
  // textarea: {
  //   width: "100%"
  // },
  // select: {
  //   width: "100%",
  //   marginTop: 27
  // },
  // heading: {
  //   marginBottom: "0.5rem",
  //   size: "1.5rem",
  //   fontWeight: 600
  // },
  // table: {
  //   minWidth: 750
  // },
  // editingCell: {
  //   padding: "0 5px"
  // },
  // formControl: {
  //   display: "block"
  // },
  // formControlLabel: {
  //   marginTop: "1rem",
  //   marginBottom: "1rem",
  //   fontWeight: 600
  // },
  // formGroup: {
  //   border: "1px solid #eee",
  //   borderRadius: 5,
  //   padding: 5
  // }
}));

// const useStyles = makeStyles(() => ({
//   textarea: {
//     width: "100%"
//   },
//   select: {
//     width: "100%",
//     marginTop: 27
//   },
//   heading: {
//     marginBottom: "0.5rem",
//     size: "1.5rem",
//     fontWeight: 600
//   },
//   table: {
//     minWidth: 750
//   },
//   editingCell: {
//     padding: "0 5px"
//   },
//   formControl: {
//     display: "block"
//   },
//   formControlLabel: {
//     marginTop: "1rem",
//     marginBottom: "1rem",
//     fontWeight: 600
//   },
//   formGroup: {
//     border: "1px solid #eee",
//     borderRadius: 5,
//     padding: 5
//   }
// }));

const defaultActions = [
  { code: 'PS', text: 'Pay Salary' },
  { code: 'PDCH', text: 'Pay Driver Cash' },
  { code: 'T', text: 'Transfer' }
];



export const OrderForm = ({ account, order, update, toTransactionHistory }) => {
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
  const [actions, setActions] = useState(defaultActions);
  const [modifyByAccount, setModifyByAccount] = useState({ _id: '', username: '' });
  const [accounts, setAccounts] = useState([]);
  const [model, setModel] = useState(order);
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

  const handleActionChange = (actionCode) => {
    if (model._id) {
      if (actionCode === order.actionCode) {
        setModel({ ...model, actionCode, note: order.note ? order.note : '' });
      } else {
        setModel({ ...model, actionCode, note: '' });
      }
    } else {
      if (actionCode === 'PS') {
        setModel({ ...model, actionCode });
      } else {
        setModel({ ...model, actionCode, note: '' });
      }
    }
  }

  const handleFromAccountChange = (fromId) => {
    const account = accounts.find(a => a._id === fromId);
    setModel({ ...model, fromId, fromName: account ? account.username : '' });
  }

  const handleToAccountChange = (toId) => {
    const account = accounts.find(a => a._id === toId);
    setModel({ ...model, toId, toName: account ? account.username : '' });
  }

  const handleStaffChange = (staffId) => {
    const account = accounts.find(a => a._id === staffId);
    const staffName = account ? account.username : ''
    setModel({ ...model, staffId, staffName, note: `Pay salary to ${staffName}` });
  }


  const handleCreate = () => {
    if (model.fromId && model.staffId) {
      removeAlert();
      setProcessing(true);
      ApiOrderService.createOrder(model).then(({ data }) => {
        if (data.code === 'success') {
          const newAlert = {
            message: t("Saved successfully"),
            severity: "success"
          };
          if (model._id === "new") {
            FlashStorage.set("SALARY_ALERT", newAlert);
            return;
          } else {
            setAlert(newAlert);
            update(account._id);
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
  };

  const handleUpdate = () => {
    if (model.fromId && model.toId) {
      removeAlert();
      setProcessing(true);
      ApiOrderService.updateOrder(model).then(({ data }) => {
        if (data.code === 'success') {
          setAlert({
            message: t("Update successfully"),
            severity: "success"
          });
          update(account._id);
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
  // const handleSubmit = () => {
  //   if (model._id) {
  //     handleUpdate();
  //   } else {
  //     handleCreate();
  //   }
  // }

  const handleBack = () => {

  }

  useEffect(() => {
    if (order.actionCode === 'PS') {
      setModel({
        ...order,
        modifyBy: modifyByAccount._id
      });
    } else {
      setModel({ ...order, modifyBy: modifyByAccount._id });
    }
  }, [order]);

  useEffect(() => {
    const token = AuthService.getAuthToken();
    ApiAuthService.getCurrentUser(token).then(({ data }) => {
      const account = { ...data };
      setModifyByAccount(account);
      ApiAccountService.getAccountList(null, null, { type: { $in: ['driver', 'system'] } }).then(({ data }) => {
        setAccounts(data.data);
      });
    });
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} lg={12}>
        <Card>
          <CardHeader color="primary">
            <GridContainer>
              <GridItem xs={12} lg={6}>
                <h4>{t(order._id ? "Edit Order" : "New Order")}</h4>
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
              <GridItem xs={12} lg={6}>
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
              <GridItem xs={12} lg={6}>
                <Box pb={2}>
                  <TextField id="order-client"
                    label={`${t("Client")}`}
                    value={model.client ? model.client.username : 'N/A'}
                    InputLabelProps={{ shrink: model.client ? true : false }}
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
                    value={model.client ? model.client.phone : 'N/A'}
                    InputLabelProps={{ shrink: model.client ? true : false }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
              </GridItem>
              <GridItem xs={12} lg={12}>
                <Box pb={2}>
                  <TextField id="order-client-addr"
                    fullWidth
                    label={`${t("Address")}`}
                    value={getAddrString(model.location)}
                    InputLabelProps={{ shrink: model.location ? true : false }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
              </GridItem>
              <GridItem xs={12} lg={12}>
                <Box pb={2}>
                  {
                    model.items && model.items.length > 0 &&
                    model.items.map(it => <div key={it.productId}>{it.productName} x {it.quantity}</div>)
                  }
                </Box>
              </GridItem>
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
                {/* <Box pb={2}>
                  <FormControl className={classes.select}>
                    <InputLabel id="action-label">Action</InputLabel>
                    <Select required
                      labelId="action-select-label"
                      id="action-select"
                      value={model.actionCode}
                      onChange={e => handleActionChange(e.target.value)}
                    >
                      {
                        actions.map(action => <MenuItem key={action.code} value={action.code}>{action.text}</MenuItem>)
                      }
                    </Select>
                  </FormControl>
                </Box> */}
              </GridItem>

              {/* {
                model.actionCode === 'PS' &&
                <GridItem xs={12} lg={6}>
                  <Box pb={2}>
                    <FormControl className={classes.select}>
                      <InputLabel id="staff-select-label">Pay Salary To</InputLabel>
                      <Select required
                        labelId="staff-select-label"
                        id="staff-select"
                        value={model.staffId}
                        onChange={e => handleStaffChange(e.target.value)}
                      >
                        {
                          accounts && accounts.length > 0 &&
                          accounts.map(d => <MenuItem key={d._id} value={d._id}>{d.username}</MenuItem>)
                        }
                      </Select>
                    </FormControl>
                  </Box>
                </GridItem>
              } */}

              <GridItem xs={12} lg={6}>
                <Box pb={2}>
                  <TextField id="order-driver"
                    label={`${t("Driver")}`}
                    value={model.driver ? model.driver.username : ''}
                    InputLabelProps={{ shrink: model.driver ? true : false }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
              </GridItem>
              <GridItem xs={12} lg={6}>
                <Box pb={2}>
                  <TextField id="order-driver-phone"
                    label={`${t("Driver Phone")}`}
                    value={model.driver ? model.driver.phone : ''}
                    InputLabelProps={{ shrink: model.driver ? true : false }}
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
                    InputProps={{
                      readOnly: true,
                    }}
                    onChange={e => {
                      setModel({ ...model, note: e.target.value });
                    }}
                  />
                </Box>
                {/* <Box pb={2}>
                  <CustomInput
                    labelText={t("Note")}
                    id="note"
                    formControlProps={{
                      fullWidth: true
                    }}
                    InputLabelProps={{ shrink: model.note ? true : false }}
                    inputProps={{
                      value: model.note,
                      onChange: e => {
                        setModel({ ...model, note: e.target.value });
                      }
                    }}
                  />
                </Box> */}
              </GridItem>
              <GridItem>
                <KeyboardDatePicker
                  variant="inline"
                  label={t("Deliver Date")}
                  format="YYYY-MM-DD"
                  value={moment.utc(model.created)}
                  onChange={(m) => setModel({ ...model, created: m.toISOString() })}
                />
              </GridItem>
              <GridItem xs={12} container direction="row-reverse">
                <Box mt={2}>
                  <Button
                    variant="contained"
                    onClick={toTransactionHistory}
                  >
                    <FormatListBulletedIcon />
                    {t("Transaction History")}
                  </Button>
                </Box>
                <Box mt={2} mr={2}>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={processing}
                  // onClick={handleSubmit}
                  >
                    <SaveIcon />
                    {t("Save")}
                  </Button>
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
