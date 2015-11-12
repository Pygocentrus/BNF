let Conf = new (function() {
  // this.env = 'prod';
  this.env = 'dev';
  this.twitterAccount = 'lemondefr';
  this.devBase = 'http://localhost:3000';
  this.socketHost = this.env === 'prod' ? window.location.origin : this.devBase;
  // this.socketHost = this.env === 'prod' ? window.location.origin.replace(/^http\s?\:/, '') : this.devBase;
  this.port = this.env === 'prod' ? 8080 : 3000;
  this.liveTweetOffset = 25;
})();

export default Conf;
