import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Delete as DeleteIcon,  Add as AddIcon, } from "@material-ui/icons";
import { TextField, ButtonGroup, Button, List, ListItem, 
    ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput";

import EditSkeleton from "../Common/EditSkeleton";

const defaultMerchantsModelState = {
  _id: 'new',
  name: "",
  nameEN: "",
  description: "",
  address: {},
  accountId: "",
  mallId: "",
  pictures: [],
  closed: [],
  dow: "",          // day of week opening, eg. '1,2,3,4,5'
  type: "",
  mall : { },
  ownerId: [],
  location: {
    lat: 0, 
    lng: 0
  },      // lat lng
  malls: [],        // mall id
  order: 0,
  // inRange: boolean;
  onSchedule: false,
  phases: [{
    "orderEnd" : "10:30",
    "pickup" : "11:20"
  }],
  rules: []
}
const MerchantsForm = ({}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [model, setModel] = useState(defaultMerchantsModelState);
  const [phaseIndex, setPhaseIndex] = useState(-1);
  const [orderEnd, setOrderEnd] = useState("");
  const [pickup, setPickup] = useState("");

  const _renderUserInfo = ()=> {
    return <React.Fragment>
      <GridItem xs={12}>
        <h5>{t("Basic Information")}</h5>
      </GridItem>
      <GridItem xs={12} lg={6}>
        <CustomInput labelText={t("Merchant Name (Chinese)")} id="merchant-name"
          formControlProps={{ fullWidth: true }}
          inputProps={{ value: model.name, onChange: e => {
            setModel({ ...model, name: e.target.value });
          }}}
        />
      </GridItem>
      <GridItem xs={12} lg={6}>
        <CustomInput labelText={t("Merchant Name (English)")} id="merchant-nameEN"
          formControlProps={{ fullWidth: true }}
          inputProps={{ value: model.nameEN, onChange: e => {
            setModel({ ...model, nameEN: e.target.value });
          }}}
        />
      </GridItem>
      <GridItem xs={12} lg={12}>
        <TextField id="merchant-description" label={t("Description")}
          multiline rowsMax={4} variant="outlined" 
          className="dc-full-textarea" value={model.description}
          onChange={e => {
            setModel({  ...model, description: e.target.value });
          }}
        />
      </GridItem>
    </React.Fragment>
  }

  const _renderAddress = () => {
    return <React.Fragment>
      <GridItem xs={12}>
        <h5>{t("Address")}</h5>
      </GridItem>
      <GridItem xs={12} lg={6}>
        <CustomInput labelText={t("Street Name")} id="street-name"
          formControlProps={{ fullWidth: true }}
          inputProps={{ value: model.address.streetName, onChange: e => {
            setModel({ ...model, ['address.streetName']: e.target.value });
          }}}
        />
      </GridItem>
      <GridItem xs={12} lg={6}>
        <CustomInput labelText={t("Street Number")} id="street-number"
          formControlProps={{ fullWidth: true }}
          inputProps={{ value: model.address.streetNumber, onChange: e => {
            setModel({ ...model, ['address.streetNumber']: e.target.value });
          }}}
        />
      </GridItem>
      <GridItem xs={12} lg={6}>
        <CustomInput labelText={t("Sublocality")} id="sub-locality"
          formControlProps={{ fullWidth: true }}
          inputProps={{ value: model.address.sublocality, onChange: e => {
            setModel({ ...model, ['address.sublocality']: e.target.value });
          }}}
        />
      </GridItem>
      <GridItem xs={12} lg={6}>
        <CustomInput labelText={t("City")} id="city"
          formControlProps={{ fullWidth: true }}
          inputProps={{ value: model.address.city, onChange: e => {
            setModel({ ...model, ['address.city']: e.target.value });
          }}}
        />
      </GridItem>
      <GridItem xs={12} lg={6}>
        <CustomInput labelText={t("Province")} id="province"
          formControlProps={{ fullWidth: true }}
          inputProps={{ value: model.address.province, onChange: e => {
            setModel({ ...model, ['address.province']: e.target.value });
          }}}
        />
      </GridItem>
      <GridItem xs={12} lg={6}>
        <CustomInput labelText={t("Unit")} id="unit"
          formControlProps={{ fullWidth: true }}
          inputProps={{ value: model.address.unit, onChange: e => {
            setModel({ ...model, ['address.unit']: e.target.value });
          }}}
        />
      </GridItem>
      <GridItem xs={12} lg={6}>
        <CustomInput labelText={t("Unit")} id="unit"
          formControlProps={{ fullWidth: true }}
          inputProps={{ value: model.address.unit, onChange: e => {
            setModel({ ...model, ['address.unit']: e.target.value });
          }}}
        />
      </GridItem>
      <GridItem xs={12} lg={6}>
        <CustomInput labelText={t("Postal Code")} id="postalCode"
          formControlProps={{ fullWidth: true }}
          inputProps={{ value: model.address.postalCode, onChange: e => {
            setModel({ ...model, ['address.postalCode']: e.target.value });
          }}}
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
  const _renderDow = () => {
    const DOWS = {
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: "Thu",
      5: 'Fri',
      6: 'Sat',
      7: "Sun"
    }
    return <React.Fragment>
      <GridItem xs={12}>
        <h5>{t("Dow")}</h5>
      </GridItem>
      <GridItem xs={12}>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          { Object.keys(DOWS).map( (_key) => {
             return <Button key={`${DOWS[_key] || "-" }`} onClick={(e) => _clickDow(e, _key) }
                variant={ model.dow.indexOf(`${_key}`) >= 0 ? "contained":"outlined"}>
               {DOWS[_key]}
              </Button>
          })}
        </ButtonGroup>
      </GridItem>
    </React.Fragment>
  }

  const _renderPhaseDelete = (e, index) => {
    const _phases = model.phases;
    _phases.splice(index, 1);
    setModel({...model, phases: _phases});
  }
  const _renderPhaseAdd = () => {
    if ( orderEnd && pickup ) {
      const _phases = model.phases;
      _phases.push({ orderEnd, pickup })
      setModel({...model, phases: _phases});
      setOrderEnd("");
      setPickup("");
    }
  }
  const _renderPhaseItem = () => {
    return <React.Fragment>
      <List>
        {
          model.phases.map( (item, index) => {
            return <ListItem key={`${index}_${item.orderEnd}`}>
              <TextField label="End Time" type="time" value={ item.orderEnd }
                InputLabelProps={{ shrink: true, }} inputProps={{ step: 300,  }}
              /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <TextField label="Pick Time" type="time" value={ item.pickup }
                InputLabelProps={{ shrink: true, }} inputProps={{ step: 300,  }}
              />
              <IconButton edge="end" aria-label="delete" onClick={(e)=>_renderPhaseDelete(e, index)} >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          })
        }
        <ListItem key="_add">
          <TextField label="End Time" type="time" value={ orderEnd }
            onChange={(e) => setOrderEnd(e.target.value) }
            InputLabelProps={{ shrink: true, }} inputProps={{ step: 300,  }}
          /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <TextField label="Pick Time" type="time" value={ pickup } 
            onChange={(e) => setPickup(e.target.value) }
            InputLabelProps={{ shrink: true, }} inputProps={{ step: 300,  }}
          />
          <IconButton edge="end" aria-label="add" onClick={_renderPhaseAdd}>
            <AddIcon />
          </IconButton>
        </ListItem>
      </List>
    </React.Fragment>
  }
  const _renderPhase = () => {
    return <React.Fragment>
      <GridItem xs={12}>
        <h5>{t("Phase")}</h5>
      </GridItem>
      <GridItem xs={12}>
        {_renderPhaseItem()}
      </GridItem>
    </React.Fragment>
  }

  const renderRight = () => {
    return <GridContainer>
      {_renderAddress()}
    </GridContainer>
  }

  const renderLeft = () => {
    return <GridContainer>
        {_renderUserInfo()}
        {_renderDow()}
        {_renderPhase()}
      </GridContainer>
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
              <GridItem xs={6}>{renderLeft()}</GridItem>
              <GridItem xs={6}>{renderRight()}</GridItem>
            </GridContainer>}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

export default MerchantsForm;