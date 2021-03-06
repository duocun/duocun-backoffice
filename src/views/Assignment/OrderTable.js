import React, { useState } from "react";
import { useTranslation } from "react-i18next";

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
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

const styles = {
  container: {
    maxWidth: 700,
    width: "50%",
    "& .MuiTablePagination-root": {
      overflow: "hidden"
    }
  },
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

export const OrderTable = ({
  rows,
  page,
  rowsPerPage,
  totalRows,
  sort,
  loading,
  setRowsPerPage,
  setSort,
  setPage
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  // const [page, setPage] = useState(
  //   getQueryParam(location, "page")
  //     ? parseInt(getQueryParam(location, "page"))
  //     : 0
  // );
  // const [sort, setSort] = useState(["_id", 1]);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [totalRows, setTotalRows] = useState(0);

  const [processing, setProcessing] = useState(false);

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

  if (!rows.length) {
    return (
      <div>{t("No data to display")}</div>
      // <TableRow>
      //   <TableCell align="center" colSpan={7} size="medium">
      //     {t("No data to display")}
      //   </TableCell>
      // </TableRow>
    );
  } else {
    return (
      <TableContainer className={classes.container}>
        <Table className={classes.table} aria-label="Order Table" size="small">
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
                  toggleSort("client");
                }}
                style={{ cursor: "pointer" }}
              >
                {t("Client Phone")}
                {renderSort("client")}
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
              <TableBodySkeleton colCount={7} rowCount={rowsPerPage} />
            ) : (
              // <OrderTable rows={orders} page={page} rowsPerPage={rowsPerPage} processing={processing}/>
              <React.Fragment>
                {rows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{toDateString(row.delivered)}</TableCell>
                    <TableCell>{row.clientName}</TableCell>
                    <TableCell>
                      {row.clientPhone ? row.clientPhone : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row.merchantName ? row.merchantName : "N/A"}
                    </TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{row.cost}</TableCell>
                    <TableCell>
                      <IconButton
                        disabled={processing}
                        // onClick={() => {
                        //   toggleFeature(row._id);
                        // }}
                      >
                        {row.featured ? (
                          <CheckIcon color="primary"></CheckIcon>
                        ) : (
                          <CloseIcon color="error"></CloseIcon>
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton aria-label="edit" href={`orders/${row._id}`}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete" disabled={processing}>
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
