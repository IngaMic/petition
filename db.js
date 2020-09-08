const spicedPg = require("spiced-pg");
var db = spicedPg('postgres:postgres:postgres@localhost:5432/users');

module.exports.addInfo = (first, last, signature) => {
    return db.query(`
    INSERT INTO signatures (first, last, signature)
    VALUES ($1, $2, $3) RETURNING id `, [first, last, signature]);
};
module.exports.getInfo = () => {
    return db.query(`SELECT * FROM signatures`);
};

module.exports.getSignature = (id) => {
    return db.query(`
        SELECT signature FROM signatures WHERE id = ($1)`, [id]
    );
};
module.exports.getList = () => {
    return db.query(`
        SELECT * FROM signatures`
    );
};


module.exports.registerInfo = (first, last, email, password) => {
    return db.query(`
    INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4) RETURNING id `, [first, last, email, password]
    );
};
module.exports.getLogin = (logemail) => {
    return db.query(`
        SELECT * FROM users WHERE email = ($1)`, [logemail]
    );
};
module.exports.getRegistrationInfo = () => {
    return db.query(`SELECT * FROM users`);
};

module.exports.addProfile = (age, city, url, user_id) => {
    return db.query(`
    INSERT INTO profiles (age, city, url, user_id)
    VALUES ($1, $2, $3, $4) RETURNING id `, [age || null, city || null, url || null, user_id]);
};

module.exports.getProfile = () => {
    return db.query(`SELECT * FROM users
    JOIN profiles
    ON users.id = profiles.user_id
    JOIN signatures
    ON users.id = signatures.user_id
     `);
};
module.exports.getCity = (ct) => {
    db.query(`SELECT * FROM users
    JOIN profiles
    ON users.id = profiles.user_id
    JOIN signatures
    ON users.id = signatures.user_id
    WHERE LOWER(ct) = LOWER($1)`, [ct]);
}