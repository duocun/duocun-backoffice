import ApiService from "services/api/ApiService";

export const list = () => {
  return ApiService.v2().get("/schedules");
};

export const get = id => {
  return ApiService.v2().get(`/schedules/${id}`);
};

export const save = model => {
  return ApiService.v2().post(`/schedules/${model._id}`, model);
};
