import * as helper from "./index.js";
import moment from "moment";
import { expect } from "chai";

describe("helper", () => {
  describe("getQueryParam", () => {
    const location = {
      pathname: "/products",
      search: "?page=5&sort=2",
      hash: "",
      state: undefined
    };
    it("should return query param", () => {
      expect(helper.getQueryParam(location, "page")).to.equals("5");
      expect(helper.getQueryParam(location, "sort")).to.equals("2");
    });
    it("should return empty string if query key is missing", () => {
      expect(helper.getQueryParam(location, "abc")).to.equals("");
    });
  });
  describe("buildPaginationQuery", () => {
    const page = 2;
    const pageSize = 20;
    const condition = {
      "status": 1
    };
    const fields = ["name", "description"];
    const sort = [["name", 1]];
    it("should set where, limit and skip", () => {
      expect(helper.buildPaginationQuery()).to.equals(JSON.stringify({
        where: {},
        options: {
          limit: 10,
          skip: 0
        }
      }))
    });
    it("should correctly set limit and skip options", () => {
      expect(helper.buildPaginationQuery(page, pageSize)).to.equals(JSON.stringify({
        where: {},
        options: {
          limit: 20,
          skip: 40
        }
      }));
    });
    it("should correctly set where condition", () => {
      expect(helper.buildPaginationQuery(page, pageSize, condition)).to.equals(JSON.stringify({
        where: {
          status: 1
        },
        options: {
          limit: 20,
          skip: 40
        }
      }));
    });
    it("should correctly set projection option", () => {
      expect(helper.buildPaginationQuery(page, pageSize, condition, fields)).to.equals(JSON.stringify({
        where: {
          status: 1,
        },
        options: {
          limit: 20,
          skip: 40,
          projection: {
            name: true,
            description: true
          }
        }
      }))
    });
    it("should correctly set sort option", () => {
      expect(helper.buildPaginationQuery(page, pageSize, condition, fields, sort)).to.equals(JSON.stringify({
        where: {
          status: 1,
        },
        options: {
          limit: 20,
          skip: 40,
          projection: {
            name: true,
            description: true
          },
          sort: [["name", 1]]
        }
      }))
    })
  });

  const flatData = [{
    attrIdx: 2,
    valIdx: 3
  }, {
    attrIdx: 2,
    valIdx: 4
  }, {
    attrIdx: 3,
    valIdx: 2
  }, {
    attrIdx: 1,
    valIdx:1
  }, {
    attrIdx: 3,
    valIdx: 4
  }];
  const groupData = [{
    attrIdx: 2,
    valIndices: [3,4]
  }, {
    attrIdx: 3,
    valIndices: [2,4]
  }, {
    attrIdx: 1,
    valIndices: [1]
  }];

  describe("groupAttributeData", () => {
    
    it("should group given flat attribute data", () => {
      expect(helper.groupAttributeData(flatData)).to.eqls(groupData);
    });
  });
  describe("getAllCombinations", () => {
    it("should get all combinations", () => {
      const result = helper.getAllCombinations(groupData);
      expect(result).to.eqls([
        [
          {
            attrIdx: 2,
            valIdx: 3
          }, {
            attrIdx: 3,
            valIdx: 2
          }, {
            attrIdx: 1,
            valIdx: 1
          }
        ], [
          {
            attrIdx: 2,
            valIdx: 4
          }, {
            attrIdx: 3,
            valIdx: 2
          },{
            attrIdx: 1,
            valIdx: 1
          }
        ], [
          {
            attrIdx: 2,
            valIdx: 3
          }, {
            attrIdx: 3,
            valIdx: 4
          }, {
            attrIdx: 1,
            valIdx: 1
          }
        ], [
          {
            attrIdx: 2,
            valIdx: 4
          },{
            attrIdx: 3,
            valIdx: 4
          }, {
            attrIdx: 1,
            valIdx: 1
          }
        ]
      ]);
    });
  });
  describe("getDateRangeStrings", () => {
    it("should return date range strings", () => {
      let startDate = "2020-05-09";
      expect(helper.getDateRangeStrings(3, startDate)).to.eqls([
        "2020-05-09",
        "2020-05-10",
        "2020-05-11"
      ]);
    });
  });
  describe("getDateStrArrayBetween", () => {
    it("should return date string array between two dates", () => {
      let startDate = moment("1993-06-19").local();
      let endDate = moment("1993-12-17").local();
      const arr = helper.getDateStrArrayBetween(startDate, endDate);
      expect(arr.length).not.to.eql(0);
      expect(arr[0]).to.eql("1993-06-19");
      expect(arr[arr.length - 1]).to.eql("1993-12-17");
    });
  });
  // describe("toDateString", () => {
  //   it("should convert date to string", () => {
  //     let date = "2020-05-09";
  //     expect(helper.toDateString(new Date(date))).to.eql(date);
  //   });
	// });
	describe('arrayToggleElem', () => {
		context('when element not exists in the array', () => {
			it('pushes the given element', () => {
				const arr = [0, 1, 2];
				expect(helper.arrayToggleElem(arr, 3)).to.eql([0, 1, 2, 3]);
			});
		});
		context('when element exists in the array', () => {
			it('removes the given element', () => {
				const arr = [0, 1, 2];
				expect(helper.arrayToggleElem(arr, 2)).to.eql([0, 1]);
			});
		});
	});
});
