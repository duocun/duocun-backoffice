import React, {useState, useEffect} from 'react';
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import CustomInput from "components/CustomInput/CustomInput.js";
// import SearchDropDown from "components/SearchDropDown/SearchDropDown.js";

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

const AddressSearch = ({label, placeholder, handleSelectAccount, val, id}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState(val);// getQueryParam(location, "search") || "");

  const [account, setAccount] = useState({_id: id, username: val});
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
  //   // handleSelectAccount({_id: id, username: val});
    setKeyword(val); // fix me
    setAccount({_id: id, username: val});
  //   // if(accountId){
      
  //   // }else{
  //     handleSearch(keyword);
  //   // }
  }, [id, val]);

  const handleSelectData = (account) => {
    handleSelectAccount(account);
    setAccount(account);
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
    setAccount({_id:'', username:''});
    setSearching(true);
    handleSearch(str);
  }

  // onAddressInputChange(keyword) {
  //   if (keyword) {
  //     if (keyword.length > 3) {
  //       this.locationSvc.getSuggestAddressList(keyword).then(addresses => {
  //         this.setState({ addresses: addresses, address: null, keyword: keyword, bAddressList: true });
  //       });
  //     } else {
  //       this.setState({ keyword: keyword });
  //     }
  //   } else {
  //     this.setState({ addresses: this.historyLocations, address: null, keyword: keyword, bAddressList: true });
  //   }
  // }

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
    {/* <SearchDropDown
      data={accounts}
      hasMore={hasMoreAccounts}
      fetchData={fetchAccounts}
      selectData={handleSelectData}
      show={searching}
    /> */}
            {
          data && data.length > 0 &&
          data.map(d => 
            <MenuItem className={classes.listItem} key={d._id} value={d._id} onClick={() => handleSelectData(d)}>
              {d.username+' ' + (d.phone? d.phone:'')}
            </MenuItem>
          )
        }
    </div>
</div>
}

// AddressSearch.propTypes = {
//   location: PropTypes.object,
// };

export default AddressSearch;