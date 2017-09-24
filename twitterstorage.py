#!/usr/bin/env

## Uses the library located at https://github.com/ckoepp/TwitterSearch
## Uses the mysqlclient-python library: https://github.com/PyMySQL/mysqlclient-python, https://mysqlclient.readthedocs.io/
from TwitterSearch import *
import configparser
import MySQLdb

config = configparser.ConfigParser()
config.read('config.ini')

tso = TwitterSearchOrder()
tso.set_keywords(['MRO']) # define all words to look for
tso.set_language('en') # we want to see English tweets only
tso.set_include_entities(True)

try:
    ts = TwitterSearch(
        consumer_key = config['TWITTER']['consumer_key'],
        consumer_secret = config['TWITTER']['consumer_secret'],
        access_token = config['TWITTER']['access_token'],
        access_token_secret = config['TWITTER']['access_token_secret'],
        verify=True
    )

    tso.set_search_url(tso.create_search_url() + '&tweet_mode=extended')

    for tweet in ts.search_tweets_iterable(tso):
        print( 'id: %s @%s tweeted: %s' % ( tweet['id'], tweet['user']['screen_name'], tweet['full_text'] ))

except TwitterSearchException as e:
	print(e)
	exit()

db=MySQLdb.connect(host=config['DB']['host'],
                  user=config['DB']['user'],
                  passwd=config['DB']['password'],
                  db=config['DB']['schema'],
                  use_unicode=True,
                  charset="utf8mb4")

cursor = db.cursor()

for tweet in ts.search_tweets_iterable(tso):
    try:
        insertstring = "INSERT INTO tweets (tweet_id, author_id, author_username, tweet_text, time_detected) VALUES (%s, %s, %s, %s, NOW());"
        cursor.execute(insertstring, (tweet['id'], tweet['user']['id'], tweet['user']['screen_name'], tweet['full_text']))
    except ConnectionError as e:
        print(e)

db.commit()
cursor.close()
db.close()

