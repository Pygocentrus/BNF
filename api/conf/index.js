let Conf = {
  ports: {
    dev: 3000,
    staging: 8080,
    prod: 8080,
  },
  mongo: {
    dev: 'localhost/bfm',
    staging: '',
    prod: '',
  },
  twitterApi: {
    account: 'FoxNews',
    tag: 'FoxNews',
    accountId: '',
    consumer_key: 'hqRgWDRUaKmgUTAoaHw40n7VN',
    consumer_secret: '6A8ARe38WP29uU2KNCHqi485e61DOrMAXnanJHoTjTmlBZpBr6',
    access_token: '2966847166-UIfU2urCpyuRWh9yBksth2CNGYPR4cjv1XU6ARq',
    access_token_secret: 's9snLH571Uk5UyGu679ie7su1gvghvXw0niCZq69cj36M',
  },
  vars: {
    liveTweetOffset: 25,
  },
};

export default Conf;
