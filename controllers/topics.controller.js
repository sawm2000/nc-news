const {selectTopics, selectEndpoints} = require("../models/topics.model")

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics)=>{
        res.status(200).send({topics})
    })
}

exports.getEndpoints = (req, res, next) => {
    selectEndpoints().then((endpoints)=>{
        res.status(200).send({endpoints})
    })
}