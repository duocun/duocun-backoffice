import React, { useState } from "react";
import { Link } from "react-router-dom";
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
// import CheckIcon from "@material-ui/icons/Check";
// import CloseIcon from "@material-ui/icons/Close";

//helper function
import { toDateString } from "../../helper";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
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
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);
// const useStyles = makeStyles(() => ({
//   table: {
//     minWidth: 750
//   }
// }));

export const TransactionTable = ({
  account,
  rows,
  page,
  rowsPerPage,
  totalRows,
  sort,
  loading,
  setRowsPerPage,
  setSort,
  setPage,
  setAlert,
  selectRow,
  deleteRow
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [processing, setProcessing] = useState(false);

  const toggleSort = (fieldName) => {
    // sort only one field
    if (sort && sort[0] === fieldName) {
      setSort([fieldName, sort[1] === 1 ? -1 : 1]);
    } else {
      setSort([fieldName, 1]);
    }
  };

  const renderRows = (account, rows) => {

    const getBalance = (account, row) => {
      if(account.type === 'driver'){
        return row.toId === account._id ? row.toBalance : row.fromBalance;
      }else if(account.type === 'client'){
        return row.toId === account._id ? row.toBalance : row.fromBalance;
      }else if(account.type === 'merchant'){
        return row.fromId === account._id ? row.fromBalance: row.toBalance;
      } else{
        return row.toBalance;
      }
    }

    if (!rows.length) {
      return (
        <TableRow>
          <TableCell align="center" colSpan={7} size="medium">
            {t("No data to display")}
          </TableCell>
        </TableRow>
      );
    }
    return (
      <React.Fragment>
        {rows.map((row, idx) => (
          <TableRow key={idx} onClick={() => selectRow(row)}>
            <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
            <TableCell>{toDateString(row.created)}</TableCell>
            {/* <TableCell>{toDateString(row.delivered)}</TableCell> */}
            <TableCell>{row.fromName}</TableCell>
            <TableCell>{row.toName}</TableCell>
            <TableCell>
            {
              row.items && row.items.length > 0 &&
              row.items.map(it => <div key={it.productId}>{it.productName} x{it.quantity}</div>)
            }
            </TableCell>
            {/* <TableCell>{row.clientName? row.clientName : ''}</TableCell> */}
            <TableCell>{row.actionCode}</TableCell>
            <TableCell>{row.amount}</TableCell>
            <TableCell>{getBalance(account, row)}</TableCell>
            <TableCell>{row.note}</TableCell>
            <TableCell>
              <Link to={`transactions/${row._id}`}>
                <IconButton aria-label="edit"> 
                  <EditIcon />
                </IconButton>
              </Link>
              {/* <IconButton aria-label="delete"
                disabled={processing}
                onClick={() => deleteRow(row._id)}
                >
                <DeleteIcon />
              </IconButton> */}
            </TableCell>
          </TableRow>
        ))}
      </React.Fragment>
    );
  };

  const renderSort = (fieldName) => {
    return (
      <TableSortLabel
        active={sort && sort[0] === fieldName}
        direction={sort && sort[1] === -1 ? "desc" : "asc"}
        onClick={() => {toggleSort(fieldName);}}
      >
      </TableSortLabel>
    );
  };

  return (
    <TableContainer>
      <Table
        className={classes.table}
        aria-label="Transaction Table"
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell
              onClick={() => {
                toggleSort("created");
              }}
              style={{ cursor: "pointer" }}
            >
              {t("Created Date")}
              {renderSort("created")}
            </TableCell>
            {/* <TableCell
              onClick={() => {
                toggleSort("delivered");
              }}
              style={{ cursor: "pointer" }}
            >
              {t("Deliver Date")}
              {renderSort("delivered")}
            </TableCell> */}
            <TableCell
              onClick={() => {
                toggleSort("fromName");
              }}
              style={{ cursor: "pointer" }}
            >
              {t("From Name")}
              {renderSort("fromName")}
            </TableCell>
            <TableCell
              onClick={() => {
                toggleSort("toName");
              }}
              style={{ cursor: "pointer" }}
            >
              {t("To Name")}
              {renderSort("toName")}
            </TableCell>

            {/* <TableCell
              onClick={() => {
                toggleSort("clientName");
              }}
              style={{ cursor: "pointer" }}
              >
              {t("Client")}
              {renderSort("clientName")}
            </TableCell> */}

            <TableCell
              onClick={() => {
                toggleSort("items");
              }}
              style={{ cursor: "pointer" }}
              >
              {t("Product")}
              {renderSort("items")}
            </TableCell>

            <TableCell
              onClick={() => {
                toggleSort("action");
              }}
              style={{ cursor: "pointer" }}
            >
              {t("Actions")}
              {renderSort("action")}
            </TableCell>
            <TableCell
              onClick={() => {
                toggleSort("amount");
              }}
              style={{ cursor: "pointer" }}
            >
              {t("Amount")}
              {renderSort("amount")}
            </TableCell>
            <TableCell
              onClick={() => {
                toggleSort("toBalance");
              }}
              style={{ cursor: "pointer" }}
            >
              {t("Balance")}
              {renderSort("toBalance")}
            </TableCell>
            <TableCell
              onClick={() => {
                toggleSort("note");
              }}
              style={{ cursor: "pointer" }}
            >
              {t("Note")}
              {renderSort("note")}
            </TableCell>
            <TableCell>{t("Actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableBodySkeleton colCount={7} rowCount={rowsPerPage} />
          ) : (
            renderRows(account, rows)
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
};