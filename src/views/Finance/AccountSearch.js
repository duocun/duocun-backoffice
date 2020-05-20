import React, {useState, useEffect} from 'react';
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

// import InputLabel from "@material-ui/core/InputLabel";
// import Search from "@material-ui/icons/Search";

// import styles from "assets/jss/material-dashboard-react/components/searchBarStyle.js";

import CustomInput from "components/CustomInput/CustomInput.js";
// import Box from "@material-ui/core/Box";
// import TextField from "@material-ui/core/TextField";


// import Button from "components/CustomButtons/Button.js";
import SearchDropDown from "components/SearchDropDown/SearchDropDown.js";
// import { Throttle } from "react-throttle";
// import FlashStorage from "services/FlashStorage";
// import { getQueryParam } from "helper/index";
// import Searchbar from "components/Searchbar/Searchbar";

import ApiAccountService from "services/api/ApiAccountService";

const useStyles = makeStyles((styles) => ({
  searchWrapper: {
    width: "320px"
  },
  inputBox: {
    width: "100%"
  }
}));
const rowsPerPage = 10;

const AccountSearch = ({label, placeholder, handleSelectAccount, val, id=""}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState(val);// getQueryParam(location, "search") || "");

  const [accountId, setAccountId] = useState(id);
  // const [sort, setSort] = useState(["_id", 1]);
  const [searching, setSearching] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [count, setCount] = useState(10);

  const handleSearch = (keyword) => {
    if (keyword) {
      ApiAccountService.getAccountByKeyword(0, rowsPerPage, keyword).then(({data}) => {
        setAccounts(data.data);
        setCount(data.count);
        setPage(1);
        if(data.data.length<data.count){
          setHasMoreAccounts(true);
        }else{
          setHasMoreAccounts(false);
        }
      });
    } else {
      setPage(1);
      setHasMoreAccounts(true);
    }
  }

  useEffect(() => {
    if(accountId){

    }else{
      handleSearch(keyword);
    }
  }, [keyword, val]);

  const handleSelectData = (account) => {
    handleSelectAccount(account);
    setAccountId(account._id);
    // setShowList(false);
    const str = account.username + ' ' + (account.phone ? account.phone:'');
    setKeyword(str);
    setSearching(false);
  }

  const [hasMoreAccounts, setHasMoreAccounts] = useState(true);

  const fetchAccounts = () => {
    if (accounts.length >= count) {
      setHasMoreAccounts(false);
      return;
    }
    ApiAccountService.getAccountByKeyword(page, rowsPerPage, keyword).then(({data}) => {
      setAccounts([...accounts, ...data.data]);
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
    setAccountId("");
    setSearching(true);
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
      />
                {/* <Box pb={2}>
                  <TextField id="search-input-box"
                    fullWidth
                    label={`${t(label)}`}
                    value={keyword}
                    InputLabelProps={{ shrink: keyword ? true : false }}
                    onChange={handleKeywordChange}
                    onKeyDown={(event) => {
                      const { key } = event;
                      if (key === "Enter") {
                        return handleSearch(keyword);
                      }
                    }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </Box> */}
      {/* <Button
        color="white"
        aria-label="edit"
        justIcon
        round
        // onClick={() => handleSearch(keyword)}
        // style={{ visibility: ifSearch ? "visible" : "hidden" }}
      >
        <Search />
      </Button> */}

    <div style={divStyle}>
    <SearchDropDown
      data={accounts}
      hasMore={hasMoreAccounts}
      fetchData={fetchAccounts}
      selectData={handleSelectData}
      show={searching}
    />
    </div>
</div>
}

// AccountSearch.propTypes = {
//   location: PropTypes.object,
// };

export default AccountSearch;