export const setTransactions = payload => {
  return {
    type: "SET_TRANSACTIONS",
    payload
  };
};

// payload --- object
export const selectTransaction = payload => ({
  type: "SELECT_TRANSACTION",
  payload
});
