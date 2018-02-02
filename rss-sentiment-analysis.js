'use latest';
const parser = require('rss-parser-browser');
const sentiment = require('sentiment');
const rssFeeds = [
  'https://cryptocurrencynews.com/category/basic-materials/daily-news/bitcoin-news/feed/',
  ];

module.exports = function (done) {
  getRssData(rssFeeds[0]).then(results => done(null, results))
};

const getRssData = url => {
  return new Promise((resolve, reject) => {
    if (!url) reject('Please provide a valid RSS URL in the url parameter');
    parser.parseURL(url, (err, parsed) => {
      if (err) reject('Please provide a valid RSS URL in the url parameter');
      parsed.feed.entries.map(item => {
        item.analysis = sentiment(item.content);
        delete item.analysis.tokens;
        delete item.analysis.words;
      });
      resolve(null, parsed.feed);
    });
  });
};
