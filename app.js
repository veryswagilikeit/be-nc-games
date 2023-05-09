const express = require("express");
const { getCategories } = require("./controllers/controller.js");

const app = express();

app.get("/api/categories", getCategories);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Not Found "});
});

module.exports = app;