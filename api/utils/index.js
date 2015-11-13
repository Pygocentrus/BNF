'use strict';

let fs = require('fs');

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

  isLink: function(link) {
    let pattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    return pattern.test(str);
  },

};

module.exports = Utils;
