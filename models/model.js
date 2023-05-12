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

exports.insertCommentByReviewId = (id, usernameBodyObj) => {
    const insertQuery = `INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;`;
    const { username, body } = usernameBodyObj;
    const params = [id, username, body];

    return db
        .query(insertQuery, params)
        .then(({ rows }) => {
            if (typeof body !== "string") {
                return Promise.reject({
                    status: 400,
                    msg: "Bad Request",
                });
            };
            return rows[0];
        });
};

exports.updateReviewVotes = (id, votesObj) => {
    const updateQuery = `UPDATE reviews SET votes=votes+ $2 WHERE review_id = $1 RETURNING *;`;
    const params = [id, votesObj.inc_votes];

    return db
        .query(updateQuery, params)
        .then(({ rows: review }) => {
            if (!review.length) {
                return Promise.reject({
                    status: 404,
                    msg: "Not Found"
                });
            } else {
                return review[0];
            };
        });
};

exports.removeCommentById = (id) => {
    return db
        .query(`DELETE FROM comments where comment_id = $1 RETURNING *;`, [id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({
                    status: 404,
                    msg: "Not Found"
                });
            };
        });
};