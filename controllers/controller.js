const { selectCategories, selectReviewById, selectReviews } = require("../models/model")
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