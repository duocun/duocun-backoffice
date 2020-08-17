import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { useTranslation } from "react-i18next";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import FlashStorage from "services/FlashStorage";

import AuthService from "services/AuthService";
import ApiAuthService from "services/api/ApiAuthService";
import ApiAccountService from "services/api/ApiAccountService";
import ApiTransactionService from "services/api/ApiTransactionService";

import { defaultTransaction } from "views/Finance/FinanceModel";
import { TransactionForm } from "./TransactionForm";

import { selectTransaction } from "redux/actions/transaction";
import { setAccount } from "redux/actions/account";


const TransactionFormPage = ({
  match,
  account,
  // transaction,
  // update
}) => {
  // moment.tz.add("America/Toronto|EST EDT EWT EPT|50 40 40 40|01010101010101010101010101010101010101010101012301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TR0 1in0 11Wu 1nzu 1fD0 WJ0 1wr0 Nb0 1Ap0 On0 1zd0 On0 1wp0 TX0 1tB0 TX0 1tB0 TX0 1tB0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 4kM0 8x40 iv0 1o10 11z0 1nX0 11z0 1o10 11z0 1o10 1qL0 11D0 1nX0 11B0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|65e5");

  // // localTime --- 'YYYY-MM-DDTHH:mm:ss'
  // const getMomentFromLocal = (localTime, zone='America/Toronto') => {
  //   return moment.tz(localTime, zone);
  // }

  // const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [modifyByAccount, setModifyByAccount] = useState({
    _id: "",
    username: ""
  });
  // const [accounts, setAccounts] = useState([]);
  const [model, setModel] = useState(defaultTransaction);
  // const [processing, setProcessing] = useState(false);
  // const removeAlert = () => {
  //   setAlert({
  //     message: "",
  //     severity: "info"
  //   });
  // };
  // const [alert, setAlert] = useState(
  //   FlashStorage.get("FINANCE_ALERT") || { message: "", severity: "info" }
  // );

  useEffect(() => {
    if (!model._id) {
      if (match.params.id === "new") {
        if (model.actionCode === "PS") {
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
          });
        } else {
          setModel({
            ...model,
            modifyBy: modifyByAccount._id
          });
        }
      } else {
        ApiTransactionService.getTransaction(match.params.id).then(
          ({ data }) => {
            const tr = data.data;
            setModel({ ...tr, modifyBy: modifyByAccount._id });
          }
        );
      }
    }
  }, []);

  useEffect(() => {
    const token = AuthService.getAuthToken();
    ApiAuthService.getCurrentUser(token).then(({ data }) => {
      const account = { ...data };
      setModifyByAccount(account);
      // ApiTransactionService.getTransaction(match.params.id).then(({ data }) => {
      //   if (data.code === 'success') {
      //     const tr = data.data;
      //     setModel({ ...tr, modifyBy: account._id });
      //   }
      // setModel({ ...model, modifyBy: account._id });
      ApiAccountService.getAccountList(null, null, {
        type: { $in: ["driver", "system"] }
      }).then(({ data }) => {
        // setAccounts(data.data);
      });
      // });
    });
  }, []);

  // const handleActionChange = actionCode => {
  //   if (model._id) {
  //     if (actionCode === transaction.actionCode) {
  //       setModel({
  //         ...model,
  //         actionCode,
  //         note: transaction.note ? transaction.note : ""
  //       });
  //     } else {
  //       setModel({ ...model, actionCode, note: "" });
  //     }
  //   } else {
  //     if (actionCode === "PS") {
  //       setModel({ ...model, actionCode });
  //     } else {
  //       setModel({ ...model, actionCode, note: "" });
  //     }
  //   }
  // };

  // const handleFromAccountChange = fromId => {
  //   const account = accounts.find(a => a._id === fromId);
  //   setModel({ ...model, fromId, fromName: account ? account.username : "" });
  // };

  // const handleToAccountChange = toId => {
  //   const account = accounts.find(a => a._id === toId);
  //   setModel({ ...model, toId, toName: account ? account.username : "" });
  // };

  // const handleStaffChange = staffId => {
  //   const account = accounts.find(a => a._id === staffId);
  //   const staffName = account ? account.username : "";
  //   setModel({
  //     ...model,
  //     staffId,
  //     staffName,
  //     note: `Pay salary to ${staffName}`
  //   });
  // };

  const handleUpdateData = accountId => {
    // updateData(accountId, actionCode, startDate, endDate);
  };

  // const handleCreate = () => {
  //   if (model.fromId && model.staffId) {
  //     removeAlert();
  //     setProcessing(true);
  //     ApiTransactionService.createTransaction(model)
  //       .then(({ data }) => {
  //         if (data.code === "success") {
  //           const newAlert = {
  //             message: t("Saved successfully"),
  //             severity: "success"
  //           };
  //           if (model._id === "new") {
  //             FlashStorage.set("SALARY_ALERT", newAlert);
  //             return;
  //           } else {
  //             setAlert(newAlert);
  //             update(account._id);
  //           }
  //         } else {
  //           setAlert({
  //             message: t("Save failed"),
  //             severity: "error"
  //           });
  //         }
  //         setProcessing(false);
  //       })
  //       .catch(e => {
  //         console.error(e);
  //         setAlert({
  //           message: t("Save failed"),
  //           severity: "error"
  //         });
  //         setProcessing(false);
  //       });
  //   }
  // };

  // const handleUpdate = () => {
  //   if (model.fromId && model.toId) {
  //     removeAlert();
  //     setProcessing(true);
  //     ApiTransactionService.updateTransaction(model)
  //       .then(({ data }) => {
  //         if (data.code === "success") {
  //           setAlert({
  //             message: t("Update successfully"),
  //             severity: "success"
  //           });
  //           update(account._id);
  //         } else {
  //           setAlert({
  //             message: t("Update failed"),
  //             severity: "error"
  //           });
  //         }
  //         setProcessing(false);
  //       })
  //       .catch(e => {
  //         console.error(e);
  //         setAlert({
  //           message: t("Update failed"),
  //           severity: "error"
  //         });
  //         setProcessing(false);
  //       });
  //   }
  // };

  return (
    <GridContainer>
      {/* <GridItem xs={12} sm={12} lg={12}>
        <Card>
          <CardHeader color="primary">
            <GridContainer>
              <GridItem xs={12} lg={6}>
                <h4>{t(transaction._id ? "Edit Transaction" : "New Transaction")}</h4>
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
                  <FormControl className={classes.select}>
                    <InputLabel id="from-select-label">From Account</InputLabel>
                    <Select required
                      labelId="from-select-label"
                      id="from-select"
                      value={model.fromId}
                      onChange={e => handleFromAccountChange(e.target.value)}
                    >
                      {
                        accounts && accounts.length > 0 &&
                        accounts.map(d => <MenuItem key={d._id} value={d._id}>{d.username}</MenuItem>)
                      }
                    </Select>
                  </FormControl>
                </Box>
              </GridItem>

              <GridItem xs={12} lg={6}>
                <Box pb={2}>
                  <FormControl className={classes.select}>
                    <InputLabel id="to-select-label">To Account</InputLabel>
                    <Select required
                      labelId="to-select-label"
                      id="to-select"
                      value={model.toId}
                      onChange={e => handleToAccountChange(e.target.value)}
                    >
                      {
                        accounts && accounts.length > 0 &&
                        accounts.map(d => <MenuItem key={d._id} value={d._id}>{d.username}</MenuItem>)
                      }
                    </Select>
                  </FormControl>
                </Box>
              </GridItem>

              <GridItem xs={12} lg={6}>
                <Box pb={2}>
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
                </Box>
              </GridItem>

              {
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
              }

              <GridItem xs={12} lg={6}>
                <Box pb={2}>
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
                </Box>
              </GridItem>

              <GridItem xs={12} lg={6}>
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
                  />
                </Box>
              </GridItem>
              <GridItem>
                <KeyboardDatePicker
                  variant="inline"
                  label="Date"
                  format="YYYY-MM-DD"
                  value={moment.utc(model.created)}
                  onChange={(m) => setModel({...model, created: m.toISOString()})}
                />
              </GridItem>
              <GridItem xs={12} container direction="row-reverse">
                <Box mt={2}>
                  <Button
                    variant="contained"
                    // href={"finance?accountId=" + model.fromId}
                    href="finance/salary"
                    onClick={handleBack}
                  >
                    <FormatListBulletedIcon />
                    {t("Back")}
                  </Button>
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
      </GridItem> */}

      <GridItem xs={12} sm={12} md={12}>
        <TransactionForm
          account={account}
          transaction={model}
          items={items}
          onAfterUpdate={handleUpdateData}
        />
      </GridItem>
    </GridContainer>
  );
};

TransactionFormPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.object
};

const mapStateToProps = state => ({
  transaction: state.transaction,
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
    selectTransaction,
    // setDeliverDate,
    setAccount
  }
)(TransactionFormPage);
