import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core";
import { getAreas } from "models/schedule";
import { getDateStrArrayBetween } from "helper/index";
import moment from "moment";
import { isScheduled } from "models/schedule";
import CheckIcon from "@material-ui/icons/Check";

const ScheduleTable = ({ model, areas, onEditArea, onAddArea }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <TableContainer>
      <Table
        stickyHeader
        aria-label="Schedule Table"
        size="small"
        className={classes.table}
      >
        <TableHead>
          <TableRow>
            <TableCell>{t("Dates")}</TableCell>
            {getAreas(model, areas).map(area => (
              <TableCell
                key={area._id}
                onClick={() => {
                  onEditArea(area._id);
                }}
              >
                {area.name}
              </TableCell>
            ))}
            <TableCell onClick={onAddArea}>{t("Add Area")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getDateStrArrayBetween(model.startDate, model.endDate).map(date => (
            <TableRow key={date}>
              <TableCell>{moment(date).format("MM/DD ddd")}</TableCell>
              {getAreas(model, areas).map(area => (
                <TableCell key={`${date}_${area._id}`}>
                  {isScheduled(model, area._id, date) && <CheckIcon />}
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ScheduleTable.propTypes = {
  model: PropTypes.object,
  areas: PropTypes.array,
  onAddArea: PropTypes.func,
  onEditArea: PropTypes.func
};

const useStyles = makeStyles(() => ({
  table: {
    "& > thead > tr > th": {
      fontSize: 13,
      padding: 5,
      cursor: "pointer"
    }
  }
}));

export default ScheduleTable;
