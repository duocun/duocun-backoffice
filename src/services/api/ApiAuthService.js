import ApiService from "services/api/ApiService";
import Auth from "../AuthService";

export default {
  login: (email, password) => {
    return ApiService.v2().post(
      "accounts/login",
      {
        email,
        password
      },
      false
    );
  },
  getCurrentUser: tokenId => {
    return ApiService.v2().get("accounts/current", { tokenId });
  },
  getCurrentAccount: () => {
    const tokenId = Auth.getAuthToken();
    return ApiService.v2().get("accounts/current", { tokenId });
  }
};
