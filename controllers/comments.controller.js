const {
  selectComments,
  addComment,
  removeCommentById,
  updateCommentById,
} = require("../models/comments.model");

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
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.patchCommentsById = (req, res, next) => {
  const { comment_id } = req.params;
  const body = req.body;

  updateCommentById(comment_id, body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};