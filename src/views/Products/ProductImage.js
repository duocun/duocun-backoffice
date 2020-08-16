import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import { getPictureUrl } from "helper/index";

const useStyle = makeStyles(theme => ({
  imageWrapper: {
    position: "relative"
  },
  image: {
    width: "100%",
    objectFit: "cover"
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    cursor: "pointer"
  }
}));

export default function ProductImage({ src, onRemove }) {
  const classes = useStyle();
  return (
    <div className={classes.imageWrapper}>
      <CancelIcon className={classes.deleteIcon} onClick={onRemove} />
      <img className={classes.image} src={getPictureUrl(src)}></img>
    </div>
  );
}

ProductImage.propTypes = {
  src: PropTypes.string,
  onRemove: PropTypes.func
};
