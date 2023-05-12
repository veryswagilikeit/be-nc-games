const express = require("express");
const { getCategories, getEndpointJSON, getReviewById, getReviews, getCommentsByArticleId, postCommentByReviewId, patchReviewVotes } = require("./controllers/controller.js");

const app = express();
app.use(express.json())



app.get("/api", getEndpointJSON);

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsByArticleId);

app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.patch("/api/reviews/:review_id", patchReviewVotes);



app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad Request" });
    } else if (err.code === "23503") {
        res.status(404).send({ msg: "Not Found" });
    } else if (err.code === "23502") {
        res.status(400).send({ msg: "Bad Request" });
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