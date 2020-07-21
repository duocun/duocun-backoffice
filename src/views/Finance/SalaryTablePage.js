import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import * as moment from 'moment';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { Button, Box } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Alert from "@material-ui/lab/Alert";

// icons
import SaveIcon from "@material-ui/icons/Save";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import FlashStorage from "services/FlashStorage";
import { getQueryParam } from "helper/index";

import ApiAuthService from 'services/api/ApiAuthService';
import ApiAccountService from 'services/api/ApiAccountService';
import Auth from "services/AuthService";
import ApiTransactionService from "services/api/ApiTransactionService";

import {selectTransaction} from "redux/actions/transaction";
import { TransactionTable } from "./TransactionTable";

import AccountSearch from "components/AccountSearch/AccountSearch";
// import TransactionFormPage from "./TransactionFormPage";

// const useStyles = makeStyles((theme) => ({
//   table: {
//     minWidth: 750
//   },
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120,
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2),
//   },
// }));
const useStyles = makeStyles(() => ({
  gridContainer: {
    padding: "0px",
    margin: "0px"
  },
  table: {
    minWidth: 750,
  },
}));

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const defaultTransaction = {
  actionCode: '',
  amount: 0,
  fromId: '',
  toId: '',
  note: '',
  staffId: '',
  staffName: '',
  modifyBy: '',
}

const SalaryTablePage = ({ history, location, selectTransaction }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  // form related
  const [fromId, setFromId] = useState('');
  const [drivers, setDriverList] = useState([]);
  const [driver, setDriver] = useState({ _id: '', username: '', type: 'driver' });
  const [account, setAccount] = useState({ _id: '', username: '' });
  const [model, setModel] = useState(defaultTransaction);

  const [driverKeyword, setDriverKeyword] = useState("");

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
  const [sort, setSort] = useState(["created", -1]);


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


  // useEffect(() => {
  //   const token = Auth.getAuthToken();
  //   ApiAuthService.getCurrentUser(token).then(({ data }) => {
  //     const account = { ...data };
  //     setAccount(account);
  //     // try to load default form
  //     ApiAccountService.getAccountList(null, null, { type: 'driver' }).then(({ data }) => {
  //       const staffs = data.data;
  //       setDriverList(staffs);
  //       if (staffs && staffs.length > 0) {
  //         const staff = staffs[0];
  //         setDriver(staff);
  //         updateData(staff._id);

  //         saveSalaryToRedux(staff, account);
  //         // setModel({...model, staffId: staff._id, staffName: staff.username, modifyBy: account._id});
  //       } else {
  //         // setModel({...model, modifyBy: account._id});
  //       }
  //     });
  //   });
  // }, []);

  useEffect(() => {

  }, []);

  useEffect(() => {
    updateData(driver._id);
  }, [page, rowsPerPage, sort, driver]);


  const saveSalaryToRedux = (driver, account) => {
    ApiAccountService.getAccountList(null, null, { username: 'Expense', type: 'system' }).then(({ data }) => {
      const expense = data.data[0];
      const staffName = driver ? driver.username : '';
      const tr = {
        ...defaultTransaction,
        actionCode: 'PS',
        toId: expense._id,
        toName: expense.username,
        staffId: driver ? driver._id : '',
        staffName,
        note: `Pay salary to ${staffName}`,
        modifyBy: account ? account._id : '',
        created: moment.utc().toISOString()
      }

      selectTransaction(tr);
    });
  }

  const handleUpdate = () => {
    if (driver._id) {
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

  const handelSelectTransaction = (tr) => {
    if(tr.note){
      setModel(tr);
    }else{
      setModel({...tr, note: ''});
    }
  }

  const handleDeleteTransaction = (transactionId) => {
    if (window.confirm('Are you sure to delete this transaction?')) {
      if (transactionId) {
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


  const updateData = (accountId) => {
    const query = accountId ? {
      $or: [
        { fromId: accountId },
        { toId: accountId },
        { staffId: accountId }
      ]
    }: {};

    const condition = {
      ...query,
      actionCode: { $in: ['PS'] },
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

  // const handleDriverChange = (staffId) => {
  //   const d = drivers.find(d => d._id === staffId);
  //   const staffName = d ? d.username : '';
  //   const staff = { _id: staffId, username: staffName };
  //   setDriver(staff);

  //   // create an empty transaction for create new salary
  //   saveSalaryToRedux(staff, account);
  // }

  const handleSelectDriver = account => {
    const type = account ? account.type : 'driver';
    setDriver({ _id: account ? account._id : '', type });
    setDriverKeyword(account ? account.username : '');
    // updateData(product);
    // create an empty transaction for create new salary
    saveSalaryToRedux(account, account);
  }

  const handleClearDriver = () => {
    setDriverKeyword("");
  }

  const handleSearchDriver = (page, rowsPerPage, keyword) => {
    return ApiAccountService.getAccountByKeyword(page, rowsPerPage, keyword, ['driver']);
  }

  return (
      <GridContainer className={classes.gridContainer}>
          <Card>
            <CardHeader color="primary">
              <GridContainer>
                <GridItem xs={6} md={3} lg={3}>
                  <Box pb={2} mr={2}>
                    <AccountSearch
                      label="Driver"
                      placeholder="Search name or phone"
                      val={driverKeyword}
                      onSelect={handleSelectDriver}
                      onSearch={handleSearchDriver}
                      onClear={handleClearDriver}
                    />
                    {/* <FormControl className={classes.formControl}>
                      <InputLabel id="driver-select-label">{t("Driver")}</InputLabel>
                      <Select required labelId="driver-select-label" id="driver-select"
                        value={driver ? driver._id : ''} onChange={e => handleDriverChange(e.target.value)} >
                        {
                          drivers && drivers.length > 0 &&
                          drivers.map(d => <MenuItem key={d._id} value={d._id}>{d.username}</MenuItem>)
                        }
                      </Select>
                    </FormControl> */}
                  </Box>
                </GridItem>

                <GridItem xs={6} md={3} lg={3}>
                  <Box mr={2}>
                    <Link to={`salary/new`}>
                      <Button
                        color="default"
                        variant="contained"
                      >
                        <AddCircleOutlineIcon />
                        {t("New Salary")}
                      </Button>
                    </Link>
                  </Box>
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
                <GridItem xs={12}>
                  <TransactionTable
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
                    selectRow={handelSelectTransaction}
                    deleteRow={handleDeleteTransaction}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <GridContainer>
                <GridItem xs={12} container direction="row-reverse">
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
            </CardFooter>
          </Card>
      </GridContainer>
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
// )(SalaryTablePage);

SalaryTablePage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};

// const mapStateToProps = state => ({
//   account: state.account
// });

export default connect(
  null,
  {selectTransaction}
)(SalaryTablePage);