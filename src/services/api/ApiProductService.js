import ApiService from "services/api/ApiService";
import { buildPaginationQuery } from "helper/index";
export default {
  getProductList: (page, pageSize, search = "", params = null, sort = []) => {
    let query = {};
    if (!search) {
      const condition = params && typeof params === "object" ? params : {};
      query.query = buildPaginationQuery(page, pageSize, condition, [], sort);
    } else {
      const condition =
        params && typeof params === "object"
          ? {
              ...params,
              name: {
                $regex: search
              }
            }
          : {
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
  getProductDeliveries: id => {
    return ApiService.v2().get(`products/delivery/${id}`);
  },

  changeStatus: (productId, currentStatus) => {
    const data = { data: { status: currentStatus === "A" ? "I" : "A" } };
    return ApiService.v2().put("products/" + productId, data);
  },

  updateProduct: (productId, data) => {
    return ApiService.v2().put("products/" + productId, { data });
  },

  uploadPicture: (file, productId) => {
    const formData = new FormData();
    formData.append("upload", file);
    return ApiService.v2().post(
      `products/imageUpload?productId=${productId}`,
      formData
    );
  }
};
