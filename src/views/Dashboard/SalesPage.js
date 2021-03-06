import React, { useState, useEffect } from "react";
// @material-ui/core components

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import * as moment from "moment";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Chart from "react-apexcharts";
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// // import FormHelperText from '@material-ui/core/FormHelperText';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';

// import Table from "@material-ui/core/Table";
// import TableRow from "@material-ui/core/TableRow";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";

import ApiStatisticsService from "services/api/ApiStatisticsService";


const defaultChart = {
  series: [
    {
      name: "Sales",
      data: []
    },
    {
      name: "Cost",
      data: []
    }
  ],
  options: {
    chart: {
      type: "bar",
      height: 500
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
          text: "$(thousand)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return "$" + val + " thousands";
          }
        }
      }
    }
  };
};

const SalesPage = () => {
  const [fromDate, setFromDate] = useState(moment().toISOString());
  const [chart, setChart] = useState(defaultChart);

  const updateData = fromDate => {
    ApiStatisticsService.getSales(fromDate).then(({ data }) => {
      const salesMap = data.data;
      const dates = Object.keys(salesMap).sort();
      const totalList = dates.map(
        d => Math.round(salesMap[d].total / 10) / 100
      );
      const costList = dates.map(d => Math.round(salesMap[d].cost / 10) / 100);

      const series = [
        {
          name: "Sales",
          data: totalList
        },
        {
          name: "Cost",
          data: costList
        }
      ];

      const c = getChart(series, dates, 400);
      setChart(c);
    });
  };

  const handleStartDateChange = m => {
    const dt = m.toISOString();
    setFromDate(dt);
    updateData(dt);
  };
  useEffect(() => {
    updateData(fromDate);
  }, [fromDate]);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <GridItem xs={12} lg={12}>
                <KeyboardDatePicker
                  variant="inline"
                  label="Date"
                  format="YYYY-MM-DD"
                  value={moment.utc(fromDate)}
                  onChange={handleStartDateChange}
                />
              </GridItem>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} lg={12}>
                  <Chart
                    options={chart.options}
                    series={chart.series}
                    type="bar"
                    height={350}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

// const mapStateToProps = (state) => ({ driverSummary: state.driverSummary });
// // const mapDispatchToProps = (dispatch) => ({
// //   loadSales: (startDate) => {
// //     dispatch(loadSalesAsync(startDate));
// //   },
// // });
// export default connect(
//   mapStateToProps,
//   // mapDispatchToProps
// )(SalesPage);

export default SalesPage;
