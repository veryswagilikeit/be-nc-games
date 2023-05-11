const db = require("../db/connection.js");

exports.selectCategories = () => {
    return db.query(`SELECT * FROM categories;`).then(({ rows: topics }) => {
        return topics;
    });
};

exports.selectReviewById = (id) => {
    return db
        .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
        .then(({ rows }) => {
            return rows;
        })
        .then((review) => {
            if (!review.length) {
                return Promise.reject({
                    status: 404,
                    msg: "Not Found",
                });
            } else {
                return review[0];
            };
        });
};

exports.selectReviews = () => {
    return db
        .query(`SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, CAST (COUNT(comments.review_id) AS INT) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY created_at DESC;`)
        .then(({ rows: reviews }) => {
            return reviews;
        });
};

exports.selectCommentsByReviewId = (id) => {
    return db
        .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
        .then(({ rows: reviews }) => {
            if (!reviews.length) {
                return Promise.reject({
                    status: 404,
                    msg: "Not Found"
                });
            } else {
                return db
                    .query(`
                    SELECT comment_id, votes, created_at, author, body, review_id
                    FROM comments WHERE review_id = $1 ORDER BY created_at DESC;
                    `, [id]);
            };
        })
        .then(({ rows: comments }) => {
            return comments;
        });
};