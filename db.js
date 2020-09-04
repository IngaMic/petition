const spicedPg = require("spiced-pg");
var db = spicedPg('postgres:postgres:postgres@localhost:5432/users');

module.exports.getInfo = () => {
    return db.query(`SELECT * FROM users`);
};
module.exports.addInfo = (first, last, signature) => {
    return db.query(`
    INSERT INTO users (first, last, signature)
    VALUES ($1, $2, $3) RETURNING * `, [first, last, signature]);
};