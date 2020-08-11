import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";
import CustomInput from "components/CustomInput/CustomInput.js";
// import SearchDropDown from "components/SearchDropDown/SearchDropDown.js";

import ApiProductService from "services/api/ApiProductService";

const useStyles = makeStyles({
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
  }
  // secondaryText: {
  //   width: "100%"
  // }
});

const rowsPerPage = 10;

const ProductSearch = ({ label, placeholder, onSelect, onClear, name, id }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState(name); // getQueryParam(product, "search") || "");
  const [model, setProduct] = useState({ _id: "", name: "" });
  // const [sort, setSort] = useState(["_id", 1]);
  const [searching, setSearching] = useState(false);
  const [products, setProducts] = useState([]); // [{placeId, mainText, secondaryText}]
  const [count, setCount] = useState(10);

  const handleSearch = keyword => {
    if (keyword) {
      if (keyword.length >= 1) {
        ApiProductService.getProductsByKeyword(keyword).then(({ data }) => {
          setProducts(data.data);
          setCount(data.count);
        });
      } else {
        // this.setState({ keyword: keyword });
      }
    } else {
      // this.setState({ products: this.historyLocations, product: null, keyword: keyword, bAddressList: true });
    }
  };

  // useEffect(() => {
  //   setKeyword(name);
  // }, [name]);

  const handleSelectData = item => {
    setKeyword(item.name);
    setSearching(false);
    onSelect(item);
  };

  const handleKeywordChange = ({ target }) => {
    const str = target.value;
    setKeyword(str);
    setProduct({ _id: "", name: "", description: "" });
    setSearching(true);
    handleSearch(str);
  };

  const handleFocus = () => {};

  const handleBlur = () => {
    // setSearching(false);
  };

  const handleClear = () => {
    setKeyword("");
    setProduct({ _id: "", name: "", description: "" });
    onClear();
  };

  const divStyle = {
    position: "absolute",
    zIndex: "3000",
    background: "gray",
    width: "320px",
    height: "200px",
    overflowY: "scroll"
  };

  return (
    <div className={classes.searchWrapper}>
      {/* <Throttle time="1000" handler="onChange"> */}
      {/* </Throttle> */}
      <CustomInput
        className={classes.inputBox}
        labelText={t(label)}
        formControlProps={{
          fullWidth: true,
          className: classes.margin + " " + classes.search
        }}
        labelProps={{ shrink: keyword ? true : false }}
        inputProps={{
          value: keyword,
          placeholder: t(placeholder),
          inputProps: {
            "aria-label": t(placeholder)
          },
          style: { color: "black" },
          onChange: handleKeywordChange,
          onKeyDown: event => {
            const { key } = event;
            if (key === "Enter") {
              return handleSearch(keyword);
            }
          },
          onFocus: handleFocus,
          onBlur: handleBlur
        }}
        onClear={handleClear}
      />

      {products && products.length > 0 && searching && (
        <div className={classes.dropdownList}>
          {products.map(d => (
            <MenuItem
              className={classes.listItem}
              key={d._id}
              value={d._id}
              onClick={() => handleSelectData(d)}
            >
              <div>{d.name}</div>
            </MenuItem>
          ))}
        </div>
      )}
    </div>
  );
};

// ProductSearch.propTypes = {
//   product: PropTypes.object,
// };

export default ProductSearch;
