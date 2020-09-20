import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";
import CustomInput from "components/CustomInput/CustomInput.js";
import ApiLocationService from "services/api/ApiLocationService";

const useStyles = makeStyles(styles => ({
  searchWrapper: {
    width: "100%"
  },
  inputBox: {
    width: "100%"
  },
  margin: {
    marginTop: "0px"
  }
}));

const AddressSearch = ({
  label,
  placeholder,
  handleSelectLocation,
  location
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const val = getAddrString(location);
  const [keyword, setKeyword] = useState(val); // getQueryParam(location, "search") || "");

  // const placeId = location ? location.placeId : "";
  // const [address, setAddress] = useState({
  //   placeId,
  //   mainText: val,
  //   secondaryText: ""
  // });
  const [searching, setSearching] = useState(false);
  const [addresses, setAddresses] = useState([]); // [{placeId, mainText, secondaryText}]
  // const [count, setCount] = useState(10);

  const handleSearch = keyword => {
    if (keyword) {
      if (keyword.length > 2) {
        ApiLocationService.getSuggestAddressList(keyword).then(({ data }) => {
          setAddresses(data.data);
          // setCount(data.count);
        });
      } else {
        // this.setState({ keyword: keyword });
      }
    } else {
      // this.setState({ addresses: this.historyLocations, address: null, keyword: keyword, bAddressList: true });
    }
  };

  useEffect(() => {
    const val = getAddrString(location);
    setKeyword(val);
  }, [location]);

  const handleSelectData = address => {
    const [streetNumber] = address.mainText.split(" ");
    // const addr = `${address.mainText}, ${address.secondaryText}`;
    const placeId = address.placeId;
    ApiLocationService.getLocationByGeocode({ placeId }).then(({ data }) => {
      const location = !data.data.streetNumber
        ? { ...data.data, streetNumber }
        : data.data;

      handleSelectLocation(location);
      const addr = getAddrString(location);
      // setAddress(address);
      setKeyword(addr);
      setSearching(false);
    });
  };

  const handleKeywordChange = ({ target }) => {
    const str = target.value;
    setKeyword(str);
    // setAddress({ placeId: "", mainText: "" });
    setSearching(true);
    handleSearch(str);
  };

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

  const handleFocus = () => {};

  const handleBlur = () => {
    // setSearching(false);
  };

  const divStyle = {
    // position: "absolute",
    // zIndex:"3000"
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
      data={addresses}
      hasMore={hasMoreAddresses}
      fetchData={fetchAddresses}
      selectData={handleSelectData}
      show={searching}
    /> */}
        {addresses &&
          addresses.length > 0 &&
          searching &&
          addresses.map(d => (
            <MenuItem
              className={classes.listItem}
              key={d.placeId}
              value={d.placeId}
              onClick={() => handleSelectData(d)}
            >
              <div>
                {d.mainText}
                {d.secondaryText ? `, ${d.secondaryText}` : ""}
              </div>
            </MenuItem>
          ))}
      </div>
    </div>
  );
};

const toProvinceAbbr = (input, to = "addr") => {
  if (!input) {
    return "";
  }
  const provinces = [
    ["Alberta", "AB"],
    ["British Columbia", "BC"],
    ["Manitoba", "MB"],
    ["New Brunswick", "NB"],
    ["Newfoundland", "NF"],
    ["Northwest Territory", "NT"],
    ["Nova Scotia", "NS"],
    ["Nunavut", "NU"],
    ["Ontario", "ON"],
    ["Prince Edward Island", "PE"],
    ["Quebec", "QC"],
    ["Saskatchewan", "SK"],
    ["Yukon", "YT"]
  ];

  const states = [
    ["Alabama", "AL"],
    ["Alaska", "AK"],
    ["American Samoa", "AS"],
    ["Arizona", "AZ"],
    ["Arkansas", "AR"],
    ["Armed Forces Americas", "AA"],
    ["Armed Forces Europe", "AE"],
    ["Armed Forces Pacific", "AP"],
    ["California", "CA"],
    ["Colorado", "CO"],
    ["Connecticut", "CT"],
    ["Delaware", "DE"],
    ["District Of Columbia", "DC"],
    ["Florida", "FL"],
    ["Georgia", "GA"],
    ["Guam", "GU"],
    ["Hawaii", "HI"],
    ["Idaho", "ID"],
    ["Illinois", "IL"],
    ["Indiana", "IN"],
    ["Iowa", "IA"],
    ["Kansas", "KS"],
    ["Kentucky", "KY"],
    ["Louisiana", "LA"],
    ["Maine", "ME"],
    ["Marshall Islands", "MH"],
    ["Maryland", "MD"],
    ["Massachusetts", "MA"],
    ["Michigan", "MI"],
    ["Minnesota", "MN"],
    ["Mississippi", "MS"],
    ["Missouri", "MO"],
    ["Montana", "MT"],
    ["Nebraska", "NE"],
    ["Nevada", "NV"],
    ["New Hampshire", "NH"],
    ["New Jersey", "NJ"],
    ["New Mexico", "NM"],
    ["New York", "NY"],
    ["North Carolina", "NC"],
    ["North Dakota", "ND"],
    ["Northern Mariana Islands", "NP"],
    ["Ohio", "OH"],
    ["Oklahoma", "OK"],
    ["Oregon", "OR"],
    ["Pennsylvania", "PA"],
    ["Puerto Rico", "PR"],
    ["Rhode Island", "RI"],
    ["South Carolina", "SC"],
    ["South Dakota", "SD"],
    ["Tennessee", "TN"],
    ["Texas", "TX"],
    ["US Virgin Islands", "VI"],
    ["Utah", "UT"],
    ["Vermont", "VT"],
    ["Virginia", "VA"],
    ["Washington", "WA"],
    ["West Virginia", "WV"],
    ["Wisconsin", "WI"],
    ["Wyoming", "WY"]
  ];
  const regions = states.concat(provinces);
  const camelcase = input.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
  const uppercase = input.toUpperCase();
  if (to === "addr") {
    for (let i = 0; i < regions.length; i++) {
      if (regions[i][0] === camelcase) {
        return regions[i][1];
      } else if (regions[i][1] === uppercase) {
        return regions[i][1];
      }
    }
  } else if (to === "name") {
    for (let i = 0; i < regions.length; i++) {
      if (regions[i][1] === uppercase) {
        return regions[i][0];
      } else if (regions[i][0] === camelcase) {
        return regions[i][0];
      }
    }
  }
};

const getAddrString = location => {
  if (location) {
    const city = location.subLocality ? location.subLocality : location.city;
    const province = toProvinceAbbr(location.province);
    const streetName = toStreetAbbr(location.streetName);
    return (
      location.streetNumber + " " + streetName + ", " + city + ", " + province
    );
  } else {
    return "";
  }
};

const toStreetAbbr = streetName => {
  if (!streetName) {
    return "";
  }
  return streetName.replace(" Street", " St").replace(" Avenue", " Ave");
};

// AddressSearch.propTypes = {
//   location: PropTypes.object,
// };

export default AddressSearch;
