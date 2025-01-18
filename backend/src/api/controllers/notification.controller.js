const NotificationModel = require("../models/notification.model");

exports.getNotifications = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const notifications = await NotificationModel.find({
      userId,
      read: false,
    });
    return res.json(notifications);
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
