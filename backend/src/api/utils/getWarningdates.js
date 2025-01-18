const getWarningDates = () => {
  const now = new Date();
  return {
    oneMonthAhead: new Date(now.setMonth(now.getMonth() + 1)),
    oneWeekAhead: new Date(now.setDate(now.getDate() + 7)),
    oneDayAhead: new Date(now.setDate(now.getDate() + 1)),
  };
};
