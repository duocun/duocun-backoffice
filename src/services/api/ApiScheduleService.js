import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper/index";

export const list = (page, pageSize) => {
  const query = buildPaginationQuery(page, pageSize);
  return ApiService.v2().get("/schedules", { query });
};

export const get = id => {
  return ApiService.v2().get(`/schedules/${id}`);
};

export const save = data => {
  return ApiService.v2().post(`/schedules/${data._id}`, { data });
};

export const del = (id) => {
  return ApiService.v2().delete(`/schedules/${id}`);
};
