import ApiStatisticsService from 'services/api/ApiStatisticsService';


export const setStatisticsSummary = payload => {
  return {
    type: 'SET_STATISTICS_SUMMARY',
    payload
  }
}

// async actions
export const loadStatisticsSummaryAsync = (startDate, endDate) => {
  return (dispatch) => {
    return ApiStatisticsService.getSummary(startDate, endDate).then(
      ({data}) => {
        dispatch(setStatisticsSummary(data.data));
      }
    );
  }
}