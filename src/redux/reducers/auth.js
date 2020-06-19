import AuthService from "services/AuthService.js";

export default function authReducer(
  state = { isSignedIn: false }, // AuthService.isLoggedIn() },
  action
) {
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...state,
        isSignedIn: true
      };
    case "SIGN_OUT":
      return {
        ...state,
        isSignedIn: false
      };
    default:
      return state;
  }
}
