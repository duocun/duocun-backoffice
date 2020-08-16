import React, { useState, useEffect } from "react";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import * as moment from "moment";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Chart from "react-apexcharts";

import ApiStatisticsService from "services/api/ApiStatisticsService";


const defaultChart = {
  series: [
    {
      name: "Orders",
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
      categories: [],
      title: {
        style: {
          fontSize: "10px"
        }
      }
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

// series -- y list
// categories -- x list
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
        categories,
        title: {
          style: {
            fontSize: "10px"
          }
        }
      },
      yaxis: {
        title: {
          text: "送货单数"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val;
          }
        }
      }
    }
  };
};

const ProductAnalytics = () => {
  const [fromDate, setFromDate] = useState(moment().toISOString());
  const [chart, setChart] = useState(defaultChart);

  const updateData = fromDate => {
    ApiStatisticsService.getProductAnalytics(
      fromDate,
      moment().toISOString()
    ).then(({ data }) => {
      const productMap = data.data;
      const productIds = Object.keys(productMap);
      const values = [];
      productIds.forEach(pId => {
        if (productMap[pId].price < 30) {
          values.push(productMap[pId]);
        }
      });

      const vs = values.sort((a, b) => {
        if (a.price < b.price) {
          return -1;
        } else {
          return 1;
        }
      });

      const series = [
        {
          name: "products",
          data: vs.map(v => v.count)
        }
      ];
      const xs = vs.map(v => v.name);
      const c = getChart(series, xs, 400);
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
  }, []);

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
// //   loadOrders: (startDate) => {
// //     dispatch(loadOrdersAsync(startDate));
// //   },
// // });
// export default connect(
//   mapStateToProps,
//   // mapDispatchToProps
// )(OrdersPage);

export default ProductAnalytics;
