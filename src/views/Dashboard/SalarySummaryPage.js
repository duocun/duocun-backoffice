import React, { useState, useEffect } from "react";
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
import { KeyboardDatePicker } from "@material-ui/pickers";

import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";

import ApiStatisticsService from "services/api/ApiStatisticsService";
import ApiOrderService from "services/api/ApiOrderService";

import { setDeliverDate } from "redux/actions/order";

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
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  itemRow: {
    fontSize: "12px"
  }
}));

// deliverDate: redux state
const SalarySummaryPage = ({ match, deliverDate, setDeliverDate }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [salarySummary, setSalarySummary] = useState({});
  const [driver, setDriver] = useState({ _id: "", name: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    ApiStatisticsService.getSalaryStatistic().then(({ data }) => {
      const summary = data.data;
      setSalarySummary(summary);
    });
  };

  const toDate = d => {
    return d.split("T")[0];
  };

  return (
    <GridContainer>
      {salarySummary &&
        Object.keys(salarySummary).length > 0 &&
        Object.keys(salarySummary).map(driverId => (
          <Card key={driverId}>
            <CardHeader>{salarySummary[driverId].staffName}</CardHeader>
            <CardBody>
              <Table>
                <TableBody>
                  {Object.keys(salarySummary[driverId].monthMap).map(m => (
                    <TableRow key={m}>
                      <TableCell className={classes.itemRow}>{m}</TableCell>
                      <TableCell className={classes.itemRow}>
                        {salarySummary[driverId].monthMap[m].amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        ))
      // Object.keys(salarySummary).map(m =>
      //   <Card>
      //     <CardHeader color="primary">
      //       <div key={m}>
      //         <div>{m}</div>
      //         <div>{`$${salarySummary[m].amount}`}</div>
      //       </div>
      //     </CardHeader>
      //     <CardBody>
      //       <Table >
      //         <TableBody>
      //           {Object.keys(salarySummary[m].driverMap).map((staffId) =>
      //             <TableRow key={staffId} >
      //               <TableCell className={classes.itemRow}>
      //                 {salarySummary[m].driverMap[staffId].staffName}
      //               </TableCell>
      //               <TableCell className={classes.itemRow}>
      //                 {salarySummary[m].driverMap[staffId].amount}
      //               </TableCell>
      //             </TableRow>
      //           )}
      //         </TableBody>
      //       </Table>

      //       <Table >
      //         <TableBody>
      //           {salarySummary[m].transactions.map((t) =>
      //             <TableRow key={t.staffId} >
      //               <TableCell className={classes.itemRow}>
      //                 {t.staffName}
      //               </TableCell>
      //               <TableCell className={classes.itemRow}>
      //                 {t.amount}
      //               </TableCell>
      //               <TableCell className={classes.itemRow}>
      //                 {toDate(t.created)}
      //               </TableCell>
      //             </TableRow>
      //           )}
      //         </TableBody>
      //       </Table>
      //     </CardBody>
      //   </Card>
      // )
      }
    </GridContainer>
  );
};

SalarySummaryPage.propTypes = {
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
)(SalarySummaryPage);
