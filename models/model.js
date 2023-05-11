const db = require("../db/connection.js");

exports.selectCategories = () => {
    return db.query(`SELECT * FROM categories;`).then(({ rows: topics }) => {
        return topics;
    });
};

exports.selectReviewById = (id) => {
    return db
        .query(`SELECT * FROM reviews WHERE reviews.review_id = $1;`, [id])
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