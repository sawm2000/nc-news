const db = require("../../db/connection")

exports.checkArticleExists = (article_id) => {
    return db.query(`
    SELECT * FROM articles WHERE article_id = $1
    `,[article_id]).then((results)=>{
        if(results.rows.length === 0){
            return Promise.reject({ status: 404, message: "Article Does Not Exist" });
        }
    })
}