const express = require("express");
const { getCategories, getEndpointJSON } = require("./controllers/controller.js");
const { getCategories, getReviewById } = require("./controllers/controller.js");

const app = express();

app.get("/api", getEndpointJSON);

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Not Found "});
});

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad Request "});
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    if ("status" in err) {
        res.status(err.status).send({ msg: err.msg });
    };
});

module.exports = app;