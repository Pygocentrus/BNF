const Conf = {
  basicAuth: {
    user: 'admin',
    password: 'xxxx'
  },
  ports: {
    dev: 3000,
    staging: 8080,
    prod: 8080,
  },
  mongo: {
    dev: 'localhost',
    staging: 'localhost',
    prod: 'localhost',
  },
  twitterApi: {
    account: 'xxxx',
    accounts: ['xxxx'],
    tag: 'superbowl',
    accountId: '',
    consumer_key: 'xxxx',
    consumer_secret: 'xxxx',
    access_token: 'xxxx',
    access_token_secret: 'xxxx',
  },
  awsApi: {
    bucket: 'xxxx',
    server: 'https://s3-eu-west-1.amazonaws.com',
    accessKeyId: 'xxxx',
    secretAccessKey: 'xxxx',
    sessionToken: 'xxxx',
  },
  googleApi: {
    translateUrl: 'https://www.googleapis.com/language/translate/v2/detect?key=',
    shortenerUrl: 'https://www.googleapis.com/urlshortener/v1/url',
    apiKeyBack: 'xxxx',
    apiKeyFront: 'xxxx',
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
