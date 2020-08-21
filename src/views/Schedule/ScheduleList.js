import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import FlashStorage from "services/FlashStorage";
import { Button } from "@material-ui/core";
import Alert from "components/CustomAlert/CustomAlert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "components/Table/TablePagniation.js";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { makeStyles } from "@material-ui/core/styles";

const ScheduleList = () => {
  const { t } = useTranslation();
  const [alert, setAlert] = useState(FlashStorage.get("SCHEDULE_ALERT"));
  const classes = useStyles();
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

                  </TableBody>
                </Table>
              </TableContainer>
            </GridContainer>
          </CardBody>
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
