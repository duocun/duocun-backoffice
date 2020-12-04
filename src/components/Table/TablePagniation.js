import React from "react";
import { useTranslation } from "react-i18next";
import MuiTablePagination from "@material-ui/core/TablePagination";

export default function TablePagination(props) {
  const { t } = useTranslation();

  return (
    <MuiTablePagination
      component="div"
      rowsPerPageOptions={[10, 25, 50]}
      count={2}
      {...props}
      labelRowsPerPage={t("Rows per page")}
      labelDisplayedRows={({ from, to, count }) =>
        `${t("Total")}: ${count} ${t("Display")}: ${from} - ${to}`
      }
    ></MuiTablePagination>
  );
}
