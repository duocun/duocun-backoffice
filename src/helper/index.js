import queryString from "query-string";

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
      skip: page * pageSize,
    },
  };
  if (fields && fields.length) {
    const projection = {};
    fields.forEach((field) => {
      projection[field] = true;
    });
    query.options.projection = projection;
  }
  if (sort && sort.length) {
    query.options.sort = sort;
  }
  return JSON.stringify(query);
};

export const groupAttributeData = (flatData) => {
  const groupData = [];
  flatData.forEach((data) => {
    const dataInGroup = groupData.find(
      (groupData) => groupData.attrIdx === data.attrIdx
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
        valIndices: [data.valIdx],
      });
    }
  });
  return groupData;
};

export const getAllCombinations = (groupData) => {
  if (!groupData.length) {
    return [];
  }
  if (groupData.length === 1) {
    return groupData[0].valIndices.map((valIdx) => [
      {
        attrIdx: groupData[0].attrIdx,
        valIdx,
      },
    ]);
  }
  const result = [];
  const restCombinations = getAllCombinations(groupData.slice(1));
  for (let i = 0; i < restCombinations.length; i++) {
    for (let j = 0; j < groupData[0].valIndices.length; j++) {
      result.push([
        {
          attrIdx: groupData[0].attrIdx,
          valIdx: groupData[0].valIndices[j],
        },
        ...restCombinations[i],
      ]);
    }
  }
  return result;
};

//dateString parser

export const toDateString = (s = null) => {
  return s ? s.split("T")[0] : "";
};
