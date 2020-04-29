import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@material-ui/core/styles";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import { Tooltip, Avatar, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel }  from "@material-ui/core";

import TableBodySkeleton from "components/Table/TableBodySkeleton";
import { isTypeNode } from "typescript";

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 750
  }
}));

export default function MerchantsTable({ merchants, rowsPerPage, toggleSort, sort, page, loading }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const MerchantType = {
    'R': "RESTAURANT",
    'G': "GROCERY",
    'F': "FRESH",
    'T': "TELECOM",
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
                <Avatar variant="square" alt="user"
                  src={`${row.pictures && row.pictures[0] ? row.pictures[0].url  : "#"}`} >
                  <LocalMallIcon></LocalMallIcon>
                </Avatar>
              </TableCell>
              <TableCell>
                {row.name}<br/>{row.nameEN}
              </TableCell>
              <TableCell>{
                row.address && <React.Fragment>
                  Unit {row.address.unit}, No.{row.address.streetNumber} <br />
                  {row.address.streetName}  <br />
                  {row.address.sublocality ? `${row.address.sublocality}, `: ''}
                  {row.address.city ? `${row.address.city}, `: ''} 
                  {row.address.province ? `${row.address.province}, `: ''} 
                  {row.address.postalCode ? `${row.address.postalCode}`: ''} 
                </React.Fragment>
                }</TableCell>
              <TableCell>{row.type ? <Chip variant="outlined" size="small" 
                label={ MerchantType[row.type] || row.type } /> : null }</TableCell>
              <TableCell>{row.order}</TableCell>
              <TableCell>
                <table>
                  <tr><td>下单</td><td></td><td>配送</td></tr>
                  {
                    row.phases && row.phases.map((item) => {
                      return <tr><td>{ item.orderEnd }</td><td>,</td><td>{ item.pickup }</td></tr>
                    })
                  }
                </table>
                {row.dow ? `星期 ${row.dow}` : null}</TableCell>
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
            <TableCell onClick={() => { toggleSort && toggleSort("name");  }}
              style={{ cursor: "pointer" }}>
              {t("Name")}{renderSort("name")}
            </TableCell>
            <TableCell>{t("Address")}</TableCell>           
            <TableCell onClick={() => { toggleSort && toggleSort("type"); }}
              style={{ cursor: "pointer" }} >
              {t("Type")} {renderSort("type")}
            </TableCell>
            <TableCell onClick={() => { toggleSort && toggleSort("order"); }}
              style={{ cursor: "pointer" }} >
              {t("Order")} {renderSort("order")}
            </TableCell>
            <TableCell>{t("Dows/Phases")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableBodySkeleton
              colCount={7}
              rowCount={rowsPerPage}
            />
          ) : (
            renderRows(merchants)
          )}
        </TableBody>
      </Table>
    </TableContainer>      
  );
}

MerchantsTable.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object),
  rowsPerPage: PropTypes.number,
  toggleSort: PropTypes.func,
  sort: PropTypes.array,
  page: PropTypes.number,
  loading: PropTypes.bool
};
