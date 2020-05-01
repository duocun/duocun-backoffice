

export const statisticsSummary = (state = {}, action) => {
  if (action && action.type === "SET_STATISTICS_SUMMARY") {
    return action.payload;
  }
  return state;
};

export const driverSummaryArray = (state = [], action) => {
  if (action && action.type === "SET_DRIVER_SUMMARY") {
    return action.payload;
  }
  return state;
};
export const merchantSummaryArray = (state = [], action) => {
  if (action && action.type === "SET_MERCHANT_SUMMARY") {
    return action.payload;
  }
  return state;
};


