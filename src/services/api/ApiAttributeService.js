import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper";

export default {
  getAttributeList: (page, pageSize, sort = []) => {
    const query = {
      query: buildPaginationQuery(page, pageSize, {}, [], sort)
    };
    return ApiService.v2().get("admin/attributes", query);
  },
  getAttribute: id => {
    return ApiService.v2().get(`admin/attributes/${id}`);
  },
  saveAttribute: model => {
    if (!model.id) {
      model.id = "new";
    }
    return ApiService.v2().post(`admin/attributes/${model.id}`, model);
  },
  removeAttribute: id => {
    return ApiService.v2().delete(`admin/attributes/${id}`);
  }
};
