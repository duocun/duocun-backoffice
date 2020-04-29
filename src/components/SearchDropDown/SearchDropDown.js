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
    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
    maxHeight: "250px",
    overflow: "scroll",
    [theme.breakpoints.down("sm")]: {
      width: "60%",
      right: "58px",
    },
  },
  ListItem: {
    color: "black",
    "& :hover": {
      cursor: "pointer",
    },
  },
}));

const SearchDropDown = ({ data, onClick, show = false }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

  function generate(data) {
    return data.map((item) => {
      let text = item.phone ? item.username + " " + item.phone : item.username;
      return (
        <ListItem key={item._id}>
          <ListItemText primary={text} className={classes.ListItem} />
        </ListItem>
      );
    });
  }

  const defineVisibility = (show) => (show ? "visible" : "hidden");

  return (
    <div
      className={classes.searchDropDpwnWrapper}
      style={{ visibility: defineVisibility(show) }}
    >
      <List dense={dense} className={classes.list}>
        {generate(data)}
      </List>
    </div>
  );
};

SearchDropDown.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.array,
  hide: PropTypes.bool,
};

export default SearchDropDown;
