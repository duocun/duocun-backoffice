import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";

import { TableHeader } from "components/Table/TableHeader";

const useStyles = makeStyles({
  operationRow: {
    paddingLeft: "0px",
    paddingRight: "0px"
  }
});

const formatAddress = location => {
  if (!location) return "";
  return location.streetNumber + " " + location.streetName;
};

const formatAddressLine2 = location => {
  if (!location) return "";
  return location.city + " " + location.province + ", " + location.postalCode;
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

  const toDateString = s => {
    return s ? s.split("T")[0] : "";
  };

  // const [processing, setProcessing] = useState(false);
  const processing = false;
  if (!rows.length) {
    return <div>{t("No data to display")}</div>;
  } else {
    return (
      <TableContainer>
        <Table className={classes.table} aria-label="Order Table" size="small">
          <TableHeader
            data={[
              { field: "code", label: "Code" },
              { field: "delivered", label: "Deliver Date" },
              { field: "clientName", label: "Client" },
              { field: "address", label: "Address" },
              { field: "merchantName", label: "Merchant" },
              { field: "items", label: "Product" },
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
              // <OrderTable rows={orders} page={page} rowsPerPage={rowsPerPage} processing={processing}/>
              <React.Fragment>
                {rows &&
                  rows.length > 0 &&
                  rows.map((row, idx) => (
                    <TableRow key={idx} onClick={() => selectData(row)}>
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
                      <TableCell>
                        {row.note ? row.note : ""}
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
