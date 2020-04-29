export const accounts = (state = [], action) => {
  if (action && action.type === "SET_ACCOUNTS") {
    return action.payload;
  }
  return state;
};
