import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Save as SaveIcon, FormatListBulleted as FormatListBulletedIcon } from "@material-ui/icons";
import { TextField, ButtonGroup, Button, List, ListItem,
    Select, MenuItem, InputLabel, FormControl } from "@material-ui/core";
import { Alert } from "@material-ui/lab"

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import EditSkeleton, { EditSkeletonShort } from "../Common/EditSkeleton";
import ApiAccountService from "services/api/ApiAccountService";
import ApiCategoryService from "services/api/ApiCategoryService";

const defaultCategory = {
  name: '',
  nameEN: '',
  description: '',
  descriptionEN: ''
}

export const CategoryFormPage = ({}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // for accounts
  const [accounts, setAccounts] = useState([]);
  const [accountLoading, setAccountLoading] = useState(true);
  const [accountFilter, setAccountFilter] = useState("");

  // for model
  const [model, setModel] = useState(defaultCategory);
  const [alert, setAlert] = useState({ message: "", severity: "info" });

  ////////////////////////////////////
  // For data fetch
  const getCategoryData = () => {

  }
  const getAccountsData = () => {
    // ApiAccountService.getAccountList(0, 1000, {type: "category"}).then(
    //   ({ data }) => {
    //     setAccounts(data.data);
    //     setAccountLoading(false);
    //   }
    // );
  }
  useEffect( ()=> {
    // only call once
    getAccountsData() 
  }, []);

  return <React.Fragment>
  {/* <GridItem xs={12}>
    <h5>{t("Basic Information")}</h5>
  </GridItem>
  <GridItem xs={12} lg={12} >
    <FormControl className="dc-full-select">
      <InputLabel id="category-type-label">Type</InputLabel>
      <Select required labelId="category-type-label" id="category-type"
        value={model.type} onChange={ e => setModel({...model, type: e.target.value})} >
        <MenuItem value={'G'}>Grocery</MenuItem>
        <MenuItem value={'2'}>Restaurant</MenuItem>
      </Select>
    </FormControl>
  </GridItem>
  <GridItem xs={12} md={6} lg={6}>
    <TextField id="category-name" label={`${t("Category Name (CN)")}`}
      required className="dc-full" value={model.name}
      onChange={e => { setModel({  ...model, name: e.target.value }); }}
    />
  </GridItem>
  <GridItem xs={12} md={6} lg={6}>
    <TextField id="category-nameEN" label={`${t("Category Name (EN)")}`}
      required className="dc-full" value={model.nameEN}
      onChange={e => { setModel({  ...model, nameEN: e.target.value }); }}
    />
  </GridItem>
  <GridItem xs={12} md={6} lg={12}>
    <br />
    <TextField id="category-description" label={t("Description")}
      multiline rowsMax={4} variant="outlined" 
      className="dc-full-textarea" value={model.description}
      onChange={e => {
        setModel({  ...model, description: e.target.value });
      }}
    />
  </GridItem>
  <GridItem xs={12} lg={12}>
    <br />
    <TextField id="category-description-en" label={t("DescriptionEN")}
      multiline rowsMax={4} variant="outlined" 
      className="dc-full-textarea" value={model.descriptionEN}
      onChange={e => {
        setModel({  ...model, descriptionEN: e.target.value });
      }}
    />
  </GridItem> */}
</React.Fragment>
}

// export default CategoryFormPage;