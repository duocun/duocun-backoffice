import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
// core components
import * as moment from "moment";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { KeyboardDatePicker } from "@material-ui/pickers";

import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";

import ApiStatisticsService from "services/api/ApiStatisticsService";
// import ApiOrderService from "services/api/ApiOrderService";

import { setDeliverDate } from "redux/actions/order";
import ApiRouteService from "services/api/ApiRouteService";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
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
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  itemRow: {
    fontSize: "12px"
  },
  warningChanged: {
    color: "red"
  },
  warningDeleted: {
    color: "red",
    textDecoration: "line-through"
  }
}));


export const PickupStatus = {
  UNPICK_UP: 'U',
  PICKED_UP: 'P',
  DELETED: 'D',
  PICKED_UP_BUT_CHANGED: 'PC',
};

// deliverDate: redux state
const DriverByOrderSummaryPage = ({ match, deliverDate, setDeliverDate }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [driverSummary, setDriverSummary] = useState({});
  const [options, setDriverList] = useState([]);
  const [driver, setDriver] = useState({ _id: "", name: "" });
  const [open, setOpen] = useState(false);

  const loadData = useCallback(deliverDate => {
    ApiStatisticsService.getDriverStatisticByOrder(deliverDate).then(({ data }) => {
      const summary = data.data;

      setDriverList(
        Object.keys(summary).map(driverId => ({
          _id: driverId,
          name: data.data[driverId].driverName
        }))
      );
      // Object.keys(summary).map(driverId => {
      //   ApiRouteService.getRoutesByDriverAndDeliverDate(driverId, deliverDate).then(({ data }) => {
      //     summary[driverId].pickups.sort((a, b) => {
      //       const aIndex = data.data.routes[0].route.findIndex((r) => r.orderId === a.items[0].orderId);
      //       const bIndex = data.data.routes[0].route.findIndex((r) => r.orderId === b.items[0].orderId);
      //       return bIndex - aIndex;
      //     });
      //   });
      //   return 0;
      // });

      setDriverSummary(() => summary);

      if (match.params && match.params.id) {
        const driverId = Object.keys(summary).find(
          id => id === match.params.id
        );

        if (driverId) {
          const defaultDriver = summary[driverId];
          if (defaultDriver) {
            setDriver({
              _id: defaultDriver.driverId,
              name: defaultDriver.driverName
            });
          }
        } else {
          const defaultDriver = Object.values(summary)[0];
          if (defaultDriver) {
            setDriver({
              _id: defaultDriver.driverId,
              name: defaultDriver.driverName
            });
          }
        }
      } else {
        const defaultDriver = Object.values(summary)[0];
        if (defaultDriver) {
          setDriver({
            _id: defaultDriver.driverId,
            name: defaultDriver.driverName
          });
        }
      }
    });
  }, [match.params]);

  const handleDriverChange = driverId => {
    const d = options.find(d => d._id === driverId);
    setDriver({ _id: driverId, name: d ? d._id : "" });
  };

  const handleDateChange = m => {
    const date = m.format("YYYY-MM-DD");
    setDeliverDate(date);
    loadData(date);
  };

  const exportText = () => {
    const element = document.createElement('a');
    let text = '';
    const aList = {};
    const bList = {};
    Object.keys(driverSummary).map((driverId) => {
      aList[driverId] = [];
      bList[driverId] = [];
      driverSummary[driverId].pickups.forEach((p) => {
        p.items.forEach((i) => {
          i.products.forEach((pd) => {
            if (i.merchantId === '5fef5a304814e984eed00e36' || i.merchantId === '5fef54e57ce06c83c152fdb3') {
              aList[driverId].push(pd);
            }
            if (pd.productIsRed) {
              bList[driverId].push(pd);
            }
          });
        });
      });
    });
    text += '\n';
    Object.keys(driverSummary).map((driverId) => {
      text += driverSummary[driverId].driverName + '\n';
      text += '\n';
      aList[driverId].forEach((a) => {
        text += '\tA：' + a.productName + '\t\t x' + a.quantity.toString() + '\n';
      });
      bList[driverId].forEach((b) => {
        text += '\tB：' + b.productName + '\t\t x' + b.quantity.toString() + '\n';
      });
      text += '\n';
      driverSummary[driverId].pickups.forEach((p) => {
        text += '\t' + p.clientName + ' : : : : ' + p.codes.join(', ') + '\n';
        p.items.forEach((i) => {
          i.products.forEach((pd) => {
            text += '\t\t';
            if (pd.productIsRed) {
              text += '- ';
            }
            text += pd.productName;
            if (pd.quantity > 1) {
              text += '\t\t x' + pd.quantity.toString() + '\n';
            } else {
              text += '\n';
            }
          });
        });
      });
      text += '\n';
      return 0;
    });
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `取货单-${deliverDate}`;
    document.body.appendChild(element);
    element.click();
  }

  const sortSummary = () => {
    setOpen(true);
    const summary = JSON.parse(JSON.stringify(driverSummary));
    Object.keys(summary).map(driverId => {
      ApiRouteService.getRoutesByDriverAndDeliverDate(driverId, deliverDate).then(({ data }) => {
        summary[driverId].pickups.sort((a, b) => {
          const aIndex = data.data.routes[0].route.findIndex((r) => r.orderId === a.items[0].orderId);
          const bIndex = data.data.routes[0].route.findIndex((r) => r.orderId === b.items[0].orderId);
          return bIndex - aIndex;
        });
      });
      return 0;
    });
    setTimeout(() => {
      setDriverSummary(() => summary);
      setOpen(false);
    }, 10000)
  }

  const getStatusText = status => {
    switch (status) {
      case PickupStatus.PICKED_UP:
        return "已提";
      case PickupStatus.PICKED_UP_BUT_CHANGED:
        return "已提但有新变动";
      case PickupStatus.DELETED:
        return "因订单或分配变更而取消";
      default:
        return "未提";
    }
  }

  // const getStatusTextClassName = status => {
  //   switch (status) {
  //     case PickupStatus.PICKED_UP_BUT_CHANGED:
  //       return "warningChanged";
  //     case PickupStatus.DELETED:
  //       return "warningDeleted";
  //     default:
  //       return "";
  //   }
  // }

  // useEffect(() => {
  //   const now = moment().toISOString();
  //   ApiOrderService.getDuplicates(now).then(({ data }) => {
  //     setDupClientList(data);
  //   });
  // }, [deliverDate, setDeliverDate]);

  useEffect(() => {
    if (!deliverDate) {
      const date = moment().format("YYYY-MM-DD");
      setDeliverDate(date);
      loadData(deliverDate);
    } else {
      loadData(deliverDate);
    }
  }, [deliverDate, loadData, setDeliverDate]);


  return (
    <GridContainer>
      <Backdrop className={classes.backdrop} open={open} style={{ zIndex: 10000 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <GridItem xs={12} sm={4} md={4}>
        {
          <FormControl className={classes.formControl}>
            <InputLabel id="driver-select-label">{t("Driver")}</InputLabel>
            <Select
              required
              labelId="driver-select-label"
              id="driver-select"
              value={driver ? driver._id : ""}
              onChange={e => handleDriverChange(e.target.value)}
            >
              {options &&
                options.length > 0 &&
                options.map(d => (
                  <MenuItem key={d._id} value={d._id}>
                    {t(d.name)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        }
      </GridItem>
      <GridItem xs={12} sm={4} md={4}>
        <KeyboardDatePicker
          variant="inline"
          label={`${t("Deliver Date")}`}
          format="YYYY-MM-DD"
          value={moment.utc(deliverDate)}
          InputLabelProps={{
            shrink: deliverDate ? true : false
          }}
          onChange={handleDateChange}
        />
      </GridItem>
      <GridItem xs={12} sm={4} md={4} style={{ alignSelf: 'center' }}>
        <FormControl className={classes.formControl}>
          <Button variant="contained" color="secondary" onClick={sortSummary} style={{ marginRight: 20 }}>排序</Button>
        </FormControl>
        <FormControl className={classes.formControl}>
          <Button variant="contained" color="primary" onClick={exportText}>导出</Button>
        </FormControl>
      </GridItem>
      {driverSummary &&
        Object.keys(driverSummary).length > 0 &&
        driver &&
        driverSummary[driver._id] &&
        driverSummary[driver._id].pickups.map(
          (m, k) => (
            // <GridItem xs={12} sm={12} md={12}>
            <Card key={m.clientName + k.toString()}>
              <CardHeader color="primary">
                <div key={m.clientName + k.toString()}>
                  <div>{m.clientName}: {m.codes.join(', ')} （{getStatusText(m.status)}）</div>
                </div>
              </CardHeader>
              <CardBody>
                <Table>
                  <TableBody>
                    {m.items.map((prop, key) => (
                      <React.Fragment key={key}>
                        {
                          prop.products.map((p, pk) => (
                            <TableRow key={pk}>
                              <TableCell className={classes.itemRow}>
                                {p.productName}
                              </TableCell>
                              <TableCell className={classes.itemRow}>
                                x{p.quantity}
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          )
          // </GridItem>
        )}
    </GridContainer>
  );
};

DriverByOrderSummaryPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.object
};

const mapStateToProps = state => ({
  deliverDate: state.deliverDate
});
export default connect(
  mapStateToProps,
  {
    setDeliverDate
  }
)(DriverByOrderSummaryPage);
