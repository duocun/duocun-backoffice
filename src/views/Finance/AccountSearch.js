import React, {useState, useEffect} from 'react';
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import Search from "@material-ui/icons/Search";

import styles from "assets/jss/material-dashboard-react/components/searchBarStyle.js";

import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import SearchDropDown from "components/SearchDropDown/SearchDropDown.js";
// import { Throttle } from "react-throttle";
// import FlashStorage from "services/FlashStorage";
// import { getQueryParam } from "helper/index";
// import Searchbar from "components/Searchbar/Searchbar";

import ApiAccountService from "services/api/ApiAccountService";

const useStyles = makeStyles(styles);


const AccountSearch = ({handleSelectAccount, val}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0
    // getQueryParam(location, "page")
    // ? parseInt(getQueryParam(location, "page"))
    // : 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  
  const [keyword, setKeyword] = useState(val);// getQueryParam(location, "search") || "");

  const [sort, setSort] = useState(["_id", 1]);
  const [bShowList, setShowList] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [count, setCount] = useState(10);

  const handleSearch = (keyword) => {
    if (keyword) {
      ApiAccountService.getAccountByKeyword(0, rowsPerPage, keyword).then(({data}) => {
        setAccounts(data.data);
        setCount(data.count);
        setPage(1);
        setHasMoreAccounts(true);
        setShowList(true);
      });
    } else {
      setPage(1);
      setHasMoreAccounts(true);
      setShowList(false);
    }
  }

  useEffect(() => {
    handleSearch(keyword);
  }, [keyword]);

  const handleShowList = () => {
    setShowList(true);
  };

  const handleHideList = () => {
    setTimeout(() => {
      setShowList(false);
    }, 500);
  };

  const handleSelectData = (account) => {
    handleSelectAccount(account);
    setShowList(false);
    const str = account.username; // + ' ' + (account.phone ? account.phone:'');
    setKeyword(str);
  }

  const [searchOption, setSearchOption] = useState('name');

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

  const handleSearchChange = ({target}) => {
    setKeyword(target.value);
  };

  const handleKeywordChange = ({target}) => {
    const str = target.value;
    setKeyword(str);
    handleSearch(str);
  }

  const handleFocus = () => {

  }

  const handleBlur = () => {

  }

  return <div>
  {/* <Throttle time="1000" handler="onChange"> */}
  {/* <Searchbar
    value={keyword}
    onChange={handleSearchChange}
    onSearch={() => {
      setLoading(true);
      if (page === 0) {
        // updateData();
      } else {
        setPage(0);
      }
    }}
    onFocus={handleShowList}
    onBlur={handleHideList}
    ifSearch = {false}
    options = {['name', 'phone']}
    getOption = {setSearchOption}
  /> */}
{/* </Throttle> */}


    <div className={classes.searchWrapper}>
      <CustomInput
        formControlProps={{
          className: classes.margin + " " + classes.search,
        }}
        inputProps={{
          value: keyword,
          placeholder: t("Search by name"),
          inputProps: {
            "aria-label": t("Search by name"),
          },
          style: { color: "white" },
          onChange: handleKeywordChange,
          onKeyDown: (event) => {
            const { key } = event;
            if (key === "Enter") {
              return handleSearch();
            }
          },
          onFocus: handleFocus,
          onBlur: handleBlur,
        }}
      />
      <Button
        color="white"
        aria-label="edit"
        justIcon
        round
        onClick={handleSearch}
        // style={{ visibility: ifSearch ? "visible" : "hidden" }}
      >
        <Search />
      </Button>
    </div>

    <SearchDropDown
      data={accounts}
      hasMore={hasMoreAccounts}
      fetchData={fetchAccounts}
      selectData={handleSelectData}
      show={bShowList}
    />
</div>
}

// AccountSearch.propTypes = {
//   location: PropTypes.object,
// };

export default AccountSearch;