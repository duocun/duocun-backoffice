import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");

const useStyle = makeStyles(theme => {
  return {
    label: {
      color: theme.palette.grey[100]
    },
    input: {
      color: theme.palette.grey[100],
      marginRight: "1rem",
      width: "160px"
    },
    inputIcon: {
      fill: theme.palette.grey[100]
    }
  };
});

export default function DateRangePicker({
  defaultStartDate = new Date(),
  defaultEndDate = new Date(),
  minDate = undefined,
  maxDate = undefined,
  onChange
}) {
  const { t } = useTranslation();
  const classes = useStyle();
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  useEffect(() => {
    onChange(startDate, endDate);
  }, [startDate, endDate]);

  return (
    <MuiPickersUtilsProvider
      utils={MomentUtils}
      libInstance={moment}
      locale="zh"
    >
      <KeyboardDatePicker
        autoOk={true}
        variant="inline"
        className={classes.input}
        format="YYYY/MM/DD"
        minDate={minDate}
        maxDate={endDate}
        value={startDate}
        onChange={date => setStartDate(date)}
        InputLabelProps={{
          className: classes.label
        }}
        inputProps={{
          className: classes.input
        }}
      />
      <KeyboardDatePicker
        autoOk={true}
        className={classes.input}
        variant="inline"
        format="YYYY/MM/DD"
        minDate={startDate}
        maxDate={maxDate}
        value={endDate}
        onChange={date => setEndDate(date)}
        InputLabelProps={{
          className: classes.label
        }}
        inputProps={{
          className: classes.input
        }}
      />
    </MuiPickersUtilsProvider>
  );
}

DateRangePicker.propTypes = {
  defaultStartDate: PropTypes.object,
  defaultEndDate: PropTypes.object,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  onChange: PropTypes.func
};
