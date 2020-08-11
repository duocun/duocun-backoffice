import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

import { useTranslation } from "react-i18next";
// core components
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import * as moment from "moment";
import { DatePicker } from "components/DatePicker/DatePicker.js";
import Chart from "react-apexcharts";

import { setOrderDate, setDeliverDate } from "redux/actions/order";

import ApiStatisticsService from "services/api/ApiStatisticsService";

const useStyles = makeStyles({
  tabContent: {
    width: "100%"
  },
  filterCol: {
    paddingRight: "0px"
  }
});

const defaultChart = {
  series: [
    {
      name: "Orders",
      data: []
    },
    {
      name: "Products",
      data: []
    }
  ],
  options: {
    chart: {
      type: "bar",
      height: 400
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded"
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"]
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      title: {
        text: "(items)"
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " items";
        }
      }
    }
  }
};

const getChart = (series, categories, height) => {
  return {
    width: "100%",
    series,
    options: {
      chart: {
        type: "bar",
        height
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%", // '55%',
          endingShape: "flat" // 'rounded'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 10,
        colors: ["transparent"]
      },
      xaxis: {
        categories
      },
      yaxis: {
        title: {
          text: "(items)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val + " items";
          }
        }
      }
    }
  };
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children
      // && (
      // <Box p={3}>
      //   <Typography>
      //   {children}
      //   </Typography>
      // </Box>
      // )
      }
    </div>
  );
}
// orderDate: redux state
// deliveredDate: redux state
const OrderSummaryPage = ({
  orderDate,
  deliverDate,
  setOrderDate,
  setDeliverDate
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [chart, setChart] = useState(defaultChart);
  const [tabIndex, setTabIndex] = useState(0);
  const [dateType, setDateType] = useState("Delivery Date");

  const handleDateType = (event, dateType) => {
    setDateType(dateType);
    if (dateType === "Order Date") {
      updateData(orderDate, "Order Date");
    } else {
      updateData(deliverDate, "Delivery Date");
    }
  };

  const updateData = (date, type) => {
    if (!date) {
      return;
    }
    const deliverDate = type === "Order Date" ? "" : date;
    const orderDate = type === "Order Date" ? date : "";
    ApiStatisticsService.getSales(deliverDate, orderDate).then(({ data }) => {
      const salesMap = data.data;
      const dates = Object.keys(salesMap).sort();
      const nOrdersList = dates.map(d => salesMap[d].nOrders);
      const nProductsList = dates.map(d => salesMap[d].nProducts);

      const series = [
        {
          name: "Orders",
          data: nOrdersList
        },
        {
          name: "Products",
          data: nProductsList
        }
      ];

      const c = getChart(series, dates, 400);
      setChart(c);
    });
  };

  useEffect(() => {
    updateData(deliverDate, "Delivery Date");
  }, []);

  const handelDateChange = m => {
    const dt = m.toISOString();
    const date = dt.split("T")[0];
    if (dateType === "Order Date") {
      setOrderDate(date);
      updateData(date, "Order Date");
    } else {
      setDeliverDate(date);
      updateData(date, "Delivery Date");
    }
  };

  const handelDateClick = e => {};

  const handelDateClear = e => {
    e.stopPropagation();
    if (dateType === "Order Date") {
      setOrderDate(null, "Order Date");
    } else {
      setDeliverDate(null, "Delivery Date");
    }
  };

  const handleTabChange = (event, t) => {
    setTabIndex(t);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }

  return (
    <GridContainer>
      <GridItem xs={6} lg={4} className={classes.filterCol}>
        <DatePicker
          label={dateType}
          date={dateType === "Order Date" ? orderDate : deliverDate}
          onChange={handelDateChange}
          onClick={handelDateClick}
          onClear={handelDateClear}
        />
      </GridItem>
      <GridItem xs={6} lg={4}>
        <ToggleButtonGroup
          value={dateType}
          exclusive
          onChange={handleDateType}
          aria-label="date type"
        >
          <ToggleButton value="Delivery Date" aria-label="Delivery Date">
            {t("Deliver Date")}
          </ToggleButton>
          <ToggleButton value="Order Date" aria-label="Order Date">
            {t("Order Date")}
          </ToggleButton>
        </ToggleButtonGroup>
      </GridItem>
      <AppBar position="static">
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="simple tabs example"
        >
          <Tab label="汇总图" {...a11yProps(0)} />
          {/* <Tab label="明细" {...a11yProps(1)} /> */}
        </Tabs>
      </AppBar>
      <TabPanel value={tabIndex} index={0} className={classes.tabContent}>
        <GridItem xs={12} lg={12}>
          <Chart
            options={chart.options}
            series={chart.series}
            type="bar"
            height={350}
          />
        </GridItem>
      </TabPanel>
      {/* <TabPanel value={tabIndex} index={1} className={classes.tabContent}>
          Item Two
        </TabPanel> */}
    </GridContainer>
  );
};

const mapStateToProps = state => ({
  deliverDate: state.deliverDate,
  orderDate: state.orderDate
});
// const mapDispatchToProps = (dispatch) => ({
//   loadSales: (startDate) => {
//     dispatch(loadSalesAsync(startDate));
//   },
// });
export default connect(
  mapStateToProps,
  {
    setDeliverDate,
    setOrderDate
  }
)(OrderSummaryPage);
