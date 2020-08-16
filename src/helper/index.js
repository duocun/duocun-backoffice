import queryString from "query-string";
import moment, * as moments from "moment";

const MEDIA_PATH = "https://s3.amazonaws.com/pictures.duocun.ca/media";

export const getQueryParam = (location, key) => {
  if (location.search) {
    const parsed = queryString.parse(location.search);
    if (parsed[key]) {
      return parsed[key];
    } else {
      return "";
    }
  } else {
    return "";
  }
};

/**
 * @param {int} page needs to start from zero
 * @param {int} pageSize
 * @param {object} condition
 * @param {Array} fields
 * @returns string
 */
export const buildPaginationQuery = (
  page = 0,
  pageSize = 10,
  condition = {},
  fields = [],
  sort = []
) => {
  const query = {
    where: condition,
    options: {
      limit: pageSize,
      skip: page * pageSize
    }
  };
  if (fields && fields.length) {
    const projection = {};
    fields.forEach(field => {
      projection[field] = true;
    });
    query.options.projection = projection;
  }
  if (sort && sort.length) {
    query.options.sort = sort;
  }
  return JSON.stringify(query);
};

// build query without pagination
export const buildQuery = params => {
  return buildPaginationQuery(null, null, params, [], []);
};

export const groupAttributeData = flatData => {
  const groupData = [];
  flatData.forEach(data => {
    const dataInGroup = groupData.find(
      groupData => groupData.attrIdx === data.attrIdx
    );
    if (dataInGroup) {
      if (dataInGroup.valIndices) {
        dataInGroup.valIndices.push(data.valIdx);
      } else {
        dataInGroup.valIndices = [data.valIdx];
      }
    } else {
      groupData.push({
        attrIdx: data.attrIdx,
        valIndices: [data.valIdx]
      });
    }
  });
  return groupData;
};

export const getAllCombinations = groupData => {
  if (!groupData.length) {
    return [];
  }
  if (groupData.length === 1) {
    return groupData[0].valIndices.map(valIdx => [
      {
        attrIdx: groupData[0].attrIdx,
        valIdx
      }
    ]);
  }
  const result = [];
  const restCombinations = getAllCombinations(groupData.slice(1));
  for (let i = 0; i < restCombinations.length; i++) {
    for (let j = 0; j < groupData[0].valIndices.length; j++) {
      result.push([
        {
          attrIdx: groupData[0].attrIdx,
          valIdx: groupData[0].valIndices[j]
        },
        ...restCombinations[i]
      ]);
    }
  }
  return result;
};

export const getDateRangeStrings = (days, startDate = undefined) => {
  const ret = [];

  for (let i = 0; i < days; i++) {
    ret.push(
      moment(startDate)
        .add(i, "days")
        .format("YYYY-MM-DD")
    );
  }
  return ret;
};

export const getDateStrArrayBetween = (startDate, endDate) => {
  for (
    var arr = [], dt = new Date(moment(startDate));
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(
      moment(dt)
        .local()
        .format("YYYY-MM-DD")
    );
  }
  return arr;
};

export const countProductQuantityFromOrders = (orders, productId) => {
  let count = 0;
  orders.forEach(order => {
    if (order.items && order.items.length) {
      order.items
        .filter(item => item.productId === productId)
        .forEach(item => {
          count += item.quantity;
        });
    }
  });
  return count;
};

export const countProductFromDate = (
  date,
  orders,
  productId,
  dir = "after"
) => {

  let todayString = moment()
    .local()
    .format("YYYY-MM-DD");

  if (todayString === date) {
    return 0;
  }

  let afterToday = todayString <= date;
  let ordersToCount = afterToday
    ? orders.filter(
        order => order.deliverDate <= date && order.deliverDate > todayString
      )
    : orders.filter(
        order => order.deliverDate > date && order.deliverDate <= todayString
      );
  let count = countProductQuantityFromOrders(ordersToCount, productId);
  // if (productId === "5e82ad721a577a3df456edf5") {
  //   console.log("todayString", todayString);
  //   console.log("date", date);
  //   console.log("ordersToCount", ordersToCount);
  //   console.log("count ", count);
  // }
  if (afterToday) {
    return count;
  } else {
    return -1 * count;
  }
};

export const getPictureUrl = src => {
  // const [fname, ext] = src.split('.');
  return `${MEDIA_PATH}/${src}`;
};

//dateString parser

export const toDateString = (s = null) => {
  return s
    ? moments
        .utc(s)
        .local()
        .format("YYYY-MM-DD")
    : "";
};

export const arrayToggleElem = (arr, elem) => {
  const elemIndex = arr.indexOf(elem);
  if (elemIndex === -1) {
    arr.push(elem);
  } else {
    arr.splice(elemIndex, 1);
  }
  return arr;
};

export const enumLikeObj = obj => {
  const enumObj = { ...obj };
  for (const key in enumObj) {
    enumObj[enumObj[key]] = key;
  }
  return enumObj;
};
