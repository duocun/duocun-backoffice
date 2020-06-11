import React, {useState, useEffect} from 'react';
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";
import CustomInput from "components/CustomInput/CustomInput.js";
// import SearchDropDown from "components/SearchDropDown/SearchDropDown.js";

import ApiProductService from "services/api/ApiProductService";

const useStyles = makeStyles((styles) => ({
  searchWrapper: {
    width: "320px"
  },
  inputBox: {
    width: "100%"
  },
  // mainText: {
  //   width: "100%"
  // },
  // secondaryText: {
  //   width: "100%"
  // }
}));

const rowsPerPage = 10;


const ProductSearch = ({label, placeholder, onSelectProduct, product}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState(product.name);// getQueryParam(product, "search") || "");
  const [model, setProduct] = useState(product);
  // const [sort, setSort] = useState(["_id", 1]);
  const [searching, setSearching] = useState(false);
  const [products, setProducts] = useState([]); // [{placeId, mainText, secondaryText}]
  const [count, setCount] = useState(10);

  const handleSearch = (keyword) => {
    if (keyword) {
      if (keyword.length > 2) {
        ApiProductService.getProductsByKeyword(keyword).then(({data}) => {
          setProducts(data.data);
          setCount(data.count);
        });
      } else {
        // this.setState({ keyword: keyword });
      }
    } else {
      // this.setState({ products: this.historyLocations, product: null, keyword: keyword, bAddressList: true });
    }
  }

  useEffect(() => {
    setKeyword(product.name);
  }, [product]);

  const handleSelectData = (product) => {
    const placeId = model.placeId;
    ApiProductService.getLocationByGeocode({placeId}).then(({data}) => {
      const product = data.data;
      // handleSelectProduct(product);
      setProduct(product);
      setKeyword(product.name);
      setSearching(false);
    });
  }


  const handleKeywordChange = ({target}) => {
    const str = target.value;
    setKeyword(str);
    setProduct({name:'', description:''});
    setSearching(true);
    handleSearch(str);
  }

  // onAddressInputChange(keyword) {
  //   if (keyword) {
  //     if (keyword.length > 3) {
  //       this.locationSvc.getSuggestAddressList(keyword).then(products => {
  //         this.setState({ products: products, product: null, keyword: keyword, bAddressList: true });
  //       });
  //     } else {
  //       this.setState({ keyword: keyword });
  //     }
  //   } else {
  //     this.setState({ products: this.historyLocations, product: null, keyword: keyword, bAddressList: true });
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
      data={products}
      hasMore={hasMoreProducts}
      fetchData={fetchProducts}
      selectData={handleSelectData}
      show={searching}
    /> */}
        {
          products && products.length > 0 && searching &&
          products.map(d => 
            <MenuItem className={classes.listItem} key={d._id} value={d._id} onClick={() => handleSelectData(d)}>
              <div>{d.name}</div>
            </MenuItem>
          )
        }
    </div>
</div>
}



// ProductSearch.propTypes = {
//   product: PropTypes.object,
// };

export default ProductSearch;