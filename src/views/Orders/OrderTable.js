import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "components/Table/TablePagniation.js";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableBodySkeleton from "components/Table/TableBodySkeleton";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";

// import CheckIcon from "@material-ui/icons/Check";
// import CloseIcon from "@material-ui/icons/Close";

// import FlashStorage from "services/FlashStorage";

// import ApiOrderService from "services/api/ApiOrderService";
// import { AirlineSeatLegroomReducedOutlined } from "../../../node_modules/@material-ui/icons";

const styles = {
  operationRow: {
    paddingLeft: "0px",
    paddingRight: "0px"
  }
};

const useStyles = makeStyles(styles);

const formatAddress = location => {
  if (!location) return "";
  return (
    location.streetNumber +
    " " +
    location.streetName
    // " " +
    // location.city +
    // " " +
    // location.province
    // ", " +
    // location.postalCode
  );
};

const formatAddressLine2 = location => {
  if (!location) return "";
  return (
    location.city +
    " " +
    location.province +
    ", " +
    location.postalCode
  );
};


export const OrderTable = ({
  rows,
  page,
  rowsPerPage,
  totalRows,
  sort,
  loading,
  setRowsPerPage,
  setSort,
  setPage,
  selectData,
  removeData
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

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

  const toggleSort = fieldName => {
    // sort only one field
    if (sort && sort[0] === fieldName) {
      setSort([fieldName, sort[1] === 1 ? -1 : 1]);
    } else {
      setSort([fieldName, 1]);
    }
  };

  const toDateString = s => {
    return s ? s.split("T")[0] : "";
  };

  const handleOrderEdit = row => {};

  const [processing, setProcessing] = useState(false);

  if (!rows.length) {
    return (
      <div>{t("No data to display")}</div>
    );
  } else {
    return (
      <TableContainer>
        <Table className={classes.table} aria-label="Order Table" size="small">
          <TableHead>
            <TableRow>
              {/* <TableCell>#</TableCell> */}
              <TableCell
                onClick={() => {
                  toggleSort("code");
                }}
                style={{ cursor: "pointer" }}
              >
                {t("Code")}
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
              <TableCell>{t("Address")}</TableCell>
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
                  toggleSort("items");
                }}
                style={{ cursor: "pointer" }}
              >
                {t("Product")}
                {renderSort("items")}
              </TableCell>

              <TableCell>{t("Actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableBodySkeleton colCount={7} rowCount={rowsPerPage} />
            ) : (
              // <OrderTable rows={orders} page={page} rowsPerPage={rowsPerPage} processing={processing}/>
              <React.Fragment>
                {rows.map((row, idx) => (
                  <TableRow key={idx} onClick={() => selectData(row)}>
                    {/* <TableCell>{page * rowsPerPage + idx + 1}</TableCell> */}
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{toDateString(row.delivered)}</TableCell>

                    <TableCell>
                      <div>{row.clientName ? row.clientName : ""}</div>
                      <div>{row.clientPhone ? row.clientPhone : "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      <div>{formatAddress(row.location)}</div>
                      <div>{formatAddressLine2(row.location)}</div>
                    </TableCell>
                    <TableCell>
                      {row.merchantName ? row.merchantName : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row.items &&
                        row.items.length > 0 &&
                        row.items.map(it => (
                          <div key={it.productId}>
                            {it.productName} x{it.quantity}
                          </div>
                        ))}
                    </TableCell>

                    <TableCell className={classes.operationRow}>
                      <Link to={`orders/clone`}>
                        <IconButton aria-label="clone">
                          <FileCopyIcon />
                        </IconButton>
                      </Link>
                      <Link to={`orders/${row._id}`}>
                        <IconButton aria-label="edit">
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <IconButton
                        aria-label="delete"
                        disabled={processing}
                        onClick={() => removeData(row._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            )}
          </TableBody>
        </Table>

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
      </TableContainer>
    );
  }
};
