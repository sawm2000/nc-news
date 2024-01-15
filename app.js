const express = require("express");
const {getTopics} = require("./controllers/topics.controller")

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);


app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send("Server Error")
})


module.exports = app;