import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@material-ui/core/styles";
import { TableSortLabel, Button, Box } from '@material-ui/core';
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import TablePagination from "components/Table/TablePagniation.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Searchbar from "components/Searchbar/Searchbar";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import ApiAccountService from "services/api/ApiAccountService";
import { getQueryParam } from "helper/index";
import AccountsTable from './AccountsTable';

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 750
  }
}));

export default function AccountsTablePage({ location }) {
  const { t } = useTranslation();

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
                  {
                    AccountsTable({accounts, toggleSort, rowsPerPage, sort, page, loading})
                  }
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

AccountsTablePage.propTypes = {
  location: PropTypes.object
};
