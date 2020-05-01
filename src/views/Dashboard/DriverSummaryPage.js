import React, {useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components

import * as moment from 'moment';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import {connect} from 'react-redux';
import avatar from "assets/img/faces/marc.jpg";
import { loadDriverSummaryAsync } from 'redux/actions/statistics';
//drop down menu
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);


const DriverSummaryPage = ({driverSummaryArray,loadDriverSummary}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedDriver, setSelectedDriver] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, driver,index) => {
    setSelectedIndex(index)
    setSelectedDriver(driver);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // const startDate = moment().format('YYYY-MM-DD');
    const startDate = '2020-04-03';  // hard coded date because 05-01 has no data
    loadDriverSummary(startDate);
  }, []);
  return (
    
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
            <div>
              <List component="nav" aria-label="Device settings">
                <ListItem
                    button
                    onClick={handleClickListItem}
                 >
                <ListItemText primary={
                <div>
                    <span>请点击此处选择司机</span>
                    <span><ArrowDropDownIcon/></span>
                </div>
                    } />
         
                </ListItem>
                <div>司机：{selectedDriver?selectedDriver.driverName:"N/A"}</div>
              </List>
              <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
             {driverSummaryArray.map((driver, index) => (
                <MenuItem
                  key={driver.driverName}
                  selected={index === selectedIndex}
                  onClick={(event) => handleMenuItemClick(event, driver,index)}
                >
                 {driver.driverName}
                </MenuItem>
            ))}
            </Menu>
             </div>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={5}>
                <div>
                    <div>司机名称:</div>
                    <div>{selectedDriver?selectedDriver.driverName:"N/A"}</div>
                </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={5}>
                <div>
                    <div>分配订单数:</div>
                    <div>{selectedDriver?selectedDriver.nOrders:"N/A"}</div>
                </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={5}>
                <div>
                    <div>分配产品数:</div>
                    <div>{selectedDriver?selectedDriver.nProducts:"N/A"}</div>
                </div>
                </GridItem>
              </GridContainer>


 

            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

const mapStateToProps = (state) => ({ driverSummaryArray: state.driverSummaryArray });
const mapDispatchToProps = (dispatch) => ({
  loadDriverSummary: (startDate) => {
    dispatch(loadDriverSummaryAsync(startDate));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DriverSummaryPage);