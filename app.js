const express = require("express");
const { getCategories, getEndpointJSON } = require("./controllers/controller.js");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api", getEndpointJSON);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Not Found "});
});

module.exports = app;