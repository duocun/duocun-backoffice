import ApiService from "services/api/ApiService";
import Auth from "../AuthService";

export default {
  login: (username, password) => {
    return ApiService.v1().post(
      "accounts/login",
      {
        username,
        password
      },
      false
    );
  },
  getCurrentUser: tokenId => {
    return ApiService.v1().get("accounts/current", {tokenId});
  },
  getCurrentAccount: () => {
    const tokenId = Auth.getAuthToken();
    return ApiService.v1().get("accounts/current", {tokenId});
  }
};
