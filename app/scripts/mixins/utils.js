import Conf from '../conf/conf';

let UtilsMixins = {

  isUrl(str) {
    let pattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    return pattern.test(str);
  },

  generateUniqueKey(base = '') {
    return base + Math.floor(Math.random() * 1000000000000);
  },

  twitterUserLink(username) {
    return 'http://twitter.com/' + username;
  },
  
  twitterPostLink(postId) {
    return 'http://twitter.com/' + Conf.twitterAccount + '/status/' + postId;
  },

};

export default UtilsMixins;
