'use latest';
const parser = require('rss-parser-browser');
const sentiment = require('sentiment');
const _ = require('lodash');
const mongo = require('mongodb').MongoClient;

const rssFeeds = [
  'https://cryptocurrencynews.com/category/basic-materials/daily-news/bitcoin-news/feed/',
  'http://bitcoin.worldnewsoffice.com/rss/category/1',
  ];

module.exports = (context, done) => {
  let arrayOfData = [];
  let mongoClient = {};
  Promise.all(rssFeeds.map(url => getRssSentiments(url)))
    .then(results => arrayOfData = _.flatMap(results))
    .then(() => connectToMongo(context.secrets.mongoUrl))
    .then(client => {
      mongoClient = client;
      return saveDataToMongo(mongoClient, arrayOfData);
    })
    .then(result => {
      mongoClient.close();
      done(null, arrayOfData);
    })
    .catch(err => done(err));
};

const getRssSentiments = url => {
  return new Promise((resolve, reject) => {
    if (!url) reject('Please provide a valid RSS URL in the url parameter');
    parser.parseURL(url, (err, parsed) => {
      if (err) reject('Please provide a valid RSS URL in the url parameter');
      parsed.feed.entries.forEach(item => item.sentiment = sentiment(item.contentSnippet).score);
      resolve(cleanData(parsed.feed.entries));
    });
  });
};

const cleanData = arr => {
  const propToKeep = ['creator', 'title', 'link', 'isoDate', 'sentiment'];
  return arr.map(item => _.pick(item, propToKeep));
};

const connectToMongo = url => {
  return mongo.connect(url)
   .then(client => {
     console.log('Connection to Mongo established!')
     return Promise.resolve(client);
   });
};

const saveDataToMongo = (mongoCLient, dataArray) => {
  const db = mongoCLient.db('rssanalysis');
  const sentiments = db.collection('sentiments');
  return Promise.all(dataArray.map(item => {
    return sentiments.updateOne({ title: item.title }, { $set: item }, { upsert: true });
  }));
};
