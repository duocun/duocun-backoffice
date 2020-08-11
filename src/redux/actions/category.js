import ApiCategoryService from "services/api/ApiCategoryService";

export const setCategories = payload => {
  return {
    type: "SET_CATEGORIES",
    payload
  };
};
export const filterCategories = payload => {
  return {
    type: "FILTER_CATEGORIES",
    payload
  };
};

// payload --- order object
export const selectOrder = payload => ({
  type: "SELECT_ORDER",
  payload
});

// async actions
export const loadCategoriesAsync = () => {
  return dispatch => {
    return ApiCategoryService.getCategoryList().then(({ data }) => {
      dispatch(setCategories(data.data));
    });
  };
};
