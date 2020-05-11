import queryString from "query-string";
import moment, * as moments from "moment";

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
  return countProductQuantityFromOrders(
    dir === "after"
      ? orders.filter(order => order.deliverDate >= date)
      : orders.filter(order => order.deliverDate <= date),
    productId
  );
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

//debounce not really good

// export function debounce(func, args, wait, immediate = false) {
// 	var timeout;
// 	return function() {
// 		var context = this;
// 		var later = function() {
//       timeout = null;
// 			if (!immediate) func.call(context, args);
// 		};
// 		var callNow = immediate && !timeout;
// 		clearTimeout(timeout);
// 		timeout = setTimeout(later, wait);
// 		if (callNow) func.call(context, args);
// 	};
// };
