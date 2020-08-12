import AuthService from "services/AuthService.js";

export default function authReducer(
  state = { isAuthorized: AuthService.isLoggedIn(), user: null },
  action
) {
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...state,
        ...action.payload,
        isAuthorized: true
      };
    case "SIGN_OUT":
      return {
        ...state,
        isAuthorized: false,
        user: null
      };
    default:
      return state;
  }
}
