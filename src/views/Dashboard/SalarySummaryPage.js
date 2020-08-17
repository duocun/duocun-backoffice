import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";

import ApiStatisticsService from "services/api/ApiStatisticsService";

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
const SalarySummaryPage = () => {
  const classes = useStyles();
  const [salarySummary, setSalarySummary] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    ApiStatisticsService.getSalaryStatistic().then(({ data }) => {
      const summary = data.data;
      setSalarySummary(summary);
    });
  };

  return (
    <GridContainer>
      { salarySummary &&
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
