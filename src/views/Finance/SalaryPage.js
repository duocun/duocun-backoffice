import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

// core components
import * as moment from 'moment';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { connect } from 'react-redux';
import avatar from "assets/img/faces/marc.jpg";
// import { loadSalaryAsync } from 'redux/actions/statistics';


//drop down menu
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';


import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";

import ApiAuthService from 'services/api/ApiAuthService';
import ApiAccountService from 'services/api/ApiAccountService';
import ApiTransaction from 'services/api/ApiTransactionService';
import Auth from "services/AuthService";
import FlashStorage from "services/FlashStorage";
const useStyles = makeStyles((theme) => ({
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  table: {
    minWidth: 750
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const TD_BANK_ID = "5c95019e0851a5096e044d0c";
const TD_BANK_NAME = "TD Bank";

const SalaryPage = ({history}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [account, setAccount] = useState({_id:'', username:''});
  const [fromId, setFromId] = useState('');

  const [driverSummary, setSalary] = useState({});
  const [drivers, setDriverList] = useState([]);
  const [driver, setDriver] = useState({ _id: '', username: '' });

  const [model, setModel] = useState({actionCode:'PS', amount:0, fromId:'', toId: '', notes:'', modifyBy:''});

  const [processing, setProcessing] = useState(false);
  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };
  const [alert, setAlert] = useState(
    FlashStorage.get("SALARY_ALERT") || { message: "", severity: "info" }
  );

  const handleDriverChange = (driverId) => {
    const d = drivers.find(d => d._id === driverId);
    setDriver({ _id: driverId, username: d ? d._id : '' });
    setModel({...model, toId: driverId});
  }

  const handleFromChange = (fromId)=> {
    setFromId(fromId);
    setModel({...model, fromId});
  }

  const handleSubmit = () => {
    if(model.fromId && model.toId && model.modifyBy){
      removeAlert();
      setProcessing(true);
      ApiTransaction.saveTransaction(model).then(({ data }) => {
        if (data.success) {
          const newAlert = {
            message: t("Saved successfully"),
            severity: "success"
          };
          if (model._id === "new") {
            FlashStorage.set("PRODUCT_ALERT", newAlert);
            history.push("../products");
            return;
          } else {
            setAlert(newAlert);
            // updatePage();
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

  useEffect(() => {
    const token = Auth.getAuthToken();
    ApiAuthService.getCurrentUser(token).then(({data}) => {
      setAccount(data);
      setModel({...model, modifyBy: data._id});
    });
  }, []);

  useEffect(() => {
    ApiAccountService.getAccountList(null, null, { type: 'driver' }).then(({ data }) => {
      setDriverList(data.data);
      if (data.data && data.data.length > 0) {
        setDriver(data.data[0]);
      }
      // dispatch(setSalary(data.data));
    });
  }, []);
  return (

    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              {
                <FormControl className={classes.formControl}>
                  <InputLabel id="driver-select-label">Driver</InputLabel>
                  <Select required labelId="driver-select-label" id="driver-select"
                    value={driver ? driver._id : ''} onChange={e => handleDriverChange(e.target.value)} >
                    {
                      drivers && drivers.length > 0 &&
                      drivers.map(d => <MenuItem key={d._id} value={d._id}>{d.username}</MenuItem>)
                    }
                  </Select>
                </FormControl>
              }
              {
                <FormControl className={classes.formControl}>
                  <CustomInput
                    labelText={t("Amount")}
                    id="amount"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: model.amount,
                      onChange: e => {
                        setModel({ ...model, amount: e.target.value });
                      }
                    }}
                  />
                </FormControl>
              }
              {
                <FormControl className={classes.formControl}>
                  <InputLabel id="driver-select-label">From</InputLabel>
                  <Select required labelId="driver-select-label" id="driver-select"
                    value={fromId} onChange={e => handleFromChange(e.target.value)} >
                      <MenuItem key={account? account._id : ''} value={account? account._id : ''}>My Account</MenuItem>
                      <MenuItem key={TD_BANK_ID} value={TD_BANK_ID}>Company</MenuItem>
                  </Select>
                </FormControl>
              }
             {
                <FormControl className={classes.formControl}>
                  <CustomInput
                    labelText={t("Notes")}
                    id="notes"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: model.notes,
                      onChange: e => {
                        setModel({ ...model, notes: e.target.value });
                      }
                    }}
                  />
                </FormControl>
              }

              <Button onClick={() => handleSubmit()} color="secondary" autoFocus>
                {t("Submit")}
              </Button>
            </CardHeader>
            <CardBody>
              <GridContainer>
                {
                  driverSummary && Object.keys(driverSummary).length > 0 && driver && driverSummary[driver._id] &&
                  driverSummary[driver._id].merchants.map(m =>
                    <div key={m.merchantName}>
                      <div>{m.merchantName}</div>
                      <Table>
                        <TableBody>
                          {m.items.map((prop, key) =>
                            <TableRow key={key} >
                              <TableCell>
                                {prop.productName}
                              </TableCell>
                              <TableCell>
                                x{prop.quantity}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )
                }
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

// const mapStateToProps = (state) => ({ driverSummary: state.driverSummary });
// // const mapDispatchToProps = (dispatch) => ({
// //   loadSalary: (startDate) => {
// //     dispatch(loadSalaryAsync(startDate));
// //   },
// // });
// export default connect(
//   mapStateToProps,
//   // mapDispatchToProps
// )(SalaryPage);

SalaryPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};
export default SalaryPage;