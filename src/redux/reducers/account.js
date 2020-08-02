export const accounts = (state = [], action) => {
  if (action && action.type === "SET_ACCOUNTS") {
    return action.payload;
  }
  return state;
};

export const account = (state = null, action) => {
  if (action && action.type === "SET_ACCOUNT") {
    return {...action.payload};
  }
  return state;
};

export const loggedInAccount = (state = null, action) => {
  if (action && action.type === "SET_LOGGED_IN_ACCOUNT") {
    return {...action.payload};
  }
  return state;
};
