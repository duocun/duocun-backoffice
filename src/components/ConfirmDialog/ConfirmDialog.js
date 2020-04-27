import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTranslation } from "react-i18next";
export default function ConfirmDialog({
  title = "",
  content = "",
  onClose,
  open = true
}) {
  const { t } = useTranslation();
  const handleClose = value => {
    onClose(value);
  };
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="confirm-dialog">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(true)} color="primary" autoFocus>
          {t("Yes")}
        </Button>
        <Button onClick={() => handleClose(false)} color="primary">
          {t("No")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
