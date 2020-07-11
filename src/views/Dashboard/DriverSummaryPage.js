import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
// core components
import * as moment from 'moment';

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";


import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { KeyboardDatePicker } from "@material-ui/pickers";

import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";


import ApiStatisticsService from 'services/api/ApiStatisticsService';
import ApiOrderService from "services/api/ApiOrderService";

import { setDeliverDate } from 'redux/actions/order';

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
  itemRow: {
    fontSize: "12px"
  }
}));


const DriverSummaryPage = ({ match, deliverDate, setDeliverDate }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [driverSummary, setDriverSummary] = useState({});
  const [options, setDriverList] = useState([]);
  const [driver, setDriver] = useState({ _id: '', name: '' });
  const [dupClients, setDupClientList] = useState([]);

  useEffect(() => {
    const now = moment().toISOString();
    ApiOrderService.getDuplicates(now).then(
      ({ data }) => {
        setDupClientList(data);
      });
  }, []);

  useEffect(() => {
    if (!deliverDate) {
      const date = moment().format('YYYY-MM-DD');
      setDeliverDate(date);
      loadData(deliverDate);
    } else {
      loadData(deliverDate);
    }
  }, []);

  const loadData = (deliverDate) => {
    ApiStatisticsService.getDriverStatistic(deliverDate).then(({ data }) => {
      const summary = data.data;
      setDriverSummary(summary);

      setDriverList(Object.keys(summary).map(driverId => ({
        _id: driverId,
        name: data.data[driverId].driverName
      })));

      if (match.params && match.params.id) {
        const driverId = Object.keys(summary).find(id => id === match.params.id);
        if (driverId) {
          const defaultDriver = summary[driverId];
          if (defaultDriver) {
            setDriver({ _id: defaultDriver.driverId, name: defaultDriver.driverName });
          }
        } else {
          const defaultDriver = Object.values(summary)[0];
          if (defaultDriver) {
            setDriver({ _id: defaultDriver.driverId, name: defaultDriver.driverName });
          }
        }
      } else {
        const defaultDriver = Object.values(summary)[0];
        if (defaultDriver) {
          setDriver({ _id: defaultDriver.driverId, name: defaultDriver.driverName });
        }
      }
    });
  }

  const handleDriverChange = (driverId) => {
    const d = options.find(d => d._id === driverId);
    setDriver({ _id: driverId, name: d ? d._id : '' });
  }

  const handleDateChange = (m) => {
    const date = m.format('YYYY-MM-DD');
    setDeliverDate(date);
    loadData(date);
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={6} md={6}>
        {
          <FormControl className={classes.formControl}>
            <InputLabel id="driver-select-label">{t('Driver')}</InputLabel>
            <Select required labelId="driver-select-label" id="driver-select"
              value={driver ? driver._id : ''} onChange={e => handleDriverChange(e.target.value)} >
              {
                options && options.length > 0 &&
                options.map(d => <MenuItem key={d._id} value={d._id}>{t(d.name)}</MenuItem>)
              }
            </Select>
          </FormControl>
        }
      </GridItem>
      <GridItem xs={12} sm={6} md={6}>
        <KeyboardDatePicker
          variant="inline"
          label={`${t("Deliver Date")}`}
          format="YYYY-MM-DD"
          value={moment.utc(deliverDate)}
          InputLabelProps={{
            shrink: deliverDate,
          }}
          onChange={handleDateChange}
        />
      </GridItem>
      {
        driverSummary && Object.keys(driverSummary).length > 0 && driver && driverSummary[driver._id] &&
        driverSummary[driver._id].merchants.map(m =>
          // <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <div key={m.merchantName}>
                <div>{m.merchantName}</div>
              </div>
            </CardHeader>
            <CardBody>
              <Table >
                <TableBody>
                  {m.items.map((prop, key) =>
                    <TableRow key={key} >
                      <TableCell className={classes.itemRow}>
                        {prop.productName}
                      </TableCell>
                      <TableCell className={classes.itemRow}>
                        x{prop.quantity}
                      </TableCell>
                      <TableCell className={classes.itemRow}>
                        {prop.status === 'P' ? '已提' : '未提'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
          // </GridItem>
        )
      }
      {
        dupClients && dupClients.length > 0 &&
        <Card>
          <CardHeader color="primary">
            有重复订单的客户
          </CardHeader>
          <Table>
            <TableBody>
              {dupClients.map((prop) =>
                <TableRow key={prop.clientPhone} >
                  <TableCell>
                    {prop.clientName}
                  </TableCell>
                  <TableCell>
                    {prop.clientPhone}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      }
    </GridContainer>
  );
}


DriverSummaryPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.object
};

const mapStateToProps = (state) => ({
  deliverDate: state.deliverDate,
});
export default connect(
  mapStateToProps,
  {
    setDeliverDate
  }
)(DriverSummaryPage);
