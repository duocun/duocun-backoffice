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

import ApiOrderService from "services/api/ApiOrderService";
import { OrderTable } from './OrderTable';


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
    ApiOrderService.getOrderList(page, rowsPerPage, query, [sort]).then(
      ({ data }) => {
        setOrders(data.data);
        setTotalRows(data.count);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    updateData();
  }, [page, rowsPerPage, sort]);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
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
            <OrderTable
              rows={orders}
              page={page}
              rowsPerPage={rowsPerPage}
              totalRows={totalRows}
              sort={sort}
              loading={loading}
              setRowsPerPage={setRowsPerPage}
              setSort={setSort}
              setPage={setPage}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

OrderTablePage.propTypes = {
  location: PropTypes.object
};
