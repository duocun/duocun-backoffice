export const accounts = (state = {}, action) => {
    if (action && action.type === "LOAD_ACCOUNT") {
      return action.payload;
    }
    return state;
  };