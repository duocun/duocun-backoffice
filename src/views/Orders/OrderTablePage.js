import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
// import CardFooter from "components/Card/CardFooter.js";

import Searchbar from "components/Searchbar/Searchbar";
import { getQueryParam } from "helper/index";
import FlashStorage from "services/FlashStorage";
import { Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import ApiOrderService from "services/api/ApiOrderService";
import { OrderTable } from './OrderTable';

import TimePicker from "components/TimePicker/TimePicker";
import * as moment from "moment";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);

export default function OrderTablePage({ location }) {
  const { t } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(
    getQueryParam(location, "page")
      ? parseInt(getQueryParam(location, "page"))
      : 0
  );
  const [query, setQuery] = useState(getQueryParam(location, "search") || "");
  // states related to processing
  const [alert, setAlert] = useState(
    FlashStorage.get("ORDER_ALERT") || { message: "", severity: "info" }
  );

  const [totalRows, setTotalRows] = useState(0);
  const [sort, setSort] = useState(["_id", 1]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const updateData = () => {
    ApiOrderService.getOrdersByKeyword(page, rowsPerPage, query, [sort]).then(
      ({ data }) => {
        setOrders(data.data);
        setTotalRows(data.count);
        setLoading(false);
      }
    );
  };
  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info"
    });
  };

  const [processing, setProcessing] = useState(false);

  const handleDeleteOrder = (_id) => {
    if (window.confirm('Are you sure to delete ?')) {
      if (_id) {
        removeAlert();
        setProcessing(true);
        ApiOrderService.removeOrder(_id).then(({ data }) => {
          if (data.code === 'success') {
            setAlert({
              message: t("Delete successfully"),
              severity: "success"
            });
            updateData();
          } else {
            setAlert({
              message: t("Delete failed"),
              severity: "error"
            });
          }
          setProcessing(false);
        })
          .catch(e => {
            console.error(e);
            setAlert({
              message: t("Delete transaction failed"),
              severity: "error"
            });
            setProcessing(false);
          });
      }
    }
  };

  // const [deliverDate, setDeliverDate] = useState(
  //   moment.utc().toISOString()
  // );

  useEffect(() => {
    updateData();
  }, [page, rowsPerPage, sort, query]);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={8}>
        <Card>
          <CardHeader color="primary">
            <GridContainer>
              <GridItem xs={12} lg={6}>
                <h4>{t("Orders")}</h4>
              </GridItem>
              <GridItem xs={12} lg={6} align="right">
                <Box mr={2} style={{ display: "inline-block" }}>
                  {/* <Button
                      href="orders/new"
                      variant="contained"
                      color="default"
                    >
                      <AddCircleOutlineIcon />
                      {t("New Order")}
                    </Button> */}
                </Box>

                {/* <TimePicker
                    label="Start Date"
                    date={deliverDate}
                    getDate={setDeliverDate}
                  /> */}
                <Searchbar
                  onChange={e => {
                    const { target } = e;
                    setQuery(target.value);
                  }}
                  onSearch={() => {
                    setLoading(true);
                    if (page === 0) {
                      updateData();
                    } else {
                      setPage(0);
                    }
                  }}
                />
              </GridItem>
            </GridContainer>
          </CardHeader>
          <CardBody>
          {!!alert.message && (
              <GridItem xs={12}>
                <Alert severity={alert.severity} onClose={removeAlert}>
                  {alert.message}
                </Alert>
              </GridItem>
            )}
            <OrderTable rows={orders}
              page={page}
              rowsPerPage={rowsPerPage}
              totalRows={totalRows}
              sort={sort}
              loading={loading}
              setRowsPerPage={setRowsPerPage}
              setSort={setSort}
              setPage={setPage}
              removeData={handleDeleteOrder} />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={4}>
      </GridItem>
    </GridContainer>
  );
}

OrderTablePage.propTypes = {
  location: PropTypes.object
};
