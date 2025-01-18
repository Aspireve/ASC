const NotificationModel = require("../models/notification.model");
const { getWarningDates } = require("../utils/getWarningdates");

exports.getNotifications = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    // Get the warning dates
    const { oneMonthAhead, oneWeekAhead, oneDayAhead } = getWarningDates();

    // Fetch notifications filtered by userId and warning dates
    const notifications = await NotificationModel.find({
      userId,
      read: false,
      dateToDisplay: { $gte: new Date(), $lte: oneMonthAhead },
    });

    // Optionally group by the warning periods
    const groupedNotifications = {
      oneDayAhead: notifications.filter(
        (notif) => notif.dateToDisplay <= oneDayAhead
      ),
      oneWeekAhead: notifications.filter(
        (notif) =>
          notif.dateToDisplay > oneDayAhead &&
          notif.dateToDisplay <= oneWeekAhead
      ),
      oneMonthAhead: notifications.filter(
        (notif) =>
          notif.dateToDisplay > oneWeekAhead &&
          notif.dateToDisplay <= oneMonthAhead
      ),
    };

    return res.json(groupedNotifications);
  } catch (error) {
    next(error);
  }
};

exports.setNotificationAsread = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const notification = await NotificationModel.findById(notificationId);
    notification.read = true;
    await notification.save();
    return res.json(notification);
  } catch (error) {
    next(error);
  }
};
