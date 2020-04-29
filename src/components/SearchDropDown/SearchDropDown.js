import React from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  searchDropDpwnWrapper: {
    position: "absolute",
    right: 0,
    margin: "0 15px 0",
    [theme.breakpoints.down("sm")]: {
      width: "-webkit-fill-available",
      padding: "0 15px",
    },
  },
  list: {
    backgroundColor: "white",
    width: "182px",
    right: "43px",
    [theme.breakpoints.down("sm")]: {
      width: "60%",
      right: "58px",
    },
  },
  ListItem:{
    color:'black',
    "& :hover":{
      cursor:"pointer"
    }
  }
}));

const SearchDropDown = ({ data, onClick, hide = true }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

  function generate(element) {
    return [0, 1, 2].map((value) =>
      React.cloneElement(element, {
        key: value,
      })
    );
  }

  const defineVisibility = (hide) => hide ? "hidden" : "visible";

  return (
    <div className={classes.searchDropDpwnWrapper} style={{visibility:defineVisibility(hide)}}>
      <List dense={dense} className={classes.list}>
        {generate(
          <ListItem>
            <ListItemText
              primary="Single-line item"
              secondary={secondary ? "Secondary text" : null}
              className={classes.ListItem}
            />
          </ListItem>
        )}
      </List>
    </div>
  );
};

SearchDropDown.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.array,
  hide: PropTypes.bool
};

export default SearchDropDown;
