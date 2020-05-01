import React, {useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import * as moment from 'moment';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import {connect} from 'react-redux';
import { loadStatisticsSummaryAsync } from 'redux/actions/statistics';
import { loadMerchantSummaryAsync } from 'redux/actions/statistics';
//table
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


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


const OrderSummaryPage = ({summary,merchantSummaryArray, loadMerchantAndOrderSummary}) => {
  const classes = useStyles();
  useEffect(() => {
    const startDate = moment().format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');
    loadMerchantAndOrderSummary(startDate,endDate);

  }, []);
  return (
    
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>订单统计</h4>
            <p className={classes.cardCategoryWhite}>
              所选日期区间总数据
            </p>
          </CardHeader>
          <CardBody>
               <div>
                    <div>总订单数:</div>
                    <div>{summary?summary.nOrders:"N/A"}</div>
                </div>
                <div>
                    <div>总产品数:</div>
                    <div>{summary?summary.nProducts:"N/A"}</div>
                </div>
                <div>
                    <div>销售额:</div>
                    <div>{summary?summary.totalPrice:"N/A"}</div>
                </div>
                <div>
                    <div>总成本:</div>
                    <div>{summary?summary.totalCost:"N/A"}</div>
                </div>
          </CardBody>
        </Card>
      </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>商家列表</h4>
            <p className={classes.cardCategoryWhite}>
              所选日期区间商家
            </p>
          </CardHeader>
          <CardBody>
          <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>商家名称 </TableCell>
            <TableCell align="right">总订单数</TableCell>
            <TableCell align="right">销售额</TableCell>
            <TableCell align="right">总成本</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {merchantSummaryArray.map((merchant) => (
            <TableRow key={merchant.merchantId}>
              <TableCell component="th" scope="row">
                {merchant.merchantName}
              </TableCell>
              <TableCell align="right">{merchant.nOrders}</TableCell>
              <TableCell align="right">{merchant.totalPrice}</TableCell>
              <TableCell align="right">{merchant.totalCost}</TableCell>
  
            </TableRow>
          ))}
        </TableBody>
      </Table>
          </CardBody>
        </Card>
      </GridItem>
      </GridContainer>
    
    </div>
  );
}

const mapStateToProps = (state) => ({ summary: state.statisticsSummary, merchantSummaryArray:state.merchantSummaryArray, });
const mapDispatchToProps = (dispatch) => ({
  loadMerchantAndOrderSummary: (startDate, endDate) => {
    dispatch(loadStatisticsSummaryAsync(startDate, endDate));
    dispatch(loadMerchantSummaryAsync(startDate, endDate));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderSummaryPage);