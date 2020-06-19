import { AssignmentReturnRounded } from "@material-ui/icons";

const AuthService = () => {
  const TOKEN_KEY = "duocun_admin_token";
  const ADMIN_ROLE_ID = 1;
  const Role = {
    Admin: 'A',
    Merchant: 'M',
    StorageAdmin: 'SA',
    Driver: 'D',
    Clinet: 'C'
  }
  const self = {
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
    isAuthorized: account => {
        // for users without any role, it will throw an exception
        // TODO: check user role
        // user && user._id && user.roles && user.roles.includes(ADMIN_ROLE_ID)
        return self.isAdmin(account) || self.isMerchant(account);
    },
    isAdmin: (account) => {
      if(account && account.roles?.indexOf(Role.Admin)!== -1){
        return true;
      }else{
        return false;
      }
    },
    isMerchant: (account) => {
      if(account && account.roles?.indexOf(Role.Merchant)!==1){
        return true;
      }else{
        return false;
      }
    }
  };

  return self;
};

export default AuthService();
