const { selectCategories } = require("../models/model")
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