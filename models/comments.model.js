const db = require("../db/connection")

exports.selectComments = (article_id) => {
    return db
    .query("SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC;", [
      article_id,
    ]).then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, message: "article does not exist" });
        }
        return result.rows;
      });
}