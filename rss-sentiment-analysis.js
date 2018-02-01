'use latest';
const parser = require('rss-parser-browser');
const sentiment = require('sentiment');

module.exports = function (ctx, done) {
  if (!ctx || !ctx.data || !ctx.data.url) {
    done('Please provide a valid RSS URL in the url parameter');
  }
  parser.parseURL(ctx.data.url, (err, parsed) => {
    if (err) done('Please provide a valid RSS URL in the url parameter');
    parsed.feed.entries.map(item => {
      item.analysis = sentiment(item.content);
      delete item.analysis.tokens;
      delete item.analysis.words;
    })
    done(null, { items: parsed.feed.entries });
  })
};
