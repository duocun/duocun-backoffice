import React, {useState} from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-react/components/searchBarStyle.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Search from "@material-ui/icons/Search";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(styles);

const Searchbar = ({
  onChange,
  onSearch,
  onFocus = () => 0,
  onBlur = () => 0,
  options = [],
  optionTitle = "option",
  getOption,
  //if Search is for finance page, since for transaction there is no direct search, actual search is searching the account list
  ifSearch = true,
  placeholder = t("Search")
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState(options[0])

  const handleOptionChange = (e) => {
    setSearchValue(e.target.value)
    getOption(e.target.value);
  };

  return (
    <div className={classes.searchWrapper}>
      {options.length > 0 && (
        <FormControl className={classes.formControl}>
          <InputLabel id="select-label">{optionTitle}</InputLabel>
          <Select
            labelId="select-label"
            id="simple-select"
            value={searchValue}
            onChange={handleOptionChange}
          >
            {options.length > 0 &&
              options.map((option, index) => (
                <MenuItem key={index} value={option}>{option}</MenuItem>
              ))}
          </Select>
        </FormControl>
      )}
      <CustomInput
        formControlProps={{
          className: classes.margin + " " + classes.search,
        }}
        inputProps={{
          placeholder,
          inputProps: {
            "aria-label": t("Search"),
          },
          style: { color: "white" },
          onChange: onChange,
          onKeyDown: (event) => {
            const { key } = event;
            if (key === "Enter" && ifSearch) {
              return onSearch();
            }
          },
          onFocus: onFocus,
          onBlur: onBlur,
        }}
      />
      <Button
        color="white"
        aria-label="edit"
        justIcon
        round
        onClick={onSearch}
        style={{ visibility: ifSearch ? "visible" : "hidden" }}
      >
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
  options: PropTypes.array,
  value: PropTypes.string,
};

export default Searchbar;
