import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  container: {
    height: "100%",
    maxHeight: "400px",
    maxWidth: 100,
    width: "100%",
    overflowY: "scroll",
    overflowX: "hidden"
  },
  table: {
    minWidth: 650,
    position: "relative",
    borderCollapse: "collapse",
    "& .MuiTableCell-head": {
      position: "sticky",
      top: 0,
      backgroundColor: "white"
    }
  }
});

export default function DriverTable({ drivers }) {
  const classes = useStyles();

  return (
    <TableContainer className={classes.container} component={Paper}>
      <Table className={classes.table} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell>Driver</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {drivers &&
            drivers.map(driver => (
              <TableRow key={driver._id}>
                <TableCell component="th" scope="row">
                  {driver.accountName}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
