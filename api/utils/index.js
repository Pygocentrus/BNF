'use strict';

let fs = require('fs');

let Utils = {

  readFilePromisified: function(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  },

};

module.exports = Utils;
