import React, {useState, useEffect} from 'react';
import PropTypes from "prop-types";

import SearchDropDown from "components/SearchDropDown/SearchDropDown.js";
import { Throttle } from "react-throttle";
import FlashStorage from "services/FlashStorage";
import { getQueryParam } from "helper/index";
import Searchbar from "components/Searchbar/Searchbar";

import ApiAccountService from "services/api/ApiAccountService";

const AccountSearch = ({handleSelectAccount, val}) => {
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
  useEffect(() => {
    if (keyword) {
      // setPage(0);
      ApiAccountService.getAccountByKeyword(0, rowsPerPage, keyword).then(({data}) => {
        setAccounts(data.data);
        setCount(data.count);
        setPage(1);
        setHasMoreAccounts(true);
        setShowList(true);
      });
      // loadAccounts(query, searchOption);
    }
  }, [keyword]);

  const handleShowList = () => {
    setShowList(true);
  };

  const handleHideList = () => {
    setTimeout(() => {
      setShowList(false);
    }, 500);
  };

  const updateSelect = (account) => {
    handleSelectAccount(account);
    setShowList(false);
    setKeyword(account.username + account.phone? account.phone:'');
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

  return <div>
  {/* <Throttle time="1000" handler="onChange"> */}
  <Searchbar
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
  />
{/* </Throttle> */}

<SearchDropDown
  data={accounts}
  hasMore={hasMoreAccounts}
  fetchData={fetchAccounts}
  selectData={updateSelect}
  show={bShowList}
/>
</div>
}

// AccountSearch.propTypes = {
//   location: PropTypes.object,
// };

export default AccountSearch;