const {
  selectArticleById,
  selectArticles,
  updateArticleById,
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
  const { topic } = req.query;

  const queries = [selectArticles(topic)];

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
