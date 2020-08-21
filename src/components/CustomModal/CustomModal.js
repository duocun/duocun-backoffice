import React from "react";
import PropTypes from "prop-types";
import { Backdrop, makeStyles } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";

const CustomModal = props => {
  const classes = useStyles();
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="tranisition-modal-desc"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
      className={classes.modal}
      {...props}
    >
      <Fade in={props.open}>
        <div className={classes.paper}>
          <div style={{ width: { sm: 320, md: 768, lg: 1280 }[props.size] }}>
            {props.children}
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modalSize: {
    sm: {
      width: 320
    },
    md: {
      width: 768
    },
    lg: {
      width: 1280
    }
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: "calc(100vh - 72px)",
    overflowY: "scroll"
  }
}));

CustomModal.propTypes = {
  open: PropTypes.bool,
  size: PropTypes.string,
  children: PropTypes.any
};

CustomModal.defaultProps = {
  open: false,
  size: "md"
};

export default CustomModal;
