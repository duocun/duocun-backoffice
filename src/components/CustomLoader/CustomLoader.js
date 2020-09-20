import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

const CustomLoader = ({ containerProps, progressProps }) => (
  <Grid container justify="center" {...containerProps}>
    <CircularProgress {...progressProps} />
  </Grid>
);

CustomLoader.propTypes = {
  containerProps: PropTypes.object,
  progressProps: PropTypes.object
};

CustomLoader.defaultProps = {
  containerProps: {},
  progressProps: {}
};

export default CustomLoader;
