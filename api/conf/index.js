'use strict';

let Conf = {
  basicAuth: {
    user: 'admin',
    password: 'zRC6zqKbUgYtVUAXHYgWafyqYANY8z'
  },
  ports: {
    dev: 3000,
    staging: 8080,
    prod: 8080,
  },
  mongo: {
    dev: 'localhost/bfm',
    staging: 'localhost/bfm',
    prod: 'localhost/bfm',
  },
  twitterApi: {
    account: 'wild_touch',
    accounts: ['wild_touch'],
    tag: 'wild_touch',
    accountId: '',
    consumer_key: 'Nnh1RRFNuhkGKtsKOecwbg',
    consumer_secret: 'USZv8Hfgu2wof9CzjrNLPIw0Y8L9JK5xsA3sKVbKWM',
    access_token: '631187764-9a2mi6zKwNmShlUgsgQzcif0MvGSrv4iXkswPx6w',
    access_token_secret: 'Lg49ajDvqEcOV2jlIjX4XDS34COJE1ykc0ZwEjtkZmM',
  },
  awsApi: {
    bucket: 'wte-bnf',
    server: 'https://s3-eu-west-1.amazonaws.com',
    accessKeyId: 'AKIAIPDRFK5OZODPENPA',
    secretAccessKey: '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',
    sessionToken: '',
  },
  googleApi: {
    translateUrl: 'https://www.googleapis.com/language/translate/v2/detect?key=',
    shortenerUrl: 'https://www.googleapis.com/urlshortener/v1/url',
    apiKeyBack: 'AIzaSyCX6fZKIDl10FEmsSnqEpHMBw8YiCruMm0',
    apiKeyFront: 'AIzaSyC2xBJJswIpwGKSDHKXuwMzuXuhIXQRfIs',
    queryParam: '&q=',
  },
  vars: {
    liveTweetOffset: 25,
    displayedOffset: 100,
    awsCronJobPatternDelay: '0 * * * * *',
    awsTmpDownloadDirectory: 'api/downloads/',
    awsFileNameTimestampSeparator: '-',
  },
};

module.exports = Conf;

// FIXME: pierreguilhou app
// twitterApi: {
//   account: 'pierreguilhou',
//   tag: 'pierreguilhou',
//   accountId: '',
//   consumer_key: '9vLhRpf785U7ZTEQCuGMsYbLb',
//   consumer_secret: 'ZHU4E62FLYopxO3kIDSWYF0vkYSk9VRzKK1L1uTQtJS2XFKovo',
//   access_token: '2966847166-rt4hyHA8bWauhmSf77Ljaht35z38FWbw6CYRkEZ',
//   access_token_secret: '9o89vO7LfGGWyiP2R8FEIKZo6TUgMin8K6PDgpvXqpNDO',
// },

// FIXME: fpumir app
// twitterApi: {
//   account: 'fpumir',
//   tag: 'pierreguilhou',
//   accountId: '',
//   consumer_key: 'iTVsOZnLOTWUZis1jXMfeoUnj',
//   consumer_secret: 'NOK1MUggjvdKiNQnWy3M3w2bbhWyG6Q8IKI0d9XrnqYuNOjOAF',
//   access_token: '15333753-KBgCJ1aAVaLmIcXOfWH4qPQnOwLoBlc77v2vjxVgW',
//   access_token_secret: 'dtiOsdPPrvE32UmntzpFGPk6ArB00ezk3pX917uVi4D4B',
// },

// FIXME: wild_touch app
// twitterApi: {
//   account: 'wild_touch',
//   tag: 'wild_touch',
//   accountId: '',
//   consumer_key: 'Nnh1RRFNuhkGKtsKOecwbg',
//   consumer_secret: 'USZv8Hfgu2wof9CzjrNLPIw0Y8L9JK5xsA3sKVbKWM',
//   access_token: '631187764-9a2mi6zKwNmShlUgsgQzcif0MvGSrv4iXkswPx6w',
//   access_token_secret: 'Lg49ajDvqEcOV2jlIjX4XDS34COJE1ykc0ZwEjtkZmM',
// },
