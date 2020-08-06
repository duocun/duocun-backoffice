import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@material-ui/core/styles";

import { Save as SaveIcon, FormatListBulleted as FormatListBulletedIcon } from "@material-ui/icons";
import { TextField, Button, Checkbox,
    Select, MenuItem, InputLabel, FormControl, FormControlLabel } from "@material-ui/core";
import { Alert } from "@material-ui/lab"

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import EditSkeleton from "../Common/EditSkeleton";
import ApiAccountService from "services/api/ApiAccountService";

import { setAccount } from "redux/actions/account"; 
import { defaultAccount, AccountAttribute, ROLE_MAPPING, ATTRIBUTES_MAPPING } from "views/Accounts/AccountModel.js"

const useStyles = makeStyles({
  formControl: {
    marginTop: "27px"
  }
});
const AccountFormPage = ({match, account, setAccount}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // for model
  const [model, setModel] = useState(defaultAccount);
  const [alert, setAlert] = useState({ message: "", severity: "info" });

  //////////////////// For data fetch
  const getAccountData = () => {

  }

  useEffect(() => {
    if (match.params.id === 'new') {
          // setModel({
          //   ...model
          // });
      }else{
        const accountId = match.params.id;
        ApiAccountService.getAccount(accountId).then(({data}) => {
          setModel({
            ...data.data
          });
        });
      }
  }, [account]);

  const _renderUserInfo = ()=> {
    return <React.Fragment>
      <GridItem xs={12}>
        <h5>{t("Basic Information")}</h5>
      </GridItem>
      <GridItem xs={12} lg={12} >
        <FormControl className="dc-full-select">
          <InputLabel id="merchant-type-label">Type</InputLabel>
          <Select required labelId="merchant-type-label" id="account-type"
            value={model.type} onChange={ e => setModel({...model, type: e.target.value})} >
            <MenuItem value={'merchant'}>Merchant</MenuItem>
            <MenuItem value={'driver'}>Driver</MenuItem>
            <MenuItem value={'client'}>Client</MenuItem>
            <MenuItem value={'system'}>System</MenuItem>
          </Select>
        </FormControl>
      </GridItem>
      <GridItem xs={12} md={6} lg={6}>
        <TextField id="account-username" label={`${t("Username")}`}
          required className="dc-full" value={model.username}
          onChange={e => { setModel({  ...model, username: e.target.value }); }}
        />
      </GridItem>
      <GridItem xs={12} md={6} lg={6}>
        <TextField id="account-imageurl" label={`${t("ImageUrl")}`}
          disabled className="dc-full" value={model.imageurl}
          onChange={e => { setModel({  ...model, imageurl: e.target.value }); }}
        />
      </GridItem>
      <GridItem xs={12} md={6} lg={6}>
        <TextField id="account-realm" label={`${t("Realm")}`}
          disabled className="dc-full" value={model.realm}
          onChange={e => { setModel({  ...model, realm: e.target.value }); }}
        />
      </GridItem>
      <GridItem xs={12} md={6} lg={6}>
        <TextField id="account-sex" label={`${t("Sex")}`}
          disabled className="dc-full" value={model.sex}
          onChange={e => { setModel({  ...model, sex: e.target.value }); }}
        />
      </GridItem>
      <GridItem xs={12} md={6} lg={6}>
        <TextField id="account-phone" label={`${t("Phone")}`}
          required className="dc-full" value={model.phone}
          onChange={e => { setModel({  ...model, phone: e.target.value }); }}
        />
      </GridItem>
    </React.Fragment>
  }
  const _attributeClick = (e, _key) => {
    const attr = model.attributes || [];
    if (e.target.checked) {
      if (attr.indexOf(_key) < 0 ) {
        attr.push(_key);
      }
    } else {
      const index = attr.indexOf(_key);
      if (index >= 0 ) {
        attr.splice(index, 1);
      }
    }
    setModel({...model, attributes: attr});
  }
  const _renderAttributes = () => {
    return <React.Fragment>
      <GridItem xs={12}>
        <h5>{t("Attributes")}</h5>
      </GridItem>
      <GridItem xs={12} lg={12} >
        <GridContainer>
          {
            model && model.attributes &&
            Object.keys(AccountAttribute).map( _key => {
              return <GridItem xs={6} lg={6} >
                  <FormControlLabel
                    control={<Checkbox checked={model.attributes.indexOf(_key)>=0}
                      onChange={(e) => _attributeClick(e, _key)} color="primary" />}
                    label={AccountAttribute[_key]||_key}
                    labelPlacement="end"
                  />
                </GridItem>
            })
          }
        </GridContainer>
      </GridItem>
    </React.Fragment>
  }

  const renderRight = () => {
    return <GridContainer>
      {_renderAttributes()}
    </GridContainer>
  }
  const renderLeft = () => {
    return <GridContainer>
        {_renderUserInfo()}
      </GridContainer>
  }
  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };


  ////////////////////////////////////
  // For submit
  const saveModel = () => {
    setProcessing(true);
    if(model && (!model._id || model._id === 'new')){
      ApiAccountService.createAccount(model).then(
        ({ data }) => {
          setProcessing(false);
          if ( data.code === "success" ) {
            // success 
            setAlert({
              message: "Created success!",
              severity: "success"
            });
          } else {
            // failure
            setAlert({
              message: data.data,
              severity: "error"
            });
          }
        }
      );
    }else{
      ApiAccountService.updateAccount(model._id, model).then(
        ({ data }) => {
          setProcessing(false);
          if ( data.code === "success" ) {
            // success 
            setAlert({
              message: "Update account success!",
              severity: "success"
            });
          } else {
            // failure
            setAlert({
              message: data.data,
              severity: "error"
            });
          }
        }
      );
    }
  }
  return (
    <GridContainer>
      <GridItem xs={12} lg={12}>
        <Card>
          <CardHeader color="primary">
            {loading && <h4>{t("Merchants")}</h4>}
            {!loading && (
              <h4>
                {model._id && model._id !== "new"
                  ? t("Edit Account") + ": " + model.username
                  : t("Add Account")}
              </h4>
            )}
          </CardHeader>
          <CardBody>
            {loading && <EditSkeleton />}
            {!!alert.message && (
              <Alert severity={alert.severity} onClose={removeAlert}>
                {alert.message}
              </Alert>
            )}
            {!loading && <GridContainer>
              <GridItem xs={12} md={6} lg={6}>{renderLeft()}</GridItem>
              <GridItem xs={12} md={6} lg={6}>{renderRight()} </GridItem>
            </GridContainer>}
          </CardBody>
          <CardFooter direction="row-reverse">
            <GridContainer>
              <GridItem xs={12} >
                <Button color="primary" variant="contained"
                  disabled={loading || processing || !model.username || !model.type  } 
                  onClick={saveModel} >
                  <SaveIcon /> {t("Save")}
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link to={`/accounts`}>
                  <Button variant="contained">
                    <FormatListBulletedIcon /> {t("Back")}
                  </Button>
                </Link>

              </GridItem>
            </GridContainer>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

AccountFormPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  // history: PropTypes.object
};

const mapStateToProps = (state) => ({ 
  // accounts: state.accounts,
  account: state.account
});
// const mapDispatchToProps = (dispatch) => ({
//   loadAccounts: (payload, searchOption) => {
//     dispatch(loadAccountsAsync(payload, searchOption));
//   },
// });
export default connect(
  mapStateToProps, 
  {setAccount}
)(AccountFormPage);