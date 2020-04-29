import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel }  from "@material-ui/core";
import LocalMallIcon from "@material-ui/icons/LocalMall";

import TableBodySkeleton from "components/Table/TableBodySkeleton";

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 750
  }
}));

export default function AccountsTable({ accounts, rowsPerPage, toggleSort, sort, page, loading }) {
  const { t } = useTranslation();
  const classes = useStyles();

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
          {rows.map((row, idx) => (
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
                        <Chip variant="outlined" size="small" label={item} />
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
                        <Chip variant="outlined" size="small" label={item} />
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
          toggleSort && toggleSort(fieldName);
        }}
      ></TableSortLabel>
    );
  };

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="Product Table"  size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>{t("Image")}</TableCell>
            <TableCell onClick={() => { toggleSort && toggleSort("username");  }}
              style={{ cursor: "pointer" }}>
              {t("Username")}{renderSort("username")}
            </TableCell>
            <TableCell onClick={() => { toggleSort && toggleSort("type"); }}
              style={{ cursor: "pointer" }} >
              {t("Type")} {renderSort("type")}
            </TableCell>
            <TableCell onClick={() => { toggleSort && toggleSort("phone"); }}
              style={{ cursor: "pointer" }} >
              {t("Phone")} {renderSort("phone")}
            </TableCell>
            <TableCell onClick={() => { toggleSort && toggleSort("balance"); }}
              style={{ cursor: "pointer" }} >
              {t("Balance")} {renderSort("balance")}
            </TableCell>
            <TableCell onClick={() => { toggleSort && toggleSort("email"); }}
              style={{ cursor: "pointer" }} >
              {t("Email")} {renderSort("email")}
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
  );
}

AccountsTable.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object),
  rowsPerPage: PropTypes.number,
  toggleSort: PropTypes.func,
  sort: PropTypes.array,
  page: PropTypes.number,
  loading: PropTypes.bool
};
