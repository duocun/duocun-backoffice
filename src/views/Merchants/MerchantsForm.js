import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Delete as DeleteIcon,  Add as AddIcon, Save as SaveIcon,  
    FormatListBulleted as FormatListBulletedIcon } from "@material-ui/icons";
import { Box, TextField, ButtonGroup, Button, List, ListItem,
    Select, MenuItem, InputLabel, FormControl } from "@material-ui/core";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import EditSkeleton, { EditSkeletonShort } from "../Common/EditSkeleton";
import ApiAccountService from "services/api/ApiAccountService";

const defaultMerchantsModelState = {
  _id: 'new',
  name: "",
  nameEN: "",
  description: "",
  descriptionEN: "",
  accountId: "",
  pictures: [],
  closed: [],
  dow: "",          // day of week opening, eg. '1,2,3,4,5'
  type: "G",
  rank: 0,
  status: false,
  _orderEnd: "23:59",
  _orderEndTimeArr: ["", "", "", "", "", "", ""],
  rules: [{
      "orderEnd" : {
        "dow" : "1",
        "time" : "23:59"
      } 
    },{
      "orderEnd" : {
        "dow" : "3",
        "time" : "23:59"
      }
  }]
}
const MerchantsForm = ({}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // for accounts
  const [accounts, setAccounts] = useState([]);
  const [associateAccount, setAssociateAccount] = useState("")
  const [accountLoading, setAccountLoading] = useState(true);
  const [accountFilter, setAccountFilter] = useState("");

  // for model
  const [model, setModel] = useState(defaultMerchantsModelState);
  const [ruleSimple, setRuleSimple] = useState(true);

  ////////////////////////////////////
  // For data fetch
  const getMerchantData = () => {

  }
  const getAccountsData = () => {
    ApiAccountService.getAccountList(0, 1000, {type: "merchant"}).then(
      ({ data }) => {
        setAccounts(data.data);
        setAccountLoading(false);
      }
    );
  }
  useEffect( ()=> {
    // only call once
    getAccountsData() 
  }, []);

  ////////////////////////////////////
  // For render and events 

  const _renderUserInfo = ()=> {
    return <React.Fragment>
      <GridItem xs={12}>
        <h5>{t("Basic Information")}</h5>
      </GridItem>
      <GridItem xs={12} lg={12} >
        <FormControl className="dc-full-select">
          <InputLabel id="merchant-type-label">Type</InputLabel>
          <Select required labelId="merchant-type-label" id="merchant-type"
            value={model.type} onChange={ e => setModel({...model, type: e.target.value})} >
            <MenuItem value={'G'}>Grocery</MenuItem>
            <MenuItem value={'2'}>Restaurant</MenuItem>
          </Select>
        </FormControl>
      </GridItem>
      <GridItem xs={12} md={6} lg={6}>
        <TextField id="merchant-name" label={`${t("Merchant Name (Chinese)")}`}
          required className="dc-full" value={model.name}
          onChange={e => { setModel({  ...model, name: e.target.value }); }}
        />
      </GridItem>
      <GridItem xs={12} md={6} lg={6}>
        <TextField id="merchant-nameEN" label={`${t("Merchant Name (English)")}`}
          required className="dc-full" value={model.nameEN}
          onChange={e => { setModel({  ...model, nameEN: e.target.value }); }}
        />
      </GridItem>
      <GridItem xs={12} md={6} lg={12}>
        <br />
        <TextField id="merchant-description" label={t("Description")}
          multiline rowsMax={4} variant="outlined" 
          className="dc-full-textarea" value={model.description}
          onChange={e => {
            setModel({  ...model, description: e.target.value });
          }}
        />
      </GridItem>
      <GridItem xs={12} lg={12}>
        <br />
        <TextField id="merchant-description-en" label={t("DescriptionEN")}
          multiline rowsMax={4} variant="outlined" 
          className="dc-full-textarea" value={model.descriptionEN}
          onChange={e => {
            setModel({  ...model, descriptionEN: e.target.value });
          }}
        />
      </GridItem>
    </React.Fragment>
  }
  const _clickDow = (e, _key) => {
    let _dow =  model.dow;
    const index = _dow.indexOf(_key);
    if ( index >= 0 ) {
      _dow = _dow.substr(0, index-1) + _dow.substr(index+2);
    } else {
      _dow = `${_dow}${_dow ? ',' : ''}${_key}`
    }
    setModel({ ...model, dow: _dow });
  }
  const _DOWS_MAPPING = {
    0: "Sun",
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: "Thu",
    5: 'Fri',
    6: 'Sat'
  }
  const _dowRulesComplexTimeChange = (e, _key) => {
    const _arr = model._orderEndTimeArr;
    _arr[_key] = e.target.value;
    setModel({...model, _orderEndTimeArr: _arr} )
  }
  const _renderDowRulesComplex = () => {
    return <React.Fragment>  
        <GridItem xs={12}>
          <h5>
            {t("Dow and OrderEnd Complex")}
            <Button color="primary" size="small" onClick={ () => { setRuleSimple(true) } }>
              To simple mode
            </Button>
          </h5>
        </GridItem>
        <GridItem xs={12}>
          <List dense>
            {
              Object.keys(_DOWS_MAPPING).map( (_key) => {
                return <ListItem key={`_${_key}`}>
                  <Button onClick={(e) => _clickDow(e, _key)} color="primary" size="small"
                    variant={ model.dow.indexOf(`${_key}`) >= 0 ? "contained":"outlined"}>
                      {_DOWS_MAPPING[_key]}
                  </Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {  model.dow.indexOf(`${_key}`) >= 0 && 
                      <TextField label="OrderEnd Time" type="time" InputLabelProps={{ shrink: true, }} 
                        inputProps={{ step: 300,  }} value={model._orderEndTimeArr[_key]}
                        onChange={ e => _dowRulesComplexTimeChange(e, _key)} />
                  }
                </ListItem>
              })
            }
          </List>
        </GridItem>
      </React.Fragment>
  }
  const _renderDowRulesSimple = () => {
    return <React.Fragment>
      <GridItem xs={12}>
        <h5>
          {t("Dow and OrderEnd Simple")}
          <Button color="primary" size="small" onClick={ () => { setRuleSimple(false) } }>
            To complex mode
          </Button>
      </h5>   
      </GridItem>
      <GridItem xs={3}>
        <TextField label="OrderEnd Time" type="time" value={ model._orderEnd }
          InputLabelProps={{ shrink: true, }} inputProps={{ step: 300,  }} 
          onChange={(e) => {setModel({...model, _orderEnd: e.target.value})}}
        />
      </GridItem>
      <GridItem xs={9} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
        <ButtonGroup color="primary"  size="small" aria-label="outlined primary button group">
          { Object.keys(_DOWS_MAPPING).map( (_key) => {
             return <Button key={`${_DOWS_MAPPING[_key] || "-" }`} onClick={(e) => _clickDow(e, _key) }
                variant={ model.dow.indexOf(`${_key}`) >= 0 ? "contained":"outlined"}>
               {_DOWS_MAPPING[_key]}
              </Button>
          })}
        </ButtonGroup>
      </GridItem>
    </React.Fragment>
  }
  const _renderAccount = () => {
    return  <React.Fragment>
      <GridItem xs={12}>
        <h5>{t("Associated Account")}</h5>
      </GridItem>
      {accountLoading && <EditSkeletonShort />}
      {!accountLoading && <React.Fragment>
          <GridItem xs={9}>
            <FormControl className="dc-full-select">
              <InputLabel id="merchant-type-label">Choose an account to associate</InputLabel>
              <Select labelId="merchant-type-label" id="merchant-type" 
                value={associateAccount} onChange={(e) => setAssociateAccount(e.target.value)} >
                { accounts.filter( 
                    (item) => item.username.indexOf(accountFilter) >=0 ).map( 
                    (item) => <MenuItem value={item._id}>{item.username}</MenuItem> )}
              </Select>
            </FormControl>
          </GridItem>
          <GridItem xs={3}>
            <TextField id="standard-search" label="Filter" type="search"
              value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)}/>
          </GridItem>
          <GridItem xs={12}>No result? Create one and refresh</GridItem>
        </React.Fragment>
      }
    </React.Fragment>
  }

  const renderRight = () => {
    return <GridContainer>
      {_renderAccount()}
      {ruleSimple ? _renderDowRulesSimple() :  _renderDowRulesComplex() }
    </GridContainer>
  }
  const renderLeft = () => {
    return <GridContainer>
        {_renderUserInfo()}
      </GridContainer>
  }

  ////////////////////////////////////
  // For submit
  const saveModel = () => {

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
                  ? t("Edit Merchants") + ": " + model.name
                  : t("Add Merchants")}
              </h4>
            )}
          </CardHeader>
          <CardBody>
            {loading && <EditSkeleton />}
            {!loading && <GridContainer>
              <GridItem xs={12} md={6} lg={6}>{renderLeft()}</GridItem>
              <GridItem xs={12} md={6} lg={6}>{renderRight()} </GridItem>
            </GridContainer>}
          </CardBody>
          <CardFooter direction="row-reverse">
            <GridContainer>
              <GridItem xs={12} >
                <Button color="primary" variant="contained"
                  disabled={loading || processing } onClick={saveModel} >
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

export default MerchantsForm;