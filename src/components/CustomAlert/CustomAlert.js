import React from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const CustomAlert = ({ alert, onClose, containerProps, alertProps }) => {
  if (!alert || !alert.message) {
    return null;
  }

  return (
    <Box p={2} {...containerProps}>
      <Alert {...alertProps} severity={alert.severity} onClose={onClose}>
        {alert.message}
      </Alert>
    </Box>
  );
};

CustomAlert.defaultProps = {
  onClose: () => {},
  containerProps: {},
  alertProps: {}
};

CustomAlert.propTypes = {
  alert: PropTypes.object,
  onClose: PropTypes.func,
  containerProps: PropTypes.object,
  alertProps: PropTypes.object
};

export default CustomAlert;
