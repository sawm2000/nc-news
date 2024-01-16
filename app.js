const express = require("express");
const { getTopics, getEndpoints } = require("./controllers/topics.controller");

const {
  getArticleById,
  getArticles,
  patchArticleById
} = require("./controllers/articles.controller");

const {
  getComments,
  postComment,
} = require("./controllers/comments.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleById);

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42703") {
    res.status(400).send({ message: "Bad Request" });
  } else if (err.code === "23503") {
    if (err.constraint === "comments_article_id_fkey") {
      res.status(404).send({ message: "article_id Does Not Exist" });
    } else if (err.constraint === "comments_author_fkey") {
      res.status(400).send({ message: "Invalid Username" });
    }
  } else if (err.code === "23502") {
    res.status(400).send({ message: "Missing Required Fields" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Server Error" });
});

module.exports = app;
