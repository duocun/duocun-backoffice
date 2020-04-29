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

export const FinanceTable = ({
  rows,
  page,
  rowsPerPage,
  totalRows,
  sort,
  loading,
  setRowsPerPage,
  setSort,
  setPage,
  setAlert
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

  const toggleSort = (fieldName) => {
    // sort only one field
    if (sort && sort[0] === fieldName) {
      setSort([fieldName, sort[1] === 1 ? -1 : 1]);
    } else {
      setSort([fieldName, 1]);
    }
  };

  const removeAlert = () => {
    setAlert({
      message: "",
      severity: "info",
    });
  };

//   const toggleFeature = (productId) => {
//     removeAlert();
//     setProcessing(true);
//     ApiTransactionService.toggleFeature(productId)
//       .then(({ data }) => {
//         if (data.success) {
//           setAlert({
//             message: t("Saved successfully"),
//             severtiy: "success",
//           });
//           updateData();
//         } else {
//           setAlert({
//             message: t("Save failed"),
//             severity: "error",
//           });
//         }
//       })
//       .catch((e) => {
//         console.error(e);
//         setAlert({
//           message: t("Save failed"),
//           severity: "error",
//         });
//       })
//       .finally(() => {
//         setProcessing(false);
//       });
//   };

  const renderRows = (rows) => {
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
            {/* <TableCell>
              <Avatar
                variant="square"
                alt="product"
                src={
                  row.pictures && row.pictures[0] ? row.pictures[0].url : "#"
                }
              >
                <LocalMallIcon></LocalMallIcon>
              </Avatar>
            </TableCell> */}
            <TableCell>{toDateString(row.created)}</TableCell>
            <TableCell>{toDateString(row.modified)}</TableCell>
            <TableCell>{row.fromName}</TableCell>
            <TableCell>{row.toName}</TableCell>
            <TableCell>{row.action}</TableCell>
            <TableCell>{row.amount}</TableCell>
            <TableCell>{row.toBalance}</TableCell>
            {/* <TableCell>
              <IconButton
                disabled={processing}
                onClick={() => {
                  toggleFeature(row._id);
                }}
              >
                {row.featured ? (
                  <CheckIcon color="primary"></CheckIcon>
                ) : (
                  <CloseIcon color="error"></CloseIcon>
                )}
              </IconButton>
            </TableCell> */}
            <TableCell>
              <IconButton aria-label="edit" href={`finance/${row._id}`}>
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

  const renderSort = (fieldName) => {
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
    <TableContainer>
      <Table
        className={classes.table}
        aria-label="Transaction Table"
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            {/* <TableCell>{t("Image")}</TableCell> */}
            <TableCell
              onClick={() => {
                toggleSort("created");
              }}
              style={{ cursor: "pointer" }}
            >
              {t("Created")}
              {renderSort("created")}
            </TableCell>
            <TableCell
              onClick={() => {
                toggleSort("modified");
              }}
              style={{ cursor: "pointer" }}
            >
              {t("Modified")}
              {renderSort("modified")}
            </TableCell>
            <TableCell
              onClick={() => {
                toggleSort("fromName");
              }}
              style={{ cursor: "pointer" }}
            >
              {t("fromName")}
              {renderSort("fromName")}
            </TableCell>
            <TableCell
              onClick={() => {
                toggleSort("toName");
              }}
              style={{ cursor: "pointer" }}
            >
              {t("toName")}
              {renderSort("toName")}
            </TableCell>
            <TableCell
              onClick={() => {
                toggleSort("action");
              }}
              style={{ cursor: "pointer" }}
            >
              {t("action")}
              {renderSort("action")}
            </TableCell>
            <TableCell
              onClick={() => {
                toggleSort("amount");
              }}
              style={{ cursor: "pointer" }}
            >
              {t("amount")}
              {renderSort("amount")}
            </TableCell>
            <TableCell
              onClick={() => {
                toggleSort("toBalance");
              }}
              style={{ cursor: "pointer" }}
            >
              {t("balance")}
              {renderSort("toBalance")}
            </TableCell>
            <TableCell>{t("Actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableBodySkeleton colCount={7} rowCount={rowsPerPage} />
          ) : (
            renderRows(rows)
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
