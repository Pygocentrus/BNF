let Conf = new (function() {
  this.env = 'dev';
  this.devBase = 'http://localhost:3000';
  this.socketHost = this.env === 'prod' ? window.location.origin : this.devBase;
})();

export default Conf;