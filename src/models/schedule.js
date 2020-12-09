import moment from "moment";
import { isDateRangeOverlapping } from "helper/index";

export const DEFAULT_MODEL = {
  _id: "new",
  title: "",
  description: "",
  isSpecial: false,
  areas: [],
  endTimeMargin: 0,
  startDate: moment(moment().format("YYYY-MM-DD 00:00:00")).toDate(),
  endDate: moment(moment().format("YYYY-MM-DD 00:00:00"))
    .add("+1", "month")
    .toDate()
};

export const getAreas = (model, areas) => {
  if (!model.areas) {
    return [];
  }
  return model.areas
    .map(area => {
      return areas.find(a => a._id === area.areaId);
    })
    .filter(area => !!area);
};

export const canAddDateRange = (start, end, periods) => {
  //eslint-disable-next-line no-unused-vars
  for (let period of periods) {
    if (isDateRangeOverlapping(start, end, period.startDate, period.endDate)) {
      return false;
    }
  }
  return true;
};

export const getPeriods = (model, areaId) => {
  if (!model || !model.areas) {
    return [];
  }
  const area = model.areas.find(area => area.areaId === areaId);
  if (!area) {
    return [];
  }
  return area.periods || [];
};

export const isInPeriod = (date, period) => {
  const dateStr = moment(date).format("YYYY-MM-DD");
  const startDate = moment(period.startDate).format("YYYY-MM-DD");
  const endDate = moment(period.endDate).format("YYYY-MM-DD");
  return startDate <= dateStr && dateStr <= endDate;
};

export const convertDataToModel = data => {
  data.startDate = new Date(data.startDate);
  data.endDate = new Date(data.endDate);
  data.areas.forEach(area => {
    area.periods.forEach(period => {
      period.startDate = new Date(period.startDate);
      period.endDate = new Date(period.endDate);
    });
  });
  return data;
};

export const isScheduled = (model, areaId, date) => {
  const areaSchedule = model.areas.find(schedule => schedule.areaId === areaId);
  if (!areaSchedule) {
    return false;
  }
  const period = areaSchedule.periods.find(p => isInPeriod(date, p));
  if (!period) {
    return false;
  }
  return period.dows.includes(Number(moment(date).format("d")));
};

export const validate = model => {
  if (!model.title) {
    throw new Error("Please input title");
  }
  if (!model.areas || !model.areas.length) {
    throw new Error("Please add areas");
  }
};
