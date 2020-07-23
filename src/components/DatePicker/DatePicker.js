import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as moment from "moment";

import {
  Clear as ClearIcon
} from "@material-ui/icons";

import { IconButton, InputAdornment } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { classExpression } from "../../../node_modules/@babel/types";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  "clearBtn": {
    paddingTop: "20px",
    paddingLeft: "0px",
    paddingRight: "0px"
  },
  "wrapper": {
    display: "flex"
  }
});

export const DatePicker = ({ date, label, onChange, onClick, onClear }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return <div className={classes.wrapper}>
    <KeyboardDatePicker
      variant="inline"
      label={t(label)}
      format="YYYY-MM-DD"
      value={date ? moment.utc(date) : null}
      onChange={onChange}
      onClick={onClick}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
      InputLabelProps={{
        shrink: date ? true : false,
      }}
    // keyboardIcon={
    //   date ? (
    //       <IconButton onClick={handledateClear}>
    //         <ClearIcon />
    //       </IconButton>
    //   ) : (
    //       <IconButton>
    //         <CalendarIcon />
    //       </IconButton>
    //   )
    // }
    />
    <IconButton className={classes.clearBtn} onClick={onClear}>
      <ClearIcon />
    </IconButton>
  </div>
}