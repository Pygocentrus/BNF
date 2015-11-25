'use strict';

// NPM
let fs = require('fs');

// Modules
let Conf = require('../conf');

let Utils = {

  readFilePromisified: function(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, (err, data) => {
        if (!err && data) {
          resolve(data.toString());
        } else {
          reject(err);
        }
      });
    });
  },

  deleteFilePromisified: function(path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  isLink: function(link) {
    let pattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    return pattern.test(str);
  },

  generateUniqueId: function() {
    return Date.now() + Math.floor(Math.random() * 1000000000000);
  },

  getDayFromDate: function(date) {
    let rtDate = new Date(date);

    let formatedDate = [
      rtDate.getUTCFullYear(),
      "/",
      rtDate.getUTCMonth() + 1,
      "/",
      rtDate.getUTCDate()
    ].join('');

    return formatedDate;
  },

  timestampFromFileNameAws: function(filename, username) {
    if (filename && username) {
      // Remove username, special characters and file extension
      let timestamp = parseInt(filename
        .replace(username + Conf.vars.awsFileNameTimestampSeparator, '')
        .replace(/\.(jpg)|(jpeg)|(png)/, ''));

      // Check that parseInt worked successully
      if (!isNaN(timestamp)) {
        return timestamp
      }
      return 0;
    }
    return 0;
  },

  hoursAwayFromDate: function(date) {
    let rtShownDate = new Date(date);
    let diffDateInHours = Math.abs(new Date() - rtShownDate) / 36e5;

    return Math.round(diffDateInHours);
  },

};

module.exports = Utils;
