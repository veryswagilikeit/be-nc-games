const { selectCategories, selectReviewById, selectReviews, selectCommentsByReviewId, insertCommentByReviewId, updateReviewVotes, removeCommentById, selectUsers } = require("../models/model")
const endpointsJSON = require("../endpoints.json");

exports.getEndpointJSON = (req, res, next) => {
    res.status(200).send(endpointsJSON);
};

exports.getCategories = (req, res, next) => {
    selectCategories().then((categories) => {
        res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
    const id = req.params.review_id;
    selectReviewById(id)
        .then((review) => {
            res.status(200).send({ review });
        })
        .catch(next);
};

exports.getReviews = (req, res) => {
    selectReviews().then((reviews) => {
        res.status(200).send({ reviews });
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
    const id = req.params.review_id;
    selectCommentsByReviewId(id)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch(next);
};

exports.postCommentByReviewId = (req, res, next) => {
    const id = req.params.review_id;
    const usernameBodyObj = req.body;
    insertCommentByReviewId(id, usernameBodyObj)
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch(next);
};

exports.patchReviewVotes = (req, res, next) => {
    const id = req.params.review_id;
    const votesObj = req.body;
    updateReviewVotes(id, votesObj)
        .then((review) => {
            res.status(200).send({ review });
        })
        .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
    const id = req.params.comment_id;
    removeCommentById(id)
        .then(() => {
            res.sendStatus(204);
        })
        .catch(next);
};

exports.getUsers = (req, res, next) => {
    selectUsers()
        .then((users) => {
            res.status(200).send({ users });
        })
        .catch(next);
};