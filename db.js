const spicedPg = require("spiced-pg");
var db = spicedPg('postgres:postgres:postgres@localhost:5432/users');

module.exports.addInfo = (first, last, signature) => {
    return db.query(`
    INSERT INTO users (first, last, signature)
    VALUES ($1, $2, $3) RETURNING id `, [first, last, signature]);
};
module.exports.getInfo = () => {
    return db.query(`SELECT * FROM users`);
};

module.exports.getSignature = (id) => {
    return db.query(`
        SELECT signature FROM users WHERE id = ($1)`, [id]
    );
};
module.exports.getList = () => {
    return db.query(`
        SELECT first, last FROM users`
    );
};


module.exports.registerInfo = (first, last, email, password) => {
    return db.query(`
    INSERT INTO usersdata (first, last, email, password)
    VALUES ($1, $2, $3, $4) RETURNING id `, [first, last, email, password]);
};
module.exports.getLogin = (loginId) => {
    return db.query(`
        SELECT password FROM usersdata WHERE id = ($1)`, [loginId]
    );
};
module.exports.getRegistrationInfo = () => {
    return db.query(`SELECT * FROM usersdata`);
};
