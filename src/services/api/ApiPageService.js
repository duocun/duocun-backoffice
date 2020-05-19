import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper/index";
export default {
  getPageList: (page, pageSize, sort = []) => {
    const query = {
      query: buildPaginationQuery(page, pageSize, {}, [], sort)
    };
    return ApiService.v2().get(`pages`, query);
  },
  getPage: id => {
    return ApiService.v2().get(`pages/${id}`);
  },
  savePage: model => {
    model._id = model._id || "new";
    if (model._id === "new") {
      return ApiService.v2().post(`pages/${model._id}`, { data: model });
    } else {
      return ApiService.v2().put(`pages/${model._id}`, { data: model });
    }
  },
  deletePage: id => {
    return ApiService.v2().delete(`pages/${id}`);
  }
};
