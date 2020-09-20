import React from "react";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  select: {
    width: "100%"
  }
}));
export const DropdownSelect = ({ id, label, value, options, onChange }) => {
  const classes = useStyles();

  return (
    <div className="dc-full-select">
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        className={classes.select}
        required
        labelId={`${id}-label`}
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(option => (
          <MenuItem key={option.key} value={option.key}>
            {option.text}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
