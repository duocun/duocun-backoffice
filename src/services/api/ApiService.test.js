import ApiService, {API_HOST, API_V2_HOST} from "./ApiService";
import AuthService from "../AuthService";
import { expect } from "chai";

describe("Api service", () => {
  describe("buildUrl", () => {
    it("should prepend API host to given url", () => {
      const url = "test";
      expect(ApiService.v1().buildUrl(url)).to.equal(API_HOST + "/test");
    });
    it("should remove slash if given url already contains it", () => {
      const url = "/test";
      expect(ApiService.v1().buildUrl(url)).to.equal(API_HOST + "/test");
    });
    it("should build a query string for given parameter", () => {
      const url = "test";
      const param = {
        foo: "bar",
        bar: "baz"
      };
      expect(ApiService.v1().buildUrl(url, param)).to.equal(API_HOST + "/test?bar=baz&foo=bar");
    })
  });
  describe("buildAuthHeader", () => {
    it("should return empty object when user is not authenticated", () => {
      expect(ApiService.v1().buildAuthHeader()).to.eql({});
    });
    it("should return http header object when user is authenticated", () => {
      AuthService.login("test-token");
      expect(ApiService.v1().buildAuthHeader()).to.eql({
        headers: {
          Authorization: "Bearer test-token"
        }
      })
    })
  });
  describe("v2", () => {
    it("should set api v2 url", () => {
      const url = "test";
      const param = {
        foo: "bar",
        bar: "baz"
      };
      expect(ApiService.v2().buildUrl(url, param)).to.equal(API_V2_HOST + "/test?bar=baz&foo=bar");
    })
  });
})