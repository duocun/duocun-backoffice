import React, {useState, useEffect}from "react";
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
import CardFooter from "components/Card/CardFooter.js";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "components/Table/TablePagniation.js";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableBodySkeleton from "components/Table/TableBodySkeleton";

import Searchbar from "components/Searchbar/Searchbar";
import { getQueryParam } from "helper/index";
import FlashStorage from "services/FlashStorage";
import { Button, Box } from "@material-ui/core";

import ApiOrderService from "services/api/ApiOrderService";
import {OrderList} from './OrderList';

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

export default function OrderListPage({ location }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(
    getQueryParam(location, "page")
      ? parseInt(getQueryParam(location, "page"))
      : 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [query, setQuery] = useState(getQueryParam(location, "search") || "");
  const [sort, setSort] = useState(["_id", 1]);

  // states related to processing
  const [alert, setAlert] = useState(
    FlashStorage.get("ORDER_ALERT") || { message: "", severity: "info" }
  );
  const [processing, setProcessing] = useState(false);

  const updateData = () => {
    ApiOrderService.getOrderList(page, rowsPerPage, query, [sort]).then(
      ({ data }) => {
        setOrders(data.data);
        setTotalRows(data.count);
        setLoading(false);
      }
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
          <TableContainer>
                    <Table
                      className={classes.table}
                      aria-label="Order Table"
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("code");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("code")}
                            {renderSort("code")}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("delivered");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("Deliver Date")}
                            {renderSort("delivered")}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("clientName");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("Client")}
                            {renderSort("clientName")}
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
                          {/* <TableCell
                            onClick={() => {
                              toggleSort("featured");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("Featured")}
                            {renderSort("featured")}
                          </TableCell> */}
                          <TableCell>{t("Actions")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableBodySkeleton
                            colCount={7}
                            rowCount={rowsPerPage}
                          />
                        ) : (
                          <OrderList rows={orders} page={page} rowsPerPage={rowsPerPage} processing={processing}/>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>
              Table on Plain Background
            </h4>
            <p className={classes.cardCategoryWhite}>
              Here is a subtitle for this table
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["ID", "Name", "Country", "City", "Salary"]}
              tableData={[
                ["1", "Dakota Rice", "$36,738", "Niger", "Oud-Turnhout"],
                ["2", "Minerva Hooper", "$23,789", "Curaçao", "Sinaai-Waas"],
                ["3", "Sage Rodriguez", "$56,142", "Netherlands", "Baileux"],
                [
                  "4",
                  "Philip Chaney",
                  "$38,735",
                  "Korea, South",
                  "Overland Park"
                ],
                [
                  "5",
                  "Doris Greene",
                  "$63,542",
                  "Malawi",
                  "Feldkirchen in Kärnten"
                ],
                ["6", "Mason Porter", "$78,615", "Chile", "Gloucester"]
              ]}
            />
          </CardBody>

          <CardFooter>
            {!loading && (
              <TablePagination
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={(e, newPage) => setPage(newPage)}
                count={totalRows}
                onChangeRowsPerPage={({ target }) => {
                  setPage(0);
                  setRowsPerPage(target.value);
                }}
              ></TablePagination>
            )}
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

OrderListPage.propTypes = {
  location: PropTypes.object
};
