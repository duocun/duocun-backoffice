const AuthService = () => {
  const TOKEN_KEY = "duocun_admin_token";
  const ADMIN_ROLE_ID = 1;
  return {
    login: token => {
      window.localStorage.setItem(TOKEN_KEY, token);
    },
    logout: () => {
      window.localStorage.removeItem(TOKEN_KEY);
    },
    isLoggedIn: () => {
      return !!window.localStorage.getItem(TOKEN_KEY);
    },
    getAuthToken: () => {
      return window.localStorage.getItem(TOKEN_KEY);
    },
    isAuthorized: user => {
      return (
        // for users without any role, it will throw an exception
        user && user._id && user.roles && user.roles.includes(ADMIN_ROLE_ID)
      );
    }
  };
};

export default AuthService();
