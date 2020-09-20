import ApiService from "services/api/ApiService";

export const load = () => {
  return ApiService.v2().get("/setting");
};

export const save = (data) => {
  return ApiService.v2().post("/setting", { data });
};
