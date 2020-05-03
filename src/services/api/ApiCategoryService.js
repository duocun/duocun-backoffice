import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper";

export default {
  getCategoryList: (page, pageSize, parentId = "", sort = []) => {
    const query = {};
    if (parentId) {
      query.query = buildPaginationQuery(
        page,
        pageSize,
        {
          parentId
        },
        [],
        sort
      );
    } else {
      query.query = buildPaginationQuery(page, pageSize, {}, [], sort);
    }
    return ApiService.v2().get("categories", query);
  },

  getCategories: (params) => {
    const query = {};
    query.query = buildPaginationQuery(null, null, params, [], []);
    return ApiService.v2().get("categories", query );
  },

  getCategoryTree: () => {
    return ApiService.v2().get("categories/category-tree");
  },
  saveCategory: model => {
    if (!model.id) {
      model._id ? (model.id = model._id) : (model.id = "new");
    }
    return ApiService.v2().post(`categories/${model.id}`, model);
  },
  getCategory: id => {
    return ApiService.v2().get(`categories/${id}`);
  },
  removeCategory: id => {
    return ApiService.v2().delete(`categories/${id}`);
  }
};
