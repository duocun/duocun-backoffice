import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "components/Table/TablePagniation.js";
import TableRow from "@material-ui/core/TableRow";
import TableBodySkeleton from "components/Table/TableBodySkeleton";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import { TableHeader } from "components/Table/TableHeader";
//helper function
import { toDateString } from "../../helper";

const useStyles = makeStyles({});

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

  // const [processing, setProcessing] = useState(false);

  const renderRows = (account, rows) => {
    const getBalance = (account, row) => {
      if (account) {
        if (account.type === "driver") {
          return row.toId === account._id ? row.toBalance : row.fromBalance;
        } else if (account.type === "client") {
          return row.toId === account._id ? row.toBalance : row.fromBalance;
        } else if (account.type === "merchant") {
          return row.fromId === account._id ? row.fromBalance : row.toBalance;
        } else {
          return row.toBalance;
        }
      } else {
        return 0;
      }
    };

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
            {/* <TableCell>{page * rowsPerPage + idx + 1}</TableCell> */}
            <TableCell>{toDateString(row.created)}</TableCell>
            {/* <TableCell>{toDateString(row.delivered)}</TableCell> */}
            <TableCell>{row.fromName}</TableCell>
            <TableCell>{row.toName}</TableCell>
            <TableCell>
              {row.items &&
                row.items.length > 0 &&
                row.items.map(it => (
                  <div key={it.productId}>
                    {it.productName} x{it.quantity}
                  </div>
                ))}
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

  return (
    <TableContainer>
      <Table
        className={classes.table}
        aria-label="Transaction Table"
        size="small"
      >
        <TableHeader
          data={[
            { field: "created", label: "Created Date" },
            { field: "fromName", label: "From Name" },
            { field: "toName", label: "To Name" },
            { field: "items", label: "Product" },
            { field: "action", label: "Actions" },
            { field: "amount", label: "Amount" },
            { field: "toBalance", label: "Balance" },
            { field: "note", label: "Note" },
            { field: "actions", label: "Actions" }
          ]}
          sort={sort}
          onSetSort={setSort}
        />
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
