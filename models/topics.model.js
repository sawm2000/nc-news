const db = require("../db/connection")
const fs = require("fs/promises")

exports.selectTopics = () => {
    return db.query("SELECT * FROM topics;").then((results) => {
        return results.rows;
      });
}

exports.selectEndpoints = () => {
  return fs.readFile ("endpoints.json", "utf8").then((results)=>{
    return JSON.parse(results)
  })
}