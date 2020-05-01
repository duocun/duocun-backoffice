import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper/index";
export default {
  getProductList: (page, pageSize, search = "", sort = []) => {
    let query = {};
    if (!search) {
      query.query = buildPaginationQuery(page, pageSize, {}, [], sort);
    } else {
      const condition = {
        name: {
          $regex: search
        }
      };
      query.query = buildPaginationQuery(page, pageSize, condition, [], sort);
    }
    return ApiService.v2().get("products", query);
  },
  toggleFeature: productId => {
    return ApiService.v2().post("products/toggle-feature", {
      productId
    });
  },
  getProduct: id => {
    return ApiService.v2().get(`products/${id}`);
  },
  saveProduct: model => {
    model._id = model._id || "new";
    return ApiService.v2().post(`products/${model._id}`, model);
  },
  changeStatus: (productId,currentStatus)=>{
    const data = {data:{status: currentStatus==='A'? 'I':'A'}};
    return ApiService.v2().put('products/'+ productId, data);
  }
};
