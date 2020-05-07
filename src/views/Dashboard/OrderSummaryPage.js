import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

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
import { connect } from 'react-redux';
import avatar from "assets/img/faces/marc.jpg";
import { loadOrderSummaryAsync } from 'redux/actions/statistics';


//drop down menu
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';


import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";


import ApiStatisticsService from 'services/api/ApiStatisticsService';

const useStyles = makeStyles((theme) => ({
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
  },
  table: {
    minWidth: 750
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


const OrderSummaryPage = ({}) => {
  const classes = useStyles();
  const [driverSummary, setOrderSummary] = useState({});
  const [drivers, setDriverList] = useState([]);
  const [driver, setDriver] = useState({_id: '', name: ''});

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedDriver, setSelectedDriver] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, driver, index) => {
    setSelectedIndex(index)
    setSelectedDriver(driver);
    setAnchorEl(null);
  };

  const handleDriverChange = (driverId) => {
    const d = drivers.find(d => d._id === driverId);
    setDriver({_id: driverId, name: d? d._id: ''});
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const startDate = moment().format('YYYY-MM-DD');
    // const startDate = '2020-04-03';  // hard coded date because 05-01 has no data
    // loadOrderSummary(startDate);
    ApiStatisticsService.saveDriverStatistic(startDate).then(
      ({data}) => {
        const summary = data.data;
        setOrderSummary(summary);
        
        setDriverList(Object.keys(summary).map(driverId => ({
            _id: driverId, 
            name: data.data[driverId].driverName}
          ))
        );

        const defaultDriver = Object.values(summary)[0];
        if(defaultDriver){
          setDriver({_id: defaultDriver.driverId, name: defaultDriver.driverName});
        }
        // dispatch(setOrderSummary(data.data));
      });
  }, []);
  return (

    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
            {
            <FormControl className={classes.formControl}>
              <InputLabel id="driver-select-label">Driver</InputLabel>
              <Select required labelId="driver-select-label" id="driver-select"
                value={driver ? driver._id : ''} onChange={e => handleDriverChange(e.target.value)} >
                {
                  drivers && drivers.length > 0 &&
                  drivers.map(d => <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>)
                }
              </Select>
            </FormControl>
            }
              {/* <div>
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
             {driverSummary.map((v, index) => (
                <MenuItem
                  key={v.merchantName}
                  selected={index === selectedIndex}
                  onClick={(event) => handleMenuItemClick(event, driver,index)}
                >
                 {driver.driverName}
                </MenuItem>
            ))}
            </Menu>
             </div> */}
            </CardHeader>
            <CardBody>
              <GridContainer>
                {
                  driverSummary && Object.keys(driverSummary).length > 0 && driver && driverSummary[driver._id] &&
                  driverSummary[driver._id].merchants.map(m =>
                    <div key={m.merchantName}>
                    <div>{m.merchantName}</div>
                    <Table>
                      <TableBody>
                          {m.items.map((prop, key) => 
                              <TableRow key={key} >
                                <TableCell>
                                  {prop.productName}
                                </TableCell>
                                <TableCell>
                                  x{prop.quantity}
                                </TableCell>
                              </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )
                }
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

// const mapStateToProps = (state) => ({ driverSummary: state.driverSummary });
// // const mapDispatchToProps = (dispatch) => ({
// //   loadOrderSummary: (startDate) => {
// //     dispatch(loadOrderSummaryAsync(startDate));
// //   },
// // });
// export default connect(
//   mapStateToProps,
//   // mapDispatchToProps
// )(OrderSummaryPage);

export default OrderSummaryPage;