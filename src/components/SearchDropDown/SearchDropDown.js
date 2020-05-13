import React, {useState} from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
// import {
//   warningCardHeader,
//   successCardHeader,
//   dangerCardHeader,
//   infoCardHeader,
//   primaryCardHeader,
//   roseCardHeader,
//   grayColor
// } from "assets/jss/material-dashboard-react.js";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";

import InfiniteScroll from 'react-infinite-scroll-component';

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
    width: "100%",
    // marginTop: 27,
    // display: "block",
    backgroundColor: "white",
    color: "black",
    borderRadius: "3px"
  },
  // list: {
  //   backgroundColor: "gray",
  //   width: "182px",
  //   right: "43px",
  //   boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
  //   maxHeight: "250px",
  //   overflow: "scroll",
  //   [theme.breakpoints.down("sm")]: {
  //     width: "60%",
  //     right: "58px",
  //   },
  // },
  // ListItem: {
  //   color: "black",
  //   "& :hover": {
  //     cursor: "pointer",
  //   },
  // },
}));

const SearchDropDown = ({ data, hasMore, fetchData, selectData,
  show = false, 
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

  // function generate(data) {
  //   return data.map((item) => {
  //     let text = item.phone ? item.username + " " + item.phone : item.username;
  //     //avoid pass in an arrow function to avoid redundant render
  //     function handleAccountClick(){
  //       onClick(item._id, item.username)
  //     }
  //     return (
  //       <ListItem key={item._id} onClick={handleAccountClick}>
  //         <ListItemText primary={text} className={classes.ListItem} />
  //       </ListItem>
  //     );
  //   });
  // }

  const getVisibility = (show) => (show ? "visible" : "hidden");

  return (

    <FormControl 
      className={classes.list}
      style={{ visibility: getVisibility(show) }}
    >
    <InfiniteScroll className={classes.list}
        dataLength={data.length} //This is important field to render the next data
        next={fetchData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        height={200}
        endMessage={
          <p style={{textAlign: 'center'}}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        // below props only if you need pull down functionality
        // refreshFunction={this.refresh}
        // pullDownToRefresh
        // pullDownToRefreshContent={
          //   <h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>
        // }
        // releaseToRefreshContent={
          //   <h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>
        // }
        >
                {/* <Box pb={2}>
                </Box> */}


        {
          data && data.length > 0 &&
          data.map(d => 
            <MenuItem key={d._id} value={d._id} onClick={() => selectData(d)}>
              {d.username+' ' + (d.phone? d.phone:'')}
            </MenuItem>
          )
        }
    </InfiniteScroll>
        </FormControl>
  );
};

SearchDropDown.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.array,
  hide: PropTypes.bool,
};

export default SearchDropDown;
