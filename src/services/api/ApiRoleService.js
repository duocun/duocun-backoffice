import ApiService from "services/api/ApiService";

export const load = () => {
  return ApiService.v2().get("/roles");
};

export const save = data => {
  return ApiService.v2().post("/roles", { data });
};
