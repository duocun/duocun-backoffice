
export const transactions = (state = [], action) => {
  if (action && action.type === "SET_TRANSACTIONS") {
    return action.payload;
  }
  return state;
};

export const transaction = (state = {}, action) => {
  if (action && action.type === "SELECT_TRANSACTION") {
    return action.payload;
  }
  return state;
};
