import React, {useState, useEffect}from "react";
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
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import LocalMallIcon from "@material-ui/icons/LocalMall";

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 750
  }
}));

export const OrderList = ({rows, page, rowsPerPage, processing}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  // const [page, setPage] = useState(
  //   getQueryParam(location, "page")
  //     ? parseInt(getQueryParam(location, "page"))
  //     : 0
  // );
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
        <TableRow key={idx}>
          <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
          <TableCell>{row.code}</TableCell>
          <TableCell>{row.delivered}</TableCell>
          <TableCell>{row.clientName}</TableCell>
          <TableCell>{row.merchantName}</TableCell>
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
  );
};