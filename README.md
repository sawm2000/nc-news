# Northcoders News API


# Hosted version

https://nc-news-c0co.onrender.com

# Summary

This project allows users to access a range of endpoints as shown by /api. These endpoints allow users to view news articles, comments and  user information with various queries available.

# Setting up 

clone the repo
   https://github.com/sawm2000/nc-news.git


```bash
npm install 
```

setup .env files
 
- Create .env.test file
     -- add PGDATABASE= nc_news_test

- Create .env.development file
     -- add PGDATABASE= nc_news

- Create .env.production file
    -- add DATABASE_URL=<your_database_url>


seed local database

```bash
npm run setup-dbs 
```
```bash
npm run seed-prod
```

run tests
```bash
 npm run test app.test.js 
```
# minimum versions  
  Node.js: v21.2.0
  Postgres: 14.10
