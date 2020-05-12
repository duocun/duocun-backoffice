import React, { useState } from "react";
import { DateTimePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  wrapper:{
    margin:'0 10px',
    color:'white',
    "& label, input":{
      color:'white'
    }
  },
}));

const TimePicker = ({ label, date, getDate, format }) => {
  const classes = useStyles();

  const handleOnChange = (momentObj) =>{
    getDate(momentObj.toISOString())
  }

  return (
    <div className={classes.wrapper}>
      <DateTimePicker
        variant="inline"
        label={label}
        value={date}
        onChange={handleOnChange}
        format={format}
      />
    </div>
  );
};

export default TimePicker;
