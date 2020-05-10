import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Box from "@material-ui/core/Box";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";

import Skeleton from "@material-ui/lab/Skeleton";
import Alert from "@material-ui/lab/Alert";
import CustomInput from "components/CustomInput/CustomInput";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";

import FlashStorage from "services/FlashStorage";
import ApiProductService from "services/api/ApiProductService";
import CategoryTree from "views/Categories/CategoryTree";
import { groupAttributeData, getAllCombinations } from "helper/index";

import AuthService from "services/AuthService";
import ApiAuthService from 'services/api/ApiAuthService';
import ApiAccountService from 'services/api/ApiAccountService';
import ApiTransactionService from 'services/api/ApiTransactionService';

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
    display: "block"
  },
  formControlLabel: {
    marginTop: "1rem",
    marginBottom: "1rem",
    fontWeight: 600
  },
  formGroup: {
    border: "1px solid #eee",
    borderRadius: 5,
    padding: 5
  }
}));

const defaultTransaction = {
  _id: 'new',
  fromId: '',
  fromName: '',
  toId: '',
  toName: '',
  amount: 0,
  actionCode: '',
  modifyBy: '',
  note: ''
}

const defaultActions = [
  { code: 'PS', text: 'Pay Salary' },
  { code: 'PDCH', text: 'Pay Driver Cash' }
];


export const FinanceFormPage = ({ match }) => {
  const { t } = useTranslation();
  const classes = useStyles();


  const [actions, setActions] = useState(defaultActions);
  const [fromAccount, setFromAccount] = useState({ _id: '', username: '' });
  const [accounts, setAccounts] = useState([]);
  const [model, setModel] = useState(defaultTransaction);
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

  }

  const handleFromAccountChange = (fromId) => {
    const account = accounts.find(a => a._id === fromId);
    setModel({ ...model, fromId, fromName: account ? account.username : '' });
  }

  const handleStaffChange = (staffId) => {
    const account = accounts.find(a => a._id === staffId);
    const staffName = account ? account.username : ''
    setModel({ ...model, staffId, staffName, note: `Pay ${staffName}` });
  }

  const handleSave = () => {
    if (model.fromId && model.toId) {
      removeAlert();
      setProcessing(true);
      ApiTransactionService.updateTransaction(model).then(({ data }) => {
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
  }

  const handleBack = () => {

  }

  useEffect(() => {
    const token = AuthService.getAuthToken();
    ApiAuthService.getCurrentUser(token).then(({ data }) => {
      const account = { ...data };
      ApiTransactionService.getTransaction(match.params.id).then(({ data }) => {
        if (data.code === 'success') {
          const tr = data.data;
          setModel({ ...tr, modifyBy: account._id });
        }
        ApiAccountService.getAccountList(null, null, { type: 'driver' }).then(({ data }) => {
          setAccounts(data.data);
        });
      });
    });
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12} lg={8}>
        <Card>
          <CardHeader color="primary">
            <GridContainer>
              <GridItem xs={12} lg={6}>
                <h4>{t("Edit Transaction")}</h4>
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
                  <CustomInput
                    labelText={t("To Account")}
                    id="to-account"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: model.toName,
                      onChange: e => {
                        setModel({ ...model, toName: e.target.value });
                      }
                    }}
                  />
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

              <GridItem xs={12} container direction="row-reverse">
                <Box mt={2}>
                  <Button
                    variant="contained"
                    // href={"finance?accountId=" + model.fromId}
                    href="finance"
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
                    onClick={handleSave}
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


FinanceFormPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.object
};
