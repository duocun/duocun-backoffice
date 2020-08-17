import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import FormControl from "@material-ui/core/FormControl";

import {
  Avatar,
  Chip,
  Table,
  TableCell,
  TableContainer,
  TableBody,
  TableRow,
  Switch,
} from "@material-ui/core";

import LocalMallIcon from "@material-ui/icons/LocalMall";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import TablePagination from "components/Table/TablePagniation.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import ApiAccountService from "services/api/ApiAccountService";
import { toDateString } from "helper/index";
import { TableHeader } from "components/Table/TableHeader";
import { DropdownSelect } from "components/DropdownSelect/DropdownSelect";

import { setAccount } from "redux/actions/account";
import Searchbar from "components/Searchbar/Searchbar";

import {
  ROLES as ROLE_MAPPING,
  ATTRIBUTES as ATTRIBUTES_MAPPING,
  ACCOUNT_TYPES,
} from "models/account";

const useStyles = makeStyles({
  formControl: {
    width: "100%",
    display: "block",
    // marginTop: "27px"
  },
});

const AccountTablePage = ({ location, account, setAccount }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(
    0
    // getQueryParam(location, "page")
    //   ? parseInt(getQueryParam(location, "page"))
    //   : 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [query, setQuery] = useState(""); // useState(getQueryParam(location, "search") || "");
  const [sort, setSort] = useState(["created", -1]);
  
  const types = [
    { key: "all", text: "All" },
    ...ACCOUNT_TYPES.map((type) => {
      return { key: type.toLowerCase(), text: type };
    }),
  ];

  const [type, setType] = useState("all");


  const updateData = useCallback(
    (keyword, type) => {
      const q = keyword ? { username: keyword } : {};
      const qType = type && type !== "all" ? { type } : {};
      const query = {
        ...q,
        ...qType,
      };
      ApiAccountService.getAccountList(page, rowsPerPage, query, [sort]).then(
        ({ data }) => {
          setAccounts(data.data);
          setTotalRows(data.count);
          setLoading(false);
        }
      );
    }, [page, rowsPerPage, sort]
  );

  useEffect(() => {
    updateData(query, type);
  }, [page, rowsPerPage, sort, type, query, updateData]);

  const handleTypeChange = (type) => {
    setType(type);
  };

  const refreshPage = useCallback(() => {
    if (page === 0) {
      updateData(query, type);
    } else {
      setPage(0);
    }
  }, [page, query, type, updateData, setPage]);

  return (
    <Card>
      <CardHeader color="primary">
        <GridContainer>
          <GridItem xs={12} lg={12}>
            <h4>{t("Accounts")}</h4>
          </GridItem>
          <GridItem xs={12} md={4} lg={4}>
            <Searchbar
              onChange={(e) => {
                const { target } = e;
                setQuery(target.value);
              }}
              onSearch={() => {
                setLoading(true);
                refreshPage();
              }}
            />
          </GridItem>
          <GridItem xs={12} md={4} lg={4}>
            <FormControl className={classes.formControl}>
              <DropdownSelect
                id="account-type-select"
                label={t("Type")}
                value={type}
                options={types}
                onChange={handleTypeChange}
              />
            </FormControl>
          </GridItem>
          <GridItem xs={12} md={3} lg={3}>
            <Link to={`new`}>
              <Button variant="contained" color="default">
                <AddCircleOutlineIcon />
                {t("New Account")}
              </Button>
            </Link>
          </GridItem>
        </GridContainer>
      </CardHeader>
      <CardBody>
        <TableContainer>
          {!(accounts && accounts.length > 0) ? (
            <Table className="dc-table">
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={9} size="medium">
                    {t("No data to display")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <Table className="dc-table" aria-label="Product Table" size="small">
              <TableHeader
                data={[
                  { field: "created", label: "Created Date" },
                  { field: "imageurl", label: "Portrait" },
                  { field: "username", label: "Username" },
                  { field: "type", label: "Type" },
                  { field: "phone", label: "Phone" },
                  { field: "balance", label: "Balance" },
                  { field: "status", label: "Status" },
                  { field: "attribute", label: "Attribute" },
                  { field: "actions", label: "Actions" },
                ]}
                sort={sort}
                onSetSort={setSort}
              />

              <TableBody>
                {accounts.map((row, idx) => (
                  <TableRow key={`${row._id}_${idx}`}>
                    <TableCell>{toDateString(row.created)}</TableCell>
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
                    <TableCell>
                      <Switch
                        checked={row.verified}
                        name="checkedA"
                        color="primary"
                        inputProps={{ "aria-label": "primary checkbox" }}
                        onChange={() => {
                          ApiAccountService.toggleStatus(row._id).then(
                            ({ data }) => {
                              if (data.code !== "success") {
                                return;
                              }
                              const newAccounts = [...accounts];
                              newAccounts[idx] = {
                                ...newAccounts[idx],
                                verified: !row.verified
                              };
                              setAccounts(newAccounts);
                            }
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {row.roles &&
                        row.roles
                          .map((item) => ROLE_MAPPING[item] || item)
                          .map((item) => (
                            // eslint-disable-next-line react/jsx-key
                            <React.Fragment key={`${item}`}>
                              <Chip
                                variant="outlined"
                                size="small"
                                label={item}
                              />
                              <br />
                            </React.Fragment>
                          ))}
                    </TableCell>
                    <TableCell>
                      {row.attributes &&
                        row.attributes
                          .map((item) => ATTRIBUTES_MAPPING[item] || item)
                          .map((item) => (
                            // eslint-disable-next-line react/jsx-key
                            <React.Fragment key={`${item}`}>
                              <Chip
                                variant="outlined"
                                size="small"
                                label={item}
                              />
                              <br />
                            </React.Fragment>
                          ))}
                    </TableCell>
                    <TableCell>
                      <Link to={`accounts/${row._id}`}>
                        <IconButton aria-label="edit">
                          {" "}
                          <EditIcon />
                        </IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
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
  );
};

AccountTablePage.propTypes = {
  location: PropTypes.object,
};

const mapStateToProps = (state) => ({
  // accounts: state.accounts,
  account: state.account,
});
// const mapDispatchToProps = (dispatch) => ({
//   loadAccounts: (payload, searchOption) => {
//     dispatch(loadAccountsAsync(payload, searchOption));
//   },
// });
export default connect(
  mapStateToProps,
  { setAccount }
)(AccountTablePage);
