import ApiService from "services/api/ApiService";

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
    return ApiService.v1().get("accounts/current", {
      tokenId
    });
  }
};
