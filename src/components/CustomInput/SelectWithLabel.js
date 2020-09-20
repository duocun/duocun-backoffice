import React from "react";
import {
  makeStyles,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const SelectWithLabel = props => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <FormControl className={classes.w100} {...props.formControlProps}>
      <InputLabel id="input-label" {...props.inputLabelProps}>
        {t(props.label)}
      </InputLabel>
      <Select
        id="select"
        labelId="input-label"
        value={props.value}
        required={props.required}
        onChange={e => props.onChange(e.target.value)}
        {...props.selectProps}
      >
        {props.itemData.map((data, index) => (
          <MenuItem key={`item_${index}`} value={data.value}>
            {t(data.text)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const useStyles = makeStyles(theme => ({
  w100: {
    width: "100%"
  }
}));

SelectWithLabel.propTypes = {
  label: PropTypes.string,
  formControlProps: PropTypes.object,
  inputLabelProps: PropTypes.object,
  selectProps: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
  itemData: PropTypes.array,
  required: PropTypes.bool
};

SelectWithLabel.defaultProps = {
  label: "",
  formControlProps: {},
  inputLabelProps: {},
  selectProps: {},
  value: "",
  onChange: () => {},
  itemData: [],
  required: true
};

export default SelectWithLabel;
