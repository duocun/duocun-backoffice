import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Avatar from "@material-ui/core/Avatar";
import LocalMallIcon from "@material-ui/icons/LocalMall";
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
import { Button, Box } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Searchbar from "components/Searchbar/Searchbar";

import ApiAccountService from "services/api/ApiAccountService";
import { getQueryParam } from "helper/index";

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 750
  }
}));

export default function AccountList({ location }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [accounts, setAccounts] = useState([]);
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

  useEffect(() => {
    updateData();
  }, [page, rowsPerPage, sort]);

  const updateData = () => {
    ApiAccountService.getAccountList(page, rowsPerPage, query, [sort]).then(
      ({ data }) => {
        setAccounts(data.data);
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

  const ROLE_MAPPING = {
    1: "SUPER",
    2: "MERCHANT_ADMIN",
    3: "MERCHANT_STUFF",
    4: "MANAGER",
    5: "DRIVER",
    6: "CLIENT"
  };
  const ATTRIBUTES_MAPPING = {
    I: "INDOOR",
    G: "GARDENING",
    R: "ROOFING",
    O: "OFFICE",
    P: "PLAZA",
    H: "HOUSE",
    C: "CONDO"
  };
  const renderRows = rows => {
    if (!rows.length) {
      return (
        <TableRow>
          <TableCell align="center" colSpan={9} size="medium">
            {t("No data to display")}
          </TableCell>
        </TableRow>
      );
    } else {
      return (
        <React.Fragment>
          {accounts.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
              <TableCell>
                <Avatar
                  variant="square"
                  alt="user"
                  src={`${row.imageurl ? row.imageurl : "#"}`}
                >
                  <LocalMallIcon></LocalMallIcon>
                </Avatar>
              </TableCell>
              <TableCell>{row.username}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.balance}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                {row.roles &&
                  row.roles
                    .map(item => ROLE_MAPPING[item] || item)
                    .map(item => (
                      // eslint-disable-next-line react/jsx-key
                      <React.Fragment>
                        {item}
                        <br />
                      </React.Fragment>
                    ))}
              </TableCell>
              <TableCell>
                {row.attributes &&
                  row.attributes
                    .map(item => ATTRIBUTES_MAPPING[item] || item)
                    .map(item => (
                      // eslint-disable-next-line react/jsx-key
                      <React.Fragment>
                        {item}
                        <br />
                      </React.Fragment>
                    ))}
              </TableCell>
            </TableRow>
          ))}
        </React.Fragment>
      );
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

  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary">
              <GridContainer>
                <GridItem xs={12} lg={6}>
                  <h4>{t("Accounts")}</h4>
                </GridItem>
                <GridItem xs={12} lg={6} align="right">
                  <Box mr={2} style={{ display: "inline-block" }}>
                    <Button
                      href="accounts/new"
                      variant="contained"
                      color="default"
                    >
                      <AddCircleOutlineIcon />
                      {t("New Account")}
                    </Button>
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
              <GridContainer>
                <GridItem xs={12}>
                  <TableContainer>
                    <Table
                      className={classes.table}
                      aria-label="Product Table"
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>{t("Image")}</TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("username");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("Username")}
                            {renderSort("username")}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("type");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("Type")}
                            {renderSort("type")}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("phone");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("Phone")}
                            {renderSort("phone")}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("balance");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("Balance")}
                            {renderSort("balance")}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              toggleSort("email");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {t("Email")}
                            {renderSort("email")}
                          </TableCell>
                          <TableCell>{t("Roles")}</TableCell>
                          <TableCell>{t("Attributes")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableBodySkeleton
                            colCount={7}
                            rowCount={rowsPerPage}
                          />
                        ) : (
                          renderRows(accounts)
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </GridItem>
              </GridContainer>
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
    </div>
  );
}

AccountList.propTypes = {
  location: PropTypes.object
};
