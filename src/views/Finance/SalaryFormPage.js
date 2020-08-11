import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import * as moment from "moment";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import Alert from "@material-ui/lab/Alert";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import SaveIcon from "@material-ui/icons/Save";
import FlashStorage from "services/FlashStorage";

import AuthService from "services/AuthService";
import ApiAuthService from "services/api/ApiAuthService";
import ApiAccountService from "services/api/ApiAccountService";
import ApiTransactionService from "services/api/ApiTransactionService";

// import moment from 'moment-timezone/moment-timezone';
import { setAccount } from "redux/actions/account";
import { DatePicker } from "components/DatePicker/DatePicker.js";
import AccountSearch from "components/AccountSearch/AccountSearch.js";
import { defaultSalary } from "views/Finance/SalaryTablePage";

const useStyles = makeStyles(() => ({
  textarea: {
    width: "100%"
  },
  select: {
    width: "100%",
    marginTop: 27
  },
  heading: {
    marginBottom: "0.5rem",
    size: "1.5rem",
    fontWeight: 600
  },
  table: {
    minWidth: 750
  },
  editingCell: {
    padding: "0 5px"
  },
  formControl: {
    marginTop: "27px"
  }
}));

const defaultActions = [
  { code: "PS", text: "Pay Salary" },
  { code: "PDCH", text: "Pay Driver Cash" },
  { code: "T", text: "Transfer" }
];

const SalaryFormPage = ({ match, history, account }) => {
  // moment.tz.add("America/Toronto|EST EDT EWT EPT|50 40 40 40|01010101010101010101010101010101010101010101012301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TR0 1in0 11Wu 1nzu 1fD0 WJ0 1wr0 Nb0 1Ap0 On0 1zd0 On0 1wp0 TX0 1tB0 TX0 1tB0 TX0 1tB0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 4kM0 8x40 iv0 1o10 11z0 1nX0 11z0 1o10 11z0 1o10 1qL0 11D0 1nX0 11B0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|65e5");

  // // localTime --- 'YYYY-MM-DDTHH:mm:ss'
  // const getMomentFromLocal = (localTime, zone='America/Toronto') => {
  //   return moment.tz(localTime, zone);
  // }

  const { t } = useTranslation();
  const classes = useStyles();

  const [modifyByAccount, setModifyByAccount] = useState({
    _id: "",
    username: ""
  });
  // const [accounts, setAccounts] = useState([]);
  const [model, setModel] = useState(defaultSalary);
  const [processing, setProcessing] = useState(false);

  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [staffQuery, setStaffQuery] = useState("");

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
      const account = { ...data };
      setModifyByAccount(account);
    });
  }, []);

  useEffect(() => {
    if (!model._id) {
      if (match.params.id === "new") {
        ApiAccountService.getAccountList(null, null, {
          username: "Expense",
          type: "system"
        }).then(({ data }) => {
          const expense = data.data[0];
          const toName = expense ? expense.username : "";
          const staffName = account ? account.username : "";
          setModel({
            ...model,
            toId: expense ? expense._id : "",
            toName,
            staffId: account ? account._id : "",
            staffName,
            note: account ? `Pay salary to ${account.username}` : "",
            modifyBy: modifyByAccount._id
          });
          setToQuery(toName);
          setStaffQuery(staffName);
        });
      } else {
        ApiTransactionService.getTransaction(match.params.id).then(
          ({ data }) => {
            const tr = data.data;
            if (tr.actionCode === "PS") {
              setModel({
                ...tr,
                modifyBy: modifyByAccount._id
              });
            } else {
              setModel({ ...tr, modifyBy: modifyByAccount._id });
            }

            if (tr) {
              setFromQuery(tr.fromName);
              setToQuery(tr.toName);
              setStaffQuery(tr.staffName);
            }
          }
        );
      }
    }
  }, [account]);

  const handleSelectFromAccount = fromAccount => {
    setFromQuery(fromAccount ? fromAccount.username : "");
    setModel({
      ...model,
      fromId: fromAccount._id,
      fromName: fromAccount.username
    });
  };

  const handleClearFromAccount = () => {
    setFromQuery("");
  };

  const handleSearchFromAccount = (page, rowsPerPage, keyword) => {
    return ApiAccountService.getAccountByKeyword(page, rowsPerPage, keyword);
  };
  const handleSelectToAccount = toAccount => {
    setToQuery(toAccount ? toAccount.username : "");
    setModel({ ...model, toId: toAccount._id, toName: toAccount.username });
  };

  const handleClearToAccount = () => {
    setToQuery("");
  };

  const handleSearchToAccount = (page, rowsPerPage, keyword) => {
    return ApiAccountService.getAccountByKeyword(page, rowsPerPage, keyword);
  };

  const handleSearchStaff = (page, rowsPerPage, keyword) => {
    return ApiAccountService.getAccountByKeyword(page, rowsPerPage, keyword, [
      "driver"
    ]);
  };

  const handleSelectStaff = account => {
    const staffName = account ? account.username : "";
    setStaffQuery(account ? account.username : "");
    setModel({
      ...model,
      staffId: account._id,
      staffName,
      note: `Pay salary to ${staffName}`
    });
  };

  const handleClearStaff = () => {
    setStaffQuery("");
  };

  const handelDateChange = m => {
    const dt = m.toISOString();
    setModel({ ...model, created: dt });
  };

  const handelDateClick = e => {};

  const handelDateClear = e => {
    e.stopPropagation();
    setModel({ ...model, created: "" });
  };

  const handleUpdateData = accountId => {
    // updateData(accountId, actionCode, startDate, endDate);
  };

  const handleCreate = () => {
    if (model.fromId && model.staffId) {
      removeAlert();
      setProcessing(true);
      ApiTransactionService.createTransaction(model)
        .then(({ data }) => {
          if (data.code === "success") {
            const newAlert = {
              message: t("Saved successfully"),
              severity: "success"
            };
            if (model._id === "new") {
              FlashStorage.set("SALARY_ALERT", newAlert);
              return;
            } else {
              setAlert(newAlert);
              // update(account._id);
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
      ApiTransactionService.updateTransaction(model)
        .then(({ data }) => {
          if (data.code === "success") {
            setAlert({
              message: t("Update successfully"),
              severity: "success"
            });
            // update(account._id);
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
    if (model._id) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleBack = () => {};

  return (
    <Card>
      <CardHeader color="primary">
        <GridContainer>
          <GridItem xs={12} lg={6}>
            <h4>{t(model && model._id ? "Edit Salary" : "New Salary")}</h4>
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
          <GridItem xs={12} md={4} lg={4}>
            <AccountSearch
              label="From Account"
              placeholder="Search name or phone"
              val={fromQuery}
              onSelect={handleSelectFromAccount}
              onSearch={handleSearchFromAccount}
              onClear={handleClearFromAccount}
            />
          </GridItem>

          <GridItem xs={12} md={4} lg={4}>
            <AccountSearch
              label="To Account"
              placeholder="Search name or phone"
              val={toQuery}
              onSelect={handleSelectToAccount}
              onSearch={handleSearchToAccount}
              onClear={handleClearToAccount}
            />
          </GridItem>

          <GridItem xs={12} md={4} lg={4}>
            <AccountSearch
              label="Pay Salary To"
              placeholder="Search name or phone"
              val={staffQuery}
              id={model.staffId}
              onSelect={handleSelectStaff}
              onSearch={handleSearchStaff}
              onClear={handleClearStaff}
            />
          </GridItem>

          <GridItem xs={12} md={4} lg={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id="salary-action"
                label={t("Action")}
                value={t("Pay Salary")}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
              />
            </FormControl>
          </GridItem>

          <GridItem xs={12} md={4} lg={4}>
            <FormControl className={classes.formControl}>
              <DatePicker
                label="Created Date"
                date={moment.utc(model.created)}
                onChange={handelDateChange}
                onClick={handelDateClick}
                onClear={handelDateClear}
              />
            </FormControl>
          </GridItem>

          <GridItem xs={12} md={4} lg={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id="salary-amount"
                label={t("Amount")}
                value={model.amount}
                InputLabelProps={{ shrink: true }}
                onChange={e => {
                  setModel({ ...model, amount: e.target.value });
                }}
              />
            </FormControl>
          </GridItem>

          <GridItem xs={12} md={12} lg={8}>
            <Box pb={2}>
              <CustomInput
                labelText={t("Note")}
                id="note"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: model.note,
                  onChange: e => {
                    setModel({ ...model, note: e.target.value });
                  }
                }}
                labelProps={{ shrink: model.note !== null ? true : false }}
              />
            </Box>
          </GridItem>

          <GridItem xs={12} container direction="row-reverse">
            <Box mt={2} mr={2}>
              <Link to={`../salary`}>
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
          </GridItem>
        </GridContainer>
      </CardBody>
    </Card>
  );
};

SalaryFormPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.object
};

const mapStateToProps = state => ({
  // transaction: state.transaction,
  // deliverDate: state.deliverDate,
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
    // selectTransaction,
    // setDeliverDate,
    setAccount
  }
)(SalaryFormPage);
