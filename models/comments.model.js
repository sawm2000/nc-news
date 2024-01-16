const db = require("../db/connection")

exports.selectComments = (article_id) => {
    return db
    .query("SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC;", [
      article_id,
    ]).then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, message: "Article Does Not Exist" });
        }
        return result.rows;
      });
}

exports.addComment = (article_id, newComment) =>{
  const {username, body} = newComment
  return db
  .query(
  `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
  [username, body, article_id]
  ).then((result) => {
  if (result.rows.length === 0) {
  return Promise.reject({ status: 404, message: "Article Does Not Exist" });
  }
  return result.rows[0];
  });
  }