import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/zh-cn";
import { useStyles } from "@material-ui/pickers/views/Calendar/SlideTransition";

moment.locale("zh-cn");

export default function DateRangePicker({
  defaultStartDate,
  defaultEndDate,
  minDate,
  maxDate,
  classNames = undefined,
  onChange,
}) {
  // const { t } = useTranslation();
  const [classes, setClasses] = useState(useStyles());
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  useEffect(() => {
    if (classNames) {
      setClasses(classNames);
    }
  }, [classNames]);

  useEffect(() => {
    onChange(startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        onChange={(date) => setStartDate(date)}
        InputLabelProps={{
          className: classes.label,
        }}
        inputProps={{
          className: classes.input,
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
        onChange={(date) => setEndDate(date)}
        InputLabelProps={{
          className: classes.label,
        }}
        inputProps={{
          className: classes.input,
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
  classNames: PropTypes.object,
  onChange: PropTypes.func,
};

DateRangePicker.defaultProps = {
  defaultStartDate: new Date(),
  defaultEndDate: new Date(),
  minDate: undefined,
  maxDate: undefined,
  onChange: () => {},
};
