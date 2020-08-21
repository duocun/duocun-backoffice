import moment from "moment";
import { isDateRangeOverlapping } from "helper/index";

export const DEFAULT_MODEL = {
  _id: "new",
  title: "",
  description: "",
  areas: [],
  endTimeMargin: 0,
  startDate: moment(),
  endDate: moment().add("+1", "month")
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
