import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import * as moment from "moment";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "components/Table/TablePagniation.js";
import TableRow from "@material-ui/core/TableRow";
import TableBodySkeleton from "components/Table/TableBodySkeleton";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import { Button, Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

// icons
import SaveIcon from "@material-ui/icons/Save";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import FlashStorage from "services/FlashStorage";
import ApiTransactionService from "services/api/ApiTransactionService";
import ApiAccountService from "services/api/ApiAccountService";

import { selectTransaction } from "redux/actions/transaction";
import { setAccount } from "redux/actions/account";

import AccountSearch from "components/AccountSearch/AccountSearch";
// import TransactionFormPage from "./TransactionFormPage";
//helper function
import { toDateString } from "../../helper";
import { TableHeader } from "components/Table/TableHeader";

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
    minWidth: 750
  },
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
}));


export const defaultSalary = {
  actionCode: "PS",
  amount: 0,
  fromId: "",
  fromName: "",
  toId: "",
  toName: "",
  note: "",
  staffId: "",
  staffName: "",
  modifyBy: "",
  created: moment.utc().toISOString()
};

// redux --- account, loggedInAccount, selectTransaction, setAccount
const SalaryTablePage = ({
  account,
  loggedInAccount,
  selectTransaction,
  setAccount
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  // form related
  const [driver, setDriver] = useState({
    _id: "",
    username: "",
    type: "driver"
  });
  // const [model, setModel] = useState(defaultSalary);

  const [driverKeyword, setDriverKeyword] = useState("");

  // table related

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
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

  // useEffect(() => {

  // }, []);



  const saveSalaryToRedux = (driver, loggedInAccount) => {
    ApiAccountService.getAccountList(null, null, {
      username: "Expense",
      type: "system"
    }).then(({ data }) => {
      const expense = data.data[0];
      const staffName = driver ? driver.username : "";
      const tr = {
        ...defaultSalary,
        actionCode: "PS",
        toId: expense._id,
        toName: expense.username,
        staffId: driver ? driver._id : "",
        staffName,
        note: `Pay salary to ${staffName}`,
        modifyBy: loggedInAccount ? loggedInAccount._id : "",
        created: moment.utc().toISOString()
      };
      setAccount(driver);
      selectTransaction(tr);
    });
  };

  const handleUpdate = () => {
    if (driver._id) {
      removeAlert();
      setProcessing(true);
      ApiTransactionService.updateTransactions(driver._id)
        .then(({ data }) => {
          if (data.code === "success") {
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

  const handelSelectRow = tr => {
    // if (tr.note) {
    //   setModel(tr);
    // } else {
    //   setModel({ ...tr, note: "" });
    // }
  };

  // const handleDeleteTransaction = transactionId => {
  //   if (window.confirm("Are you sure to delete this transaction?")) {
  //     if (transactionId) {
  //       removeAlert();
  //       setProcessing(true);
  //       ApiTransactionService.deleteTransaction(transactionId)
  //         .then(({ data }) => {
  //           if (data.code === "success") {
  //             setAlert({
  //               message: t("Delete transaction successfully"),
  //               severity: "success"
  //             });
  //             updateData(driver._id);
  //           } else {
  //             setAlert({
  //               message: t("Delete transaction failed"),
  //               severity: "error"
  //             });
  //           }
  //           setProcessing(false);
  //         })
  //         .catch(e => {
  //           console.error(e);
  //           setAlert({
  //             message: t("Delete transaction failed"),
  //             severity: "error"
  //           });
  //           setProcessing(false);
  //         });
  //     }
  //   }
  // };

  const updateData = useCallback( accountId => {
    const query = accountId
      ? {
          $or: [
            { fromId: accountId },
            { toId: accountId },
            { staffId: accountId }
          ]
        }
      : {};

    const condition = {
      ...query,
      actionCode: { $in: ["PS"] },
      status: { $nin: ["bad", "tmp"] }
    };

    ApiTransactionService.getTransactionList(page, rowsPerPage, condition, [
      sort
    ]).then(({ data }) => {
      setTransactions(data.data);
      setTotalRows(data.count);
      setLoading(false);
    });
  });

  useEffect(() => {
    if (driver && driver._id) {
      updateData(driver._id);
    } else if (account && account._id) {
      setDriverKeyword(account ? account.username : "");
      updateData(account._id);
    } else {
      updateData("");
    }
  }, [page, rowsPerPage, sort, driver, account, updateData]);

  // const handleDriverChange = (staffId) => {
  //   const d = drivers.find(d => d._id === staffId);
  //   const staffName = d ? d.username : '';
  //   const staff = { _id: staffId, username: staffName };
  //   setDriver(staff);

  //   // create an empty transaction for create new salary
  //   saveSalaryToRedux(staff, account);
  // }

  const handleSelectDriver = account => {
    const type = account ? account.type : "driver";
    setDriver({ _id: account ? account._id : "", type });
    setDriverKeyword(account ? account.username : "");
    // updateData(product);
    // create an empty transaction for create new salary
    saveSalaryToRedux(account, loggedInAccount);
  };

  const handleClearDriver = () => {
    setDriverKeyword("");
    setDriver({ _id: "", username: "", type: "driver" });
    selectTransaction(defaultSalary);
    setAccount({ _id: "", username: "", type: "client" });
  };

  const handleSearchDriver = (page, rowsPerPage, keyword) => {
    return ApiAccountService.getAccountByKeyword(page, rowsPerPage, keyword, [
      "driver"
    ]);
  };

  // const getBalance = (account, row) => {
  //   if(account){
  //     if (account.type === 'driver') {
  //       return row.toId === account._id ? row.toBalance : row.fromBalance;
  //     } else if (account.type === 'client') {
  //       return row.toId === account._id ? row.toBalance : row.fromBalance;
  //     } else if (account.type === 'merchant') {
  //       return row.fromId === account._id ? row.fromBalance : row.toBalance;
  //     } else {
  //       return row.toBalance;
  //     }
  //   }else{
  //     return 0;
  //   }
  // }

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
              </Box>
            </GridItem>

            <GridItem xs={6} md={3} lg={3}>
              <Box mr={2}>
                <Link to={`salary/new`}>
                  <Button color="default" variant="contained">
                    <AddCircleOutlineIcon /> {t("New Salary")}
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
              <Table
                className={classes.table}
                aria-label="Transaction Table"
                size="small"
              >
                <TableHeader
                  data={[
                    { field: "created", label: "Created Date" },
                    { field: "fromName", label: "From Name" },
                    { field: "toName", label: "To Name" },
                    { field: "amount", label: "Amount" },
                    { field: "note", label: "Note" },
                    { field: "actions", label: "Actions" }
                  ]}
                  sort={sort}
                  onSetSort={setSort}
                />
                <TableBody>
                  {loading ? (
                    <TableBodySkeleton colCount={7} rowCount={rowsPerPage} />
                  ) : !transactions.length ? (
                    <TableRow>
                      <TableCell align="center" colSpan={7} size="medium">
                        {t("No data to display")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((row, idx) => (
                      <TableRow key={idx} onClick={() => handelSelectRow(row)}>
                        {/* <TableCell>{page * rowsPerPage + idx + 1}</TableCell> */}
                        <TableCell>{toDateString(row.created)}</TableCell>
                        <TableCell>{row.fromName}</TableCell>
                        <TableCell>{row.toName}</TableCell>
                        <TableCell>{row.amount}</TableCell>
                        {/* <TableCell>{getBalance(account, row)}</TableCell> */}
                        <TableCell>{row.note}</TableCell>
                        <TableCell>
                          <Link to={`salary/${row._id}`}>
                            <IconButton aria-label="edit">
                              {" "}
                              <EditIcon />
                            </IconButton>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
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
};

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

const mapStateToProps = state => ({
  account: state.account,
  loggedInAccount: state.loggedInAccount
});

export default connect(
  mapStateToProps,
  { selectTransaction, setAccount }
)(SalaryTablePage);
