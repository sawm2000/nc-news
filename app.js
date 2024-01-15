const express = require("express");
const {getTopics, getEndpoints} = require("./controllers/topics.controller")

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints)


app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send("Server Error")
})


module.exports = app;