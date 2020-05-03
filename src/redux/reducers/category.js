export const order = (state = {}, action) => {
  if (action && action.type === "SELECT_CATEGORY") {
    return action.payload;
  }
  return state;
};

export const filterCategories = (state = {}, action) => {
  if (action && action.type === "LOAD_FILTER_CATEGORIES") {
    return action.payload;
  }
  return state;
};
