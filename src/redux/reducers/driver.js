export const drivers = (state = [], action) => {
  if (action && action.type === "SET_DRIVERS") {
    return action.payload;
  }
  return state;
};
