import ApiDriverService from "../../services/api/ApiDriverService";

export const loadDriversAsync = () => {
  return (dispatch) => {
    dispatch({ type: "LOAD_DRIVERS" });

    ApiDriverService.getDriverList()
      .then((res) => res.data)
      .then(
        (res) => dispatch(setDrivers(res.data)),
        (err) => {
          throw err;
        }
      )
      .catch((err) => {
        console.log(err);
      });
  };
};

const setDrivers = (payload) => {
  return {
    type: "SET_DRIVERS",
    payload,
  };
};
