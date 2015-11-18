let Conf = new (function() {
  // this.env = 'prod';
  this.env = 'dev';
  this.twitterAccount = 'pierreguilhou';
  // this.twitterAccount = 'wild_touch';
  // this.twitterAccount = 'PierreGuilhou';
  this.devBase = 'http://localhost:3000';
  this.socketHost = this.env === 'prod' ? window.location.origin : this.devBase;
  this.port = this.env === 'prod' ? 8080 : 3000;
  this.liveTweetOffset = 25;
})();

export default Conf;
