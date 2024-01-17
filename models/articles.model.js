const db = require("../db/connection")

exports.selectArticleById = (article_id, ) =>{
    return db
    .query(`SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, articles.body, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [article_id])
  .then((result)=>{
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Article Does Not Exist" });
    }
    return result.rows[0];
  })
}


exports.selectArticles = (topic) => {

let queryString = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url ,
COUNT(comments.comment_id) AS comment_count
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id`

const queryParams = []

if(topic){
  queryString += `  WHERE topic = $1`
  queryParams.push(topic)
}

queryString += `
GROUP BY articles.article_id
ORDER BY articles.created_at DESC
; `

    return db
    .query(queryString, queryParams)
    .then((results) => {
      return results.rows;
    });
}

exports.updateArticleById = (article_id, body) =>{
  const {inc_votes} = body

  if(Object.keys(body).length === 0){
    return db.query(`SELECT * FROM articles WHERE article_id = ${article_id} `).then((result)=>{
      return result.rows[0];
    })
  }
  if(!inc_votes){
    return Promise.reject({ status: 400, message: "Invalid Patch Query" });
  }

  return db.query(
    `
    UPDATE articles
  SET votes = votes + $1
  WHERE article_id = ${article_id} 
  RETURNING *`,
      [inc_votes]
  ).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Article Does Not Exist" });
    }
    return result.rows[0];
  });
}