const db = require("../db/connection.js");

exports.selectCategories = () => {
    return db.query(`SELECT * FROM categories;`).then(({ rows: topics }) => {
        return topics;
    });
};