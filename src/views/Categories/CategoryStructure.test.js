import { traverseCategoryData } from "views/Categories/CategoryStructure";
import { expect } from "chai";
describe("traverseCategoryData", () => {
  it("should traverse each node in data and trigger given callback function", () => {
    const arrayIDs = [];
    const callback = (node) => {
      arrayIDs.push(node.categoryId);
    }
    const DEFAULT_STRUCTURE_DATA = [
      {
        categoryId: "1",
        name: "Home",
        children: [
          {
            categoryId: "2",
            name: "Food & Drinks",
            children: [
              {
                categoryId: "3",
                name: "Snacks"
              },
              {
                categoryId: "4",
                name: "Beverage"
              }
            ]
          },
          {
            categoryId: "5",
            name: "Fashion & Lingeries",
            children: [
              {
                categoryId: "6",
                name: "Men"
              },
              {
                categoryId: "7",
                name: "Women"
              }
            ]
          }
        ]
      },
      {
        categoryId: "8",
        name: "FAQ",
        children: [
          {
            categoryId: "9",
            name: "Contact Us"
          }
        ]
      }
    ];
    traverseCategoryData(DEFAULT_STRUCTURE_DATA, callback);
    expect(arrayIDs).to.eqls(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  });
});