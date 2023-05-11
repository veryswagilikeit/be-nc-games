const db = require("../db/connection.js");

exports.selectCategories = () => {
    return db.query(`SELECT * FROM categories;`).then(({ rows: topics }) => {
        return topics;
    });
};




exports.selectReviews = () => {
    return db
        .query(`SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, CAST (COUNT(comments.review_id) AS INT) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY created_at DESC;`)
        .then(({ rows: reviews }) => {
            return reviews;
        });
};
