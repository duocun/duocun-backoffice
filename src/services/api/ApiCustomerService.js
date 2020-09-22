import ApiService from 'services/api/ApiService';

const buildUserQuery = (userPage, userOffset, pageSize) => {
  let query = {};
  let s_query = {
    where: {},
    options: {}
  };
  
  s_query.options.limit = pageSize;
  s_query.options.skip = userOffset + pageSize * userPage;

  query.query = JSON.stringify(s_query);

  return query;
};

export default {
  queryUser: async (uPage, uOffset, pageSize) => {
    const query = buildUserQuery(uPage, uOffset, pageSize);
    return await ApiService.v2().get("messages/chatusers", query);
  }
}