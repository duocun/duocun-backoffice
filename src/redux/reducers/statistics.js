

export const statisticsSummary = (state = {}, action) => {
  if (action && action.type === "SET_STATISTICS_SUMMARY") {
    return action.payload;
  }
  return state;
};


