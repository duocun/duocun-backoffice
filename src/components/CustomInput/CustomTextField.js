import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";

const CustomTextField = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <TextField
      {...props}
      label={t(props.label)}
      className={classes.w100}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
};

CustomTextField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

CustomTextField.defaultProps = {
  label: "",
  value: "",
  onChange: () => {},
};

const useStyles = makeStyles((theme) => ({
  w100: {
    width: "100%",
  },
}));

export default CustomTextField;
