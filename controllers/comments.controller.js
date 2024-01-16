const { selectComments, addComment } = require("../models/comments.model");

const { checkArticleExists } = require("./utils/checkArticleExists");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  const queries = [selectComments(article_id), checkArticleExists(article_id)];

  Promise.all(queries)
    .then((response) => {
      const comments = response[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  addComment(article_id, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
    }
