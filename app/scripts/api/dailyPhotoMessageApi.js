// NPM
import io from 'socket.io-client';

// Modules
import Conf from '../conf/conf';
import DailyPhotoMessageActions from '../actions/DailyPhotoMessageActions';
import DailyPhotoMessageConstants from '../constants/DailyPhotoMessageConstants';

// Socket io Instance
let socket = io.connect(Conf.socketHost);

let dailyPhotoMessageApi = {

  getLatestMessage() {
    socket.emit('dashboard:daily-photo-msg:latest');
    socket.on('dashboard:daily-photo-msg:latest', (data) => {
      if (data && data.message && data.message.length) {
        DailyPhotoMessageActions.setLatestMessage(data);
      }
    });
  },

  postNewMessage(message) {
    socket.emit('dashboard:daily-photo-msg:new', { content: message });
    socket.on('dashboard:daily-photo-msg:new', (data) => {
      if (data.message) {
        DailyPhotoMessageActions.newLatestMessageApi(data);
      }
    });
  },

  updateMessage(message) {
    socket.emit('dashboard:daily-photo-msg:update', message);
    socket.on('dashboard:daily-photo-msg:update', (data) => {
      if (data.message) {
        DailyPhotoMessageActions.updateLatestMessageApi(data);
      }
    });
  },

};

export default dailyPhotoMessageApi;
