import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter";
import FlashStorage from "services/FlashStorage";
import { Button } from "@material-ui/core";
import Alert from "components/CustomAlert/CustomAlert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableBodySkeleton from "components/Table/TableBodySkeleton";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "components/Table/TablePagniation.js";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import * as ApiScheduleService from "services/api/ApiScheduleService";

const ScheduleList = () => {
  const { t } = useTranslation();
  const [alert, setAlert] = useState(FlashStorage.get("SCHEDULE_ALERT"));
  const classes = useStyles();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const loadData = useCallback(() => {
    ApiScheduleService.list(page, rowsPerPage)
      .then(({ data }) => {
        if (data.code === "success") {
          setSchedules(data.data);
          setTotalRows(data.count);
        } else {
          setAlert({
            message: t("Cannot load data"),
            severity: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setAlert({
          message: t("Cannot load data"),
          severity: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, rowsPerPage, t]);

  useEffect(() => {
    loadData();
  }, [loadData, page, rowsPerPage]);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary">
            <GridItem xs={12} container>
              <GridItem xs={12} md={6}>
                <h4>{t("Schedule")}</h4>
              </GridItem>
              <GridItem
                xs={12}
                md={6}
                container
                direction="row-reverse"
                alignItems="center"
              >
                <Button
                  to="/schedules/new"
                  component={Link}
                  variant="contained"
                  color="default"
                >
                  {t("Add Schedule")}
                </Button>
              </GridItem>
            </GridItem>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <Alert alert={alert} onClose={() => setAlert(null)} />
              <TableContainer>
                <Table
                  className={classes.table}
                  aria-label="Schedule Table"
                  size="small"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>{t("Title")}</TableCell>
                      <TableCell>{t("Description")}</TableCell>
                      <TableCell>{t("Order End Margin")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableBodySkeleton colCount={4} rowCount={rowsPerPage} />
                    ) : (
                      schedules.map((schedule, idx) => (
                        <TableRow key={schedule._id}>
                          <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                          <TableCell>
                            <Link to={`schedules/${schedule._id}`}>
                              {schedule.title}
                            </Link>
                          </TableCell>
                          <TableCell>{schedule.description}</TableCell>
                          <TableCell>{schedule.endTimeMargin}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </GridContainer>
          </CardBody>
          <CardFooter>
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
              />
            )}
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 750,
  },
}));

export default ScheduleList;
