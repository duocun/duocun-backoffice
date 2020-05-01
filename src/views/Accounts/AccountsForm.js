import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

const defaultAccountsModelState = {
  _id: 'new',
  username: "",
  imageurl: "",
  realm: "",
  sex: "",
  openId: "",
  type: "merchant",
  balance: 0,
  phone: "",
  created: "",
  verificationCode: "",
  verified: true,
  attributes: []
}
const AccountsForm = ({}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // for model
  const [model, setModel] = useState(defaultAccountsModelState);
  const [alert, setAlert] = useState({ message: "", severity: "info" });

  const _ATTRIBUTES = {
    I: "INDOOR", 
    G: "GARDENING", 
    R: "ROOFING", 
    O: "OFFICE", 
    P: "PLAZA", 
    H: "HOUSE", 
    C: "CONDO",
  }

  //////////////////// For data fetch
  const getAccountData = () => {

  }

  /////////////////// For render and events 

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
            <MenuItem value={'freight'}>Freight</MenuItem>
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
          disabled className="dc-full" value={model.phone}
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
            Object.keys(_ATTRIBUTES).map( _key => {
              return <GridItem xs={6} lg={6} >
                  <FormControlLabel
                    control={<Checkbox checked={model.attributes.indexOf(_key)>=0}
                      onChange={(e) => _attributeClick(e, _key)} color="primary" />}
                    label={_ATTRIBUTES[_key]||_key}
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
                  ? t("Edit Account") + ": " + model.name
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
                <Button variant="contained" href="../Merchants">
                  <FormatListBulletedIcon /> {t("Back")}
                </Button>
              </GridItem>
            </GridContainer>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

export default AccountsForm;