import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-react/components/searchBarStyle.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Search from "@material-ui/icons/Search";
const useStyles = makeStyles(styles);

const Searchbar = ({ onChange, onSearch }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.searchWrapper}>
      <CustomInput
        formControlProps={{
          className: classes.margin + " " + classes.search
        }}
        inputProps={{
          placeholder: t("Search"),
          inputProps: {
            "aria-label": t("Search")
          },
          style: { color: "white" },
          onChange: onChange,
          onKeyDown: event => {
            const { key } = event;
            if (key === "Enter") {
              return onSearch();
            }
          }
        }}
      />
      <Button color="white" aria-label="edit" justIcon round onClick={onSearch}>
        <Search />
      </Button>
    </div>
  );
};

Searchbar.propTypes = {
  onChange: PropTypes.func,
  onSearch: PropTypes.func
};

export default Searchbar;
