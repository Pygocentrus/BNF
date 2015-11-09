let Conf = new (function() {
  this.env = 'dev';
  // this.twitterAccount = 'BBCBreaking';
  this.twitterAccount = 'lemondefr';
  this.devBase = 'http://localhost:3000';
  this.socketHost = this.env === 'prod' ? window.location.origin : this.devBase;
  this.liveTweetOffset = 25;
})();

export default Conf;
