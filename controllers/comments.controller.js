const {selectComments, addComment} = require("../models/comments.model")

exports.getComments = (req, res, next) => {
    const {article_id} = req.params

    selectComments(article_id).then((comments)=>{
        res.status(200).send({comments})
    }).catch((err)=>{
        next(err)
    })
}

exports.postComment = (req, res, next) => {
    const {article_id} = req.params
    const newComment = req.body
    
    addComment(article_id, newComment).then((comment)=>{
    res.status(201).send({comment})
    }).catch((err)=>{
    next(err)
    })
    }