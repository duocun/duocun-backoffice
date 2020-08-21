import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const DowButton = ({ dow, selected, ...rest }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      color={selected ? "primary" : "default"}
      size="small"
      className={classes.button}
      {...rest}
    >
      {t(`dow_${dow}`)}
    </Button>
  );
};

const useStyles = makeStyles(theme => ({
  button: {
    padding: "2"
  }
}));

DowButton.propTypes = {
  dow: PropTypes.number,
  selected: PropTypes.bool,
};

export default DowButton;
