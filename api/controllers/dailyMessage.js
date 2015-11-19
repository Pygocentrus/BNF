'use strict';

var mongoose = require('mongoose'),
    _        = require('lodash');

// Modules
var DailyPhotoMessage = require('../models/DailyPhotoMessage'),
    Conf              = require('../conf'),
    Utils             = require('../utils');

let dailyPhotoMessageCtrl = {

  getLatestMessage(cb) {
    // Find latest message
    DailyPhotoMessage
      .find()
      .sort({ date: 'desc' })
      .limit(1)
      .exec((err, message) => {
        if (err || !message) {
          cb.call(this, err, null);
        } else {
          cb.call(this, null, message);
        }
      });
  },

  newLatestMessage(data, cb) {
    if (!data || !data.content) {
      cb.apply({ err: 401 }, null);
    }

    let dpm = new DailyPhotoMessage();
    dpm.content = data.content;

    // Save a new daily message
    dpm.save((err, message) => {
      if (err || !message) {
        cb.call(this, err, null);
      } else {
        cb.call(this, null, message);
      }
    });
  },

  createOrUpdateLatestMessage(message, cb) {
    let todayDate = Utils.getDayFromDate(Date.now());
    let messageDate = Utils.getDayFromDate(message.date);

    // Compare today's date with desired message's date
    if (messageDate != todayDate) {
      // Create a new message because we didn't find today's
      let dpm = new DailyPhotoMessage();
      dpm.content = message.content;
      dpm.save((err, msg) => {
        if (err || !msg) {
          cb.call(this, err, null);
        } else {
          cb.call(this, null, msg);
        }
      });
    } else {
      // Update existing for today
      DailyPhotoMessage
        .findOne({ _id: message._id })
        .exec((err, msg) => {
          if (err || !msg) {
            cb.call(this, err, null);
          } else {
            // Update the message
            msg.content = message.content
            msg.date =  Date.now();
            msg.save((err2, updatedMsg) => {
              if (err2 || !updatedMsg) {
                cb.call(this, err2, null);
              } else {
                cb.call(this, null, updatedMsg);
              }
            });
          }
        });
    }
  },

  updateLatestMessageFromId(message, cb) {
    // Find latest message
    DailyPhotoMessage
      .findOne({ _id: message._id })
      .exec((err, msg) => {
        if (err || !msg) {
          cb.call(this, err, null);
        } else {

          // Update the message
          msg.content = message.content
          msg.date =  Date.now;

          msg.save((err2, updatedMsg) => {
            if (err2 || !updatedMsg) {
              cb.call(this, err2, null);
            } else {
              cb.call(this, null, updatedMsg);
            }
          });
        }
      });
  },

};

export default dailyPhotoMessageCtrl;
