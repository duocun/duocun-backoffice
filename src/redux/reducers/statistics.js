export const statisticsSummary = (state = {}, action) => {
  if (action && action.type === "SET_STATISTICS_SUMMARY") {
    return action.payload;
  }
  return state;
};

export const driverSummary = (state = [], action) => {
  if (action && action.type === "SET_DRIVER_SUMMARY") {
    return action.payload;
  }
  return state;
};
