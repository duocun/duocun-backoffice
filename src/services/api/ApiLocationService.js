import ApiService from "services/api/ApiService";
import { buildQuery, buildPaginationQuery } from "helper/index";

export default {
  getLocationList: (page, pageSize, { address }, sort = []) => {
    let query = {};
    let conditions = {};
    if (address) {
      conditions.address = { $regex: address };
    }
    query.query = buildPaginationQuery(page, pageSize, conditions, [], sort);
    return ApiService.v2().get("locations", query);
  },

  // condition --- {placeId} or  {address}
  getLocations: conditions => {
    let query = {};
    query.query = buildQuery(conditions);
    return ApiService.v2().get("locations/", query);
  },

  // condition --- {placeId} or  {address}
  getLocationByGeocode: conditions => {
    let query = {};
    query.query = buildQuery(conditions);
    return ApiService.v2().get("locations/geocode/", query);
  },

  // return {placeId, mainText, secondaryText}
  getSuggestAddressList: keyword => {
    return ApiService.v2().get("locations/suggest/" + keyword);
  },

  getLocationByKeyword: (page, pageSize, keyword = "", sort = []) => {
    let query = {};
    const condition = {
      $or: [
        {
          address: { $regex: keyword }
        }
      ]
    };
    query.keyword = query.query = buildPaginationQuery(
      page,
      pageSize,
      condition,
      [],
      []
    );
    return ApiService.v2().get("locations", query);
  },

  createLocation: (locationData = {}) => {
    return ApiService.v2().post("locations", locationData);
  }
};
