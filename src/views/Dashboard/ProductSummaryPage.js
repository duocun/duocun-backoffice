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

import TableSortLabel from "@material-ui/core/TableSortLabel";
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// // import FormHelperText from '@material-ui/core/FormHelperText';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
import { KeyboardDatePicker } from "@material-ui/pickers";

import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";

import ApiStatisticsService from "services/api/ApiStatisticsService";
// import ApiOrderService from "services/api/ApiOrderService";

import { setDeliverDate } from "redux/actions/order";
import { TableHead } from "../../../node_modules/@material-ui/core";

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

const ProductSummaryPage = ({
  match,
  history,
  deliverDate,
  setDeliverDate
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [productList, setProductList] = useState([]);
  const [sort, setSort] = useState(["_id", -1]);

  useEffect(() => {
    if (!deliverDate) {
      const date = moment().format("YYYY-MM-DD");
      setDeliverDate(date);
      loadData(deliverDate);
    } else {
      loadData(deliverDate);
    }
  }, []);

  const loadData = deliverDate => {
    ApiStatisticsService.getProductStatistic(deliverDate).then(({ data }) => {
      setProductList(data.data);
    });
  };

  const handleDateChange = m => {
    const date = m.format("YYYY-MM-DD");
    setDeliverDate(date);
    loadData(date);
  };

  const renderSort = fieldName => {
    return (
      <TableSortLabel
        active={sort && sort[0] === fieldName}
        direction={sort && sort[1] === -1 ? "desc" : "asc"}
        onClick={() => {
          toggleSort(fieldName);
        }}
      ></TableSortLabel>
    );
  };

  const toggleSort = fieldName => {
    // sort only one field
    if (sort && sort[0] === fieldName) {
      setSort([fieldName, sort[1] === 1 ? -1 : 1]);
    } else {
      setSort([fieldName, 1]);
    }
  };

  return (
    <GridContainer>
      <Card>
        <CardHeader color="primary">
          <GridItem xs={12} sm={6} md={6}>
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
        </CardHeader>
        <CardBody>
          <Table>
            <TableHead>
              <TableCell
                onClick={() => {
                  toggleSort("productName");
                }}
                style={{ cursor: "pointer" }}
              >
                {t("Product")}
                {renderSort("productName")}
              </TableCell>
              <TableCell
                onClick={() => {
                  toggleSort("merchantName");
                }}
                style={{ cursor: "pointer" }}
              >
                {t("Merchant")}
                {renderSort("merchantName")}
              </TableCell>
              <TableCell
                onClick={() => {
                  toggleSort("quantity");
                }}
                style={{ cursor: "pointer" }}
              >
                {t("Quantity")}
                {renderSort("quantity")}
              </TableCell>
              <TableCell
                onClick={() => {
                  toggleSort("price");
                }}
                style={{ cursor: "pointer" }}
              >
                {t("Price")}
                {renderSort("price")}
              </TableCell>
              <TableCell
                onClick={() => {
                  toggleSort("cost");
                }}
                style={{ cursor: "pointer" }}
              >
                {t("Cost")}
                {renderSort("cost")}
              </TableCell>
              <TableCell
                onClick={() => {
                  toggleSort("totalCost");
                }}
                style={{ cursor: "pointer" }}
              >
                {t("Total Cost")}
                {renderSort("totalCost")}
              </TableCell>
            </TableHead>
            <TableBody>
              {productList.map(it => (
                <TableRow key={it.productId}>
                  <TableCell className={classes.itemRow}>
                    {it.productName}
                  </TableCell>
                  <TableCell className={classes.itemRow}>
                    {it.merchantName}
                  </TableCell>
                  <TableCell className={classes.itemRow}>
                    x{it.quantity}
                  </TableCell>
                  <TableCell className={classes.itemRow}>{it.price}</TableCell>
                  <TableCell className={classes.itemRow}>{it.cost}</TableCell>
                  <TableCell className={classes.itemRow}>
                    {it.totalCost}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </GridContainer>
  );
};

ProductSummaryPage.propTypes = {
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
)(ProductSummaryPage);
