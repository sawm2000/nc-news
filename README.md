# Northcoders News API


# Hosted version

https://nc-news-c0co.onrender.com

# Summary

This project allows users to access a range of endpoints as shown by /api. These endpoints allow users to view news articles, comments and  user information with various queries available.

# Setting up 

1. clone the repo
   https://github.com/sawm2000/nc-news.git

2. npm install express --save
3. npm install jest
4. npm install --save-dev supertest
4. npm install pg
6. npm install dotenv
7. npm install pg-format
8. npm install jest-sorted --save-dev

9. setup .env files
Create .env.test file
     add PGDATABASE= nc_news_test

Create .env.development file
     add PGDATABASE= nc_news

Create .env.production file
     add DATABASE_URL=postgres://qzmhaoee:x7Vp-bMi8VW6cXkt_LuDB_fwJ7-Br08z@rogue.db.elephantsql.com/qzmhaoee

10. seed local database 
 npm run setup-dbs 
 npm run seed-prod

11. run tests
    npm run test app.test.js 

# minimum versions  
  Node.js: v21.2.0
  Postgres: 14.10