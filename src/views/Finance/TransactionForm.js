import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
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
import Alert from "@material-ui/lab/Alert";
import CustomInput from "components/CustomInput/CustomInput";

import Button from "@material-ui/core/Button";

import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import SaveIcon from "@material-ui/icons/Save";
import FlashStorage from "services/FlashStorage";

import { DropdownSelect } from "components/DropdownSelect/DropdownSelect";

import AuthService from "services/AuthService";
import ApiAuthService from "services/api/ApiAuthService";
import ApiAccountService from "services/api/ApiAccountService";
import ApiTransactionService from "services/api/ApiTransactionService";

import AccountSearch from "components/AccountSearch/AccountSearch.js";

const useStyles = makeStyles({
  formControl: {
    width: "100%",
    display: "block",
    marginTop: "27px"
  }
});

const defaultActions = [
  { key: "ACTC", text: "Add Credit to Client" },
  { key: "PS", text: "Pay Salary" },
  { key: "PDCH", text: "Pay Driver Cash" },
  { key: "T", text: "Transfer" },
  { key: "RC", text: "Refund to Client" },
  { key: "PMCH", text: "Pay Merchant Cash" },
  { key: "PMC", text: "Pay Merchant from Bank" },
  { key: "POR", text: "Pay Office Rent" },
  { key: "D", text: "Discount" },
  { key: "S", text: "Supplies" },
  { key: "BM", text: "Buy Material" },
  { key: "BE", text: "Buy Equipment" },
  { key: "BA", text: "Buy Advertisement" },
  { key: "OFD", text: "Order From Duocun" }
];

export const TransactionForm = ({
  account,
  transaction,
  items,
  onAfterUpdate
}) => {
  // moment.tz.add("America/Toronto|EST EDT EWT EPT|50 40 40 40|01010101010101010101010101010101010101010101012301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TR0 1in0 11Wu 1nzu 1fD0 WJ0 1wr0 Nb0 1Ap0 On0 1zd0 On0 1wp0 TX0 1tB0 TX0 1tB0 TX0 1tB0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 4kM0 8x40 iv0 1o10 11z0 1nX0 11z0 1o10 11z0 1o10 1qL0 11D0 1nX0 11B0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|65e5");

  // // localTime --- 'YYYY-MM-DDTHH:mm:ss'
  // const getMomentFromLocal = (localTime, zone='America/Toronto') => {
  //   return moment.tz(localTime, zone);
  // }
  const { t } = useTranslation();
  const classes = useStyles();
  const [actions, setActions] = useState(defaultActions);
  const [modifyByAccount, setModifyByAccount] = useState({
    _id: "",
    username: ""
  });
  const [model, setModel] = useState(transaction);

  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [clientQuery, setClientQuery] = useState("");
  const [staffQuery, setStaffQuery] = useState("");

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

  const handleActionChange = actionCode => {
    if (model._id) {
      if (actionCode === transaction.actionCode) {
        setModel({
          ...model,
          actionCode,
          note: transaction.note ? transaction.note : ""
        });
      } else {
        setModel({ ...model, actionCode, note: "" });
      }
    } else {
      setModel({ ...model, actionCode, note: "" });
    }
  };

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

  const handleSelectClient = client => {
    setClientQuery(client ? client.username : "");
    setModel({ ...model, clientId: client._id, clientName: client.username });
  };

  const handleClearClient = () => {
    setClientQuery("");
  };

  const handleSearchClient = (page, rowsPerPage, keyword) => {
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

  const handleCreate = () => {
    if (model.fromId && model.toId) {
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
              FlashStorage.set("TRANSACTION_ALERT", newAlert);
              return;
            } else {
              setAlert(newAlert);
              onAfterUpdate(model.fromId);
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
            onAfterUpdate(account._id);
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

  // useEffect(() => {
  //   if (transaction.actionCode === 'PS') {
  //     setModel({
  //       ...transaction,
  //       staffId: account._id,
  //       staffName: account.username,
  //       note: `Pay salary to ${account.username}`,
  //       modifyBy: modifyByAccount._id
  //     });
  //   } else {
  //     setModel({...transaction, modifyBy: modifyByAccount._id});
  //   }
  // }, [transaction]);

  useEffect(() => {
    const token = AuthService.getAuthToken();
    ApiAuthService.getCurrentUser(token).then(({ data }) => {
      const account = { ...data.data };

      if (transaction && transaction.fromId && transaction.toId) {
        let ids = [transaction.fromId, transaction.toId];
        if (transaction.actionCode === "PS") {
          ids = [transaction.fromId, transaction.toId, transaction.staffId];
        }
        if (transaction.actionCode === "RC") {
          ids = [transaction.fromId, transaction.toId, transaction.clientId];
        }
        ApiAccountService.getAccounts({ _id: { $in: ids } }).then(
          ({ data }) => {
            const fromAccount = data.data.find(
              d => d._id === transaction.fromId
            );
            const toAccount = data.data.find(d => d._id === transaction.toId);
            let client;
            if (transaction.actionCode === "PS") {
              // staff = data.data.find(d => d._id === transaction.staffId);
              setStaffQuery(transaction.staffName);
            }
            if (transaction.actionCode === "RC") {
              client = data.data.find(d => d._id === transaction.clientId);
              if (client) {
                setClientQuery(client.username);
              }
            }
            setModifyByAccount(account);
            if (transaction) {
              if (fromAccount) {
                setFromQuery(fromAccount.username);
              }
              if (toAccount) {
                setToQuery(toAccount.username);
              }
              setModel({ ...transaction, modifyBy: modifyByAccount._id });
            }
          }
        );
      } else {
        setModifyByAccount(account);
        if (transaction && transaction.fromId && transaction.toId) {
          setModel({ ...transaction, modifyBy: modifyByAccount._id });
        }
      }
    });
  }, [transaction, modifyByAccount._id]);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} lg={12}>
        <Card>
          <CardHeader color="primary">
            <GridContainer>
              <GridItem xs={12} lg={6}>
                <h4>
                  {t(
                    transaction && transaction._id
                      ? "Edit Transaction"
                      : "New Transaction"
                  )}
                </h4>
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
                <FormControl className={classes.formControl}>
                  <AccountSearch
                    label="From Account"
                    placeholder="Search name or phone"
                    val={fromQuery}
                    onSelect={handleSelectFromAccount}
                    onSearch={handleSearchFromAccount}
                    onClear={handleClearFromAccount}
                  />
                </FormControl>
              </GridItem>

              <GridItem xs={12} md={4} lg={4}>
                <FormControl className={classes.formControl}>
                  <AccountSearch
                    label="To Account"
                    placeholder="Search name or phone"
                    val={toQuery}
                    onSelect={handleSelectToAccount}
                    onSearch={handleSearchToAccount}
                    onClear={handleClearToAccount}
                  />
                </FormControl>
              </GridItem>

              {model.actionCode === "RC" && (
                <GridItem xs={12} md={4} lg={4}>
                  <FormControl className={classes.formControl}>
                    <AccountSearch
                      label="Client"
                      placeholder="Search name or phone"
                      val={clientQuery}
                      id={model.clientId}
                      onSelect={handleSelectClient}
                      onSearch={handleSearchClient}
                      onClear={handleClearClient}
                    />
                  </FormControl>
                </GridItem>
              )}

              {model.actionCode === "PS" && (
                <GridItem xs={12} md={4} lg={4}>
                  <FormControl className={classes.formControl}>
                    <AccountSearch
                      label="Pay Salary To"
                      placeholder="Search name or phone"
                      val={staffQuery}
                      id={model.staffId}
                      onSelect={handleSelectStaff}
                      onSearch={handleSearchStaff}
                      onClear={handleClearStaff}
                    />
                  </FormControl>
                </GridItem>
              )}

              {actions && actions.length > 0 && model && (
                <GridItem xs={12} md={4} lg={4}>
                  <FormControl className={classes.formControl}>
                    <DropdownSelect
                      id="action-select"
                      label={t("Action")}
                      value={model.actionCode}
                      options={actions}
                      onChange={handleActionChange}
                    />
                  </FormControl>
                </GridItem>
              )}

              {items && items.length > 0 && (
                <GridItem xs={12} lg={12}>
                  <Box pb={2}>
                    {items.map(it => (
                      <div key={it.productId}>
                        {it.productName} x{it.quantity}
                      </div>
                    ))}
                  </Box>
                </GridItem>
              )}

              {model && model.amount !== undefined && (
                <GridItem xs={12} md={4} lg={4}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      id="transaction-amount"
                      label={t("Amount")}
                      value={model.amount}
                      InputLabelProps={{ shrink: true }}
                      onChange={e => {
                        setModel({ ...model, amount: e.target.value });
                      }}
                    />
                  </FormControl>
                </GridItem>
              )}

              <GridItem xs={12} md={9} lg={9}>
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
              <GridItem xs={12} md={4} lg={4}>
                <KeyboardDatePicker
                  variant="inline"
                  label={t("Created Date")}
                  format="YYYY-MM-DD"
                  // format={format}
                  value={moment.utc(model.created)}
                  onChange={m =>
                    setModel({ ...model, created: m.toISOString() })
                  }
                />
              </GridItem>

              <GridItem xs={12} container direction="row-reverse">
                <Box mt={2} mr={2}>
                  <Link to={`../transactions`}>
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
      </GridItem>
    </GridContainer>
  );
};

TransactionForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.object
};
