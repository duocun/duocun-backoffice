import Axios from "axios";
import queryString from "query-string";
import Auth from "../AuthService";

export const API_HOST = process.env.REACT_APP_API_HOST;
export const API_V2_HOST = API_HOST;

export const API_V1_HOST = process.env.REACT_APP_API_V1_HOST

export default class ApiService {
  apiHost = "";

  constructor(apiHost = "") {
    this.apiHost = apiHost;
  }

  static v1() {
    return new ApiService(API_V1_HOST);
  }

  static v2() {
    return new ApiService(API_HOST); // API_V2_HOST
  }

  buildUrl(url, param = null) {
    url = this.apiHost + (url.startsWith("/") ? url : `/${url}`);
    if (!param) {
      return url;
    }
    if (typeof param === "string") {
      return url + param;
    }
    if (typeof param === "object") {
      return `${url}?${queryString.stringify(param)}`;
    }
    return url;
  }

  buildAuthHeader() {
    const token = Auth.getAuthToken();
    return token
      ? {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      : {};
  }

  get(url, param = null, auth = true, isRelative = true) {
    if (isRelative) {
      url = this.buildUrl(url, param);
    }
    return auth ? Axios.get(url, this.buildAuthHeader()) : Axios.get(url);
  }

  post(url, param = null, auth = true, isRelative = true) {
    if (isRelative) {
      url = this.buildUrl(url);
    }
    return auth
      ? Axios.post(url, param, this.buildAuthHeader())
      : Axios.post(url, param);
  }

  put(url, param = null, auth = true, isRelative = true) {
    if (isRelative) {
      url = this.buildUrl(url);
    }
    return auth
      ? Axios.put(url, param, this.buildAuthHeader())
      : Axios.put(url, param);
  }

  delete(url, param = null, auth = true, isRelative = true) {
    if (isRelative) {
      url = this.buildUrl(url, param);
    }
    return auth ? Axios.delete(url, this.buildAuthHeader()) : Axios.delete(url);
  }

  // don't remove, temply need here until new upload tools finish
  postV2(url, param = null, auth = true, isRelative = true) {
    if (isRelative) {
      url = `${API_HOST}${url}`; //this.buildUrl(url);
    }
    return auth
      ? Axios.post(url, param, this.buildAuthHeader())
      : Axios.post(url, param);
  }
}
