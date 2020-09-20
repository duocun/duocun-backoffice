import React from "react";
import PropTypes from "prop-types";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const CustomCheckbox = props => (
  <FormControlLabel
    {...props.containerProps}
    control={
      <Checkbox
        {...props.checkboxProps}
        disabled={props.disabled}
        icon={<CheckBoxOutlineBlankIcon fontSize={props.size} />}
        checkedIcon={<CheckBoxIcon fontSize={props.size} />}
        checked={props.checked}
        onChange={e => props.onChange(e.target.checked)}
      />
    }
    label={props.label}
  />
);

CustomCheckbox.defaultProps = {
  size: "medium",
  label: "",
  checked: false,
  disabled: false,
  onChange: () => {},
  containerProps: {},
  checkboxProps: {}
};

CustomCheckbox.propTypes = {
  size: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  containerProps: PropTypes.object,
  checkboxProps: PropTypes.object
};

export default CustomCheckbox;
