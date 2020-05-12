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
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import Box from "@material-ui/core/Box";
import SaveIcon from "@material-ui/icons/Save";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import FlashStorage from "services/FlashStorage";
import Alert from "@material-ui/lab/Alert";
import { getQueryParam } from "helper/index";

import ApiAuthService from 'services/api/ApiAuthService';
import ApiAccountService from 'services/api/ApiAccountService';
import Auth from "services/AuthService";
import ApiTransactionService from "services/api/ApiTransactionService";

import { FinanceTable } from "./FinanceTable";
import { FinanceForm } from "./FinanceForm";

const useStyles = makeStyles((theme) => ({
  // cardCategoryWhite: {
  //   color: "rgba(255,255,255,.62)",
  //   margin: "0",
  //   fontSize: "14px",
  //   marginTop: "0",
  //   marginBottom: "0"
  // },
  // cardTitleWhite: {
  //   color: "#FFFFFF",
  //   marginTop: "0px",
  //   minHeight: "auto",
  //   fontWeight: "300",
  //   fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  //   marginBottom: "3px",
  //   textDecoration: "none"
  // },
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
    actionCode:'', 
    amount:0, 
    fromId:'',
    toId: '', 
    notes:'', 
    staffId:'',
    staffName:'',
    modifyBy: '',
  });

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

  const handleDriverChange = (staffId) => {
    const d = drivers.find(d => d._id === staffId);
    const staffName = d ? d.username : '';
    setDriver({ _id: staffId, username: staffName });
  }

  // const handleFromChange = (fromId)=> {
  //   setFromId(fromId);
  //   setModel({...model, fromId});
  // }

  const handleUpdate = () => {
    if(driver._id){
      removeAlert();
      setProcessing(true);
      ApiTransactionService.updateTransactions(driver._id).then(({ data }) => {
        if (data.code === 'success') {
          setAlert({
            message: t("Update successfully"),
            severity: "success"
          });
          updateData(driver._id);
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
            updateData(driver._id);
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

  const handelEditTransaction = (tr) => {
    setModel(tr);
  }

  const handleDeleteTransaction = (transactionId) => {
    if(window.confirm('Are you sure to delete this transaction?')){
      if(transactionId){
        removeAlert();
        setProcessing(true);
        ApiTransactionService.deleteTransaction(transactionId).then(({ data }) => {
          if (data.code === 'success') {
            setAlert({
              message: t("Delete transaction successfully"),
              severity: "success"
            });
            updateData(driver._id);
          } else {
            setAlert({
              message: t("Delete transaction failed"),
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

  useEffect(() => {
    const token = Auth.getAuthToken();
    ApiAuthService.getCurrentUser(token).then(({data}) => {
      const account = {...data};
      setAccount(account);
      // try to load default form
      ApiAccountService.getAccountList(null, null, { type: 'driver' }).then(({ data }) => {
        const staffs = data.data;
        setDriverList(staffs);
        if (staffs && staffs.length > 0) {
          const staff = staffs[0];
          setDriver(staff);
          updateData(staff._id);
          // setModel({...model, staffId: staff._id, staffName: staff.username, modifyBy: account._id});
        } else{
          // setModel({...model, modifyBy: account._id});
        }
      });
    });
  }, []);

  useEffect(() => {
    updateData(driver._id);
  }, [page, rowsPerPage, sort, driver]);


  const updateData = (accountId) => {
    const condition = {
      $or: [
        {
          fromId: accountId
        },
        {
          toId: accountId
        },
        {
          staffId: accountId
        }
      ],
      actionCode: {$in:['T', 'PS']},
      status: { $nin: ['bad', 'tmp'] }
    };
    ApiTransactionService.getTransactionList(
      page,
      rowsPerPage,
      condition,
      [sort]
    ).then(({ data }) => {
      setTransactions(data.data);
      setTotalRows(data.count);
      setLoading(false);
    });
  };



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
              {/* {
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
                      <MenuItem key={account? account._id : ''} value={account? account._id : ''}>{account? account.username: 'My Account'}</MenuItem>
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
              } */}

              {/* <Button onClick={() => handleSubmit()} color="secondary" autoFocus>
                {t("Submit")}
              </Button> */}
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
                    editRow={handelEditTransaction}
                    deleteRow={handleDeleteTransaction}
                  />
                </GridItem>

                <GridItem xs={12} container direction="row-reverse">
                {/* <Box mt={2}>
                  <Button
                    variant="contained"
                    href="finance"
                    onClick={handleBack}
                  >
                    <FormatListBulletedIcon />
                    {t("Back")}
                  </Button>
                </Box> */}
                <Box mt={2} mr={2}>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={processing}
                    onClick={handleUpdate}
                  >
                    <SaveIcon />
                    {t("Update")}
                  </Button>
                </Box>
              </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <FinanceForm account={driver} transaction={model} update={updateData}/>
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