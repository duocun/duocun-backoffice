import { whiteColor } from "assets/jss/material-dashboard-react.js";

const searchBarStyle = theme => ({
  search: {
    width: "240px",
    "& > div": {
      marginTop: "0"
    },
    [theme.breakpoints.down("sm")]: {
      margin: "10px 15px !important",
      float: "none !important",
      paddingTop: "1px",
      paddingBottom: "1px",
      padding: "0!important",
      width: "75%",
      marginTop: "40px",
      "& input": {
        color: whiteColor
      }
    }
  },
  searchButton: {
    [theme.breakpoints.down("sm")]: {
      top: "-50px !important",
      marginRight: "12px",
      float: "right"
    }
  },
  searchWrapper: {
    [theme.breakpoints.down("sm")]: {
      width: "-webkit-fill-available",
      margin: "10px 0px 0"
    },
    display: "inline-block"
  },
  formControl:{
    margin: '12px 10px 0 0',
    paddingBottom:'10px',
    "& #select-label, #simple-select":{
      color:'white'
    }
  }
});

export default searchBarStyle;
