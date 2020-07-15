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
    position: "absolute",
    backgroundColor: "white",
    color: "black",
    borderRadius: "3px",
    width: "320px",
    zIndex: "500",
    // border: "1px solid #eee",
    boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)"
  },
  listItem: {
    backgroundColor: "white"
  }
}));

const SearchDropDown = ({ data, hasMore, fetchData, selectData, show = false }) => {
  const classes = useStyles();

  // const getVisibility = (show) => (show ? "visible" : "hidden");
  const handleSelectData = (d) => {
    selectData(d);
  }
  return (

    <FormControl 
      className={classes.list}
      // style={{ visibility: getVisibility(show) }}
    >
    <InfiniteScroll 
        className={classes.list}
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
        {
          data && data.length > 0 &&
          data.map(d => 
            <MenuItem className={classes.listItem} key={d._id} value={d._id} onClick={() => handleSelectData(d)}>
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
