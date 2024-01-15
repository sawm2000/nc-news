const express = require("express");
const { getTopics, getEndpoints } = require("./controllers/topics.controller");

const { getArticleById } = require("./controllers/articles.controller");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else if (err.code === "22P02") {
    res.status(400).send({ message: "Bad Request" });
  } else {
   console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = app;
