import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";

import * as moment from 'moment';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

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

import FlashStorage from "services/FlashStorage";
import Alert from "@material-ui/lab/Alert";
import { getQueryParam } from "helper/index";

import ApiAuthService from 'services/api/ApiAuthService';
import ApiAccountService from 'services/api/ApiAccountService';
import Auth from "services/AuthService";
import ApiTransactionService from "services/api/ApiTransactionService";
import { FinanceTable } from "./FinanceTable";


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

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const SalaryPage = ({ history, location}) => {
  const classes = useStyles();
  const { t } = useTranslation();


  // form related
  const [fromId, setFromId] = useState('');
  const [drivers, setDriverList] = useState([]);
  const [driver, setDriver] = useState({ _id: '', username: '', type: 'driver' });

  const [account, setAccount] = useState({_id: '', username: ''});

  const [model, setModel] = useState({
    actionCode:'PS', 
    amount:0, 
    fromId:'',
    // toId: EXPENSE_ID, 
    notes:'', 
    staffId:'',
    staffName:'',
    modifyBy: '',
  });

  const [processing, setProcessing] = useState(false);


  // table related
  const searchParams = useQuery();

  const [transactions, setTransactions] = useState([]);
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


  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };
  const [alert, setAlert] = useState(
    FlashStorage.get("SALARY_ALERT") || { message: "", severity: "info" }
  );

  const handleDriverChange = (staffId) => {
    const d = drivers.find(d => d._id === staffId);
    const staffName = d ? d.username : '';
    setDriver({ _id: staffId, username: staffName });
    setModel({...model, staffId, staffName });
  }

  const handleFromChange = (fromId)=> {
    setFromId(fromId);
    setModel({...model, fromId});
  }

  const handleUpdate = () => {
    if(model.staffId){
      removeAlert();
      setProcessing(true);
      ApiTransactionService.updateTransactions(model.staffId).then(({ data }) => {
        if (data.code === 'success') {
          setAlert({
            message: t("Update successfully"),
            severity: "success"
          });
          // updatePage();
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

  const handleSubmit = () => {
    if(model.fromId && model.staffId){
      removeAlert();
      setProcessing(true);
      ApiTransactionService.createTransaction(model).then(({ data }) => {
        if (data.code === 'success') {
          const newAlert = {
            message: t("Saved successfully"),
            severity: "success"
          };
          if (model._id === "new") {
            FlashStorage.set("SALARY_ALERT", newAlert);
            history.push("../finance");
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

  // useEffect(() => {
  //   const token = Auth.getAuthToken();
  //   ApiAuthService.getCurrentUser(token).then(({data}) => {
  //     setAccount(data);
  //     setModel({...model, modifyBy: data._id});
  //   });
  // },[]);

  useEffect(() => {
    const token = Auth.getAuthToken();
    ApiAuthService.getCurrentUser(token).then(({data}) => {
      const account = {...data};
      setAccount(account);
      ApiAccountService.getAccountList(null, null, { type: 'driver' }).then(({ data }) => {
        setDriverList(data.data);
        if (data.data && data.data.length > 0) {
          const staff = data.data[0];
          setDriver(staff);
          setModel({...model, staffId: staff._id, staffName: staff.username, modifyBy: account._id});
        } else{
          setModel({...model, modifyBy: account._id});
        }
      });
    });
  }, []);

  const updateData = (accountId) => {
    ApiTransactionService.getTransactionList(
      page,
      rowsPerPage,
      accountId,
      new Date(), // startDate,
      new Date(), // endDate,
      [sort]
    ).then(({ data }) => {
      setTransactions(data.data);
      setTotalRows(data.count);
      setLoading(false);
    });
  };

  useEffect(() => {
    if(searchParams.has('accountId')){
      const accountId = searchParams.get('accountId');
      updateData(accountId);
    }else{
      updateData(driver._id);
    }
  }, [page, rowsPerPage, sort, driver]);


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
                      {/* <MenuItem key={account? account._id : ''} value={account? account._id : ''}>{account? account.username: 'My Account'}</MenuItem> */}
                      <MenuItem key={TD_BANK_ID} value={TD_BANK_ID}>Company</MenuItem>
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
              <Button onClick={() => handleUpdate()} color="secondary" autoFocus>
                {t("Update")}
              </Button>
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
                  <FinanceTable
                    account={driver}
                    rows={transactions}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalRows={totalRows}
                    sort={sort}
                    loading={loading}
                    setRowsPerPage={setRowsPerPage}
                    setSort={setSort}
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

// const mapStateToProps = state => ({
//   account: state.account
// });

// export default connect(
//   mapStateToProps
// )(SalaryPage);