import { expect } from "chai";
import * as Model from "./schedule";
import { DateTimePicker } from "@material-ui/pickers";
import moment from "moment";

describe("getAreas", () => {
  it("returns areas from model and areas", () => {
    const model = {
      areas: [
        {
          areaId: "1",
        },
        {
          areaId: "2",
        },
        {
          areaId: "4",
        },
      ],
    };
    const areas = [
      {
        _id: "1",
        name: "foo",
      },
      {
        _id: "2",
        name: "bar",
      },
      {
        _id: "3",
        name: "baz",
      },
    ];
    expect(Model.getAreas(model, areas)).to.eqls([
      {
        _id: "1",
        name: "foo",
      },
      {
        _id: "2",
        name: "bar",
      },
    ]);
  });
});
describe("canAddDateRange", () => {
  it("returns true of new date range is not overlapping with any one of periods; false otherwise", () => {
    let start = new Date("2020-08-01");
    let end = new Date("2020-08-03");
    let periods = [
      { startDate: new Date("2020-08-05"), endDate: new Date("2020-08-07") },
      { startDate: new Date("2020-08-09"), endDate: new Date("2020-08-14") },
    ];
    expect(Model.canAddDateRange(start, end, periods)).to.be.true;

    start = new Date("2020-08-04");
    end = new Date("2020-08-10");
    expect(Model.canAddDateRange(start, end, periods)).to.be.false;
  });
});

// describe("isInPeriod", () => {
//   it("returns true given date is in given period; false otherwise", () => {
//     let date = new Date("2020-08-06 12:00:00");
//     let period = {
//       startDate: new Date("2020-08-06 00:00:00"),
//       endDate: new Date("2020-08-07 00:00:00"),
//     };
//     expect(Model.isInPeriod(date, period)).to.be.true;
//     date = new Date("2020-08-08");
//     expect(Model.isInPeriod(date, period)).to.be.false;
//   });
// });

// describe("isScheduled", () => {
//   it("returns true if given date is scheduled; false otherwise", () => {
//     const model = {
//       areas: [
//         {
//           areaId: "1",
//           periods: [
//             {
//               startDate: new Date("2020-08-01"),
//               endDate: new Date("2020-08-04"),
//               dows: [
//                 Number(moment("2020-08-02").format("d")),
//                 Number(moment("2020-08-03").format("d")),
//               ],
//             },
//           ],
//         },
//       ],
//     };
//     expect(Model.isScheduled(model, "2", new Date("2020-08-02"))).to.be.false;
//     expect(Model.isScheduled(model, "1", new Date("2020-08-03"))).to.be.true;
//     expect(Model.isScheduled(model, "1", new Date("2020-08-01"))).to.be.false;
//     expect(Model.isScheduled(model, "1", new Date("2020-09-01"))).to.be.false;
//   });
// });
