import React, {useState, useEffect} from 'react';
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import CustomInput from "components/CustomInput/CustomInput.js";
import SearchDropDown from "components/SearchDropDown/SearchDropDown.js";

import InfiniteScroll from 'react-infinite-scroll-component';

const useStyles = makeStyles((styles) => ({
  searchWrapper: {
    width: "100%"
  },
  inputBox: {
    width: "100%"
  },
  margin: {
    marginTop: "0px"
  },
  dropdownList: {
    position: "absolute",
    zIndex: "3000",
    background: "gray",
    width: "320px",
    height: "200px",
    overflowY: "scroll"
  },
  // list: {
  //   position: "absolute",
  //   backgroundColor: "white",
  //   color: "black",
  //   borderRadius: "3px",
  //   width: "320px",
  //   zIndex: "500",
  //   // border: "1px solid #eee",
  //   boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)"
  // },
  // listItem: {
  //   backgroundColor: "white"
  // }
}));

const rowsPerPage = 10;

const AccountSearch = ({label, placeholder, val, id, onSearch, onSelect, onClear}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState(val);// getQueryParam(location, "search") || "");

  const [account, setAccount] = useState({_id: id, username: val});
  const [searching, setSearching] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [accounts, setAccounts] = useState({});
  const [count, setCount] = useState(10);
  const [hasMoreAccounts, setHasMoreAccounts] = useState(true);

  const handleSearch = (keyword) => {
    if(searching){
      return;
    }
    if (keyword) {
      setSearching(true);
      onSearch(page, rowsPerPage, keyword).then(({data}) => {
        const dMap = {};
        data.data.forEach(d => {
          dMap[d._id] = d;
        })
        setAccounts(dMap);
        setCount(data.count);
        setPage(1);
        if(data.data.length<data.count){
          setHasMoreAccounts(true);
        }else{
          setHasMoreAccounts(false);
        }
        setSearching(false);
      });
    } else {
      setPage(1);
      setHasMoreAccounts(true);
    }
  }

  useEffect(() => {
    setKeyword(val); // fix me
    setAccount({_id: id, username: val});
  }, [id, val]);

  const handleSelectData = (account) => {
    onSelect(account);
    setAccount(account);
    setDropdown(false);
    const str = account.username + ' ' + (account.phone ? account.phone:'');
    setKeyword(str);
    setSearching(false);
  }


  const fetchData = () => {
    if (accounts.length >= count) {
      setHasMoreAccounts(false);
      return;
    }

    onSearch(page, rowsPerPage, keyword).then(({data}) => {
      const dMap = {...accounts};
      data.data.forEach(d => {
        dMap[d._id] = d;
      });
      setAccounts(dMap);
      setCount(data.count);
      setPage(page + 1);
    });
  }

  // const handleSearchChange = ({target}) => {
  //   setKeyword(target.value);
  // };

  const handleKeywordChange = ({target}) => {
    const str = target.value;
    setKeyword(str);
    setAccount({_id:'', username:''});
    setPage(0);
    setDropdown(true);
    handleSearch(str);
  }

  const handleFocus = () => {

  }

  const handleBlur = () => {
    // setSearching(false);
  }

  const divStyle = {
    // position: "absolute",
    // zIndex:"3000"
  }
  return <div className={classes.searchWrapper}>
  {/* <Throttle time="1000" handler="onChange"> */}
{/* </Throttle> */}
      <CustomInput
        className={classes.inputBox}
        labelText={t(label)}
        formControlProps={{
          fullWidth: true,
          className: classes.margin + " " + classes.search,
        }}
        labelProps={{ shrink: (keyword ? true : false) }}
        inputProps={{
          value: keyword,
          placeholder: t(placeholder),
          inputProps: {
            "aria-label": t(placeholder),
          },
          style: { color: "black" },
          onChange: handleKeywordChange,
          onKeyDown: (event) => {
            const { key } = event;
            if (key === "Enter") {
              return handleSearch(keyword);
            }
          },
          onFocus: handleFocus,
          onBlur: handleBlur,
        }}
        onClear={onClear}
      />
    <div style={divStyle}>
    {
      dropdown &&
      <SearchDropDown
        data={Object.keys(accounts).map(id => accounts[id])}
        hasMore={hasMoreAccounts}
        fetchData={fetchData}
        selectData={handleSelectData}
        show={dropdown}
      />
    }
      {/* {
        dropdown &&
        
        <InfiniteScroll 
        className={classes.list}
        dataLength={Object.keys(accounts).length} //This is important field to render the next data
        next={fetchData}
        hasMore={hasMoreAccounts}
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
        accounts && Object.keys(accounts).length > 0 && searching &&
        Object.keys(accounts).map(id =>
            <MenuItem className={classes.listItem} key={id} value={id} onClick={() => handleSelectData(accounts[id])}>
          <div>{accounts[id].username + " " + accounts[id].phone} </div>
        </MenuItem>
        )
      }
      </InfiniteScroll>
    } */}
    </div>
  </div>
}

// AccountSearch.propTypes = {
//   location: PropTypes.object,
// };

export default AccountSearch;
