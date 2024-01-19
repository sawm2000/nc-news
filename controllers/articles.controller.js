const {
  selectArticleById,
  selectArticles,
  updateArticleById,
  addArticle,
} = require("../models/articles.model");
const { checkTopicExists } = require("./utils/checkTopicExists");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;

  const queries = [selectArticles(topic, sort_by, order)];

  if (topic) {
    const topicExists = checkTopicExists(topic);
    queries.push(topicExists);
  }
  Promise.all(queries)
    .then((response) => {
      const articles = response[0];
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;

  updateArticleById(article_id, body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticles = (req, res, next) => {
  const newArticle = req.body;

  addArticle(newArticle)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
