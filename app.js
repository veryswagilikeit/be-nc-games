const express = require("express");
const { getCategories, getEndpointJSON, getReviews } = require("./controllers/controller.js");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api", getEndpointJSON);






app.get("/api/reviews", getReviews);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Not Found "});
});

module.exports = app;