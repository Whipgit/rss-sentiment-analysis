# rss-sentiment-analysis
The code in this repo is deployed on webtask.io as a CRON that runs every 5 minutes. It fetches news articles about bitcoin from two separate RSS feeds and does a sentiment analysis on the contents that are available. It then proceeds to store this data into an mLabs mongodb.

To trigger the process manually and see the values that are stored into the mongo, use the following URL: https://wt-63e5338129175d97f93fc7a5fbc0fc49-0.run.webtask.io/rss-sentiment-analysis

The articles and their sentiment scores are upserted into the mongo based on the article title.

After enough data has been gathered, another webtask will be made that fetches the last two weeks worth of data from the mongo and converts it to CSV. This GET will then be used in a googlesheet using the IMPORTDATA formula to do some analysis on the data.

Long term, I'm thinking of replacing the sentiment analysis with Amazon Comprehend to learn more about the articles through natural language processing.
