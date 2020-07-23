import React from 'react';
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

export const DropdownSelect = ({id, value, options, onChange}) => {
  return (
    <div className="dc-full-select">
      <InputLabel id={`${id}-label`}>Action</InputLabel>
      <Select required
        labelId={`${id}-label`}
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {
          options.map(option => <MenuItem key={option.key} value={option.key}>{option.text}</MenuItem>)
        }
      </Select>
  </div>
  )
}