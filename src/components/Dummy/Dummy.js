import React from "react";
import PropTypes from "prop-types";

const Dummy = ({ page }) => (
  <div>
    <h3>{page} Page</h3>
    <p>This is a dummy page. You might find it useful when adding routes</p>
  </div>
);

Dummy.propTypes = {
  page: PropTypes.string
};

Dummy.defaultProps = {
  page: "Dummy"
};

export default Dummy;
