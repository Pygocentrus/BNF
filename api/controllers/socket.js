class SocketManager {

  contructor(socketServer) {
    console.log('Hello motherfucker');
    
    this.io = socketServer;

    // this.io.on('connexion', this._handleConnexion.bind(this));
    this.io.on('connexion', (socket) => {
      console.log('Suprise!', socket);
    });
  }

  _handleConnexion(socket) {
    var _this = this;

    console.log(this);

    // New client connected
    this.io.emit('test', { foo: 'great' });

    socket.on('dashboard:daily-tweets:all', () => {
  		_this.io.emit('dashboard:daily-tweets:all', { answer: 'all!' });
  	});

  	socket.on('dashboard:daily-tweets:new', () => {
			_this.io.emit('dashboard:daily-tweets:new', { answer: 'new!' });
  	});

  	socket.on('dashboard:daily-tweets:remove', () => {
			_this.io.emit('dashboard:daily-tweets:remove', { answer: 'removed!' });
  	});
  }

  _sendDailyTweets() {
    this.socketServer.emit('dashboard:daily-tweets:all', { answer: 'all!' });
  }

};

export default SocketManager;
