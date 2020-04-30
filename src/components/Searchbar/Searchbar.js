import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-react/components/searchBarStyle.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Search from "@material-ui/icons/Search";
const useStyles = makeStyles(styles);

const Searchbar = ({ onChange, onSearch, onFocus, onBlur, value }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.searchWrapper}>
      <CustomInput
        formControlProps={{
          className: classes.margin + " " + classes.search,
        }}
        inputProps={{
          placeholder: t("Search"),
          inputProps: {
            "aria-label": t("Search"),
          },
          style: { color: "white" },
          onChange: onChange,
          onKeyDown: (event) => {
            const { key } = event;
            if (key === "Enter") {
              return onSearch();
            }
          },
          onFocus: onFocus,
          onBlur: onBlur,
          // value:value,
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
  onSearch: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  value:PropTypes.string
};

export default Searchbar;
