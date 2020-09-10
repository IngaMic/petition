const spicedPg = require("spiced-pg");
var db = spicedPg(process.env.DATABASE_URL || 'postgres:postgres:postgres@localhost:5432/users');

module.exports.addInfo = (signature, userid) => {
    return db.query(`
    INSERT INTO signatures (signature, userid)
    VALUES ($1, $2) RETURNING id `, [signature, userid]);
};
module.exports.getInfo = () => {
    return db.query(`SELECT * FROM users`);
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
    ON users.id = signatures.userid
     `);
};
module.exports.getCity = (city) => {
    return db.query(`SELECT first, last FROM users
    JOIN profiles
    ON users.id = profiles.user_id
    JOIN signatures
    ON users.id = signatures.userid
    WHERE LOWER(city) = LOWER($1)`, [city]);
};
module.exports.getpersonalProfile = (userid) => {
    return db.query(`SELECT * FROM users
    JOIN profiles
    ON users.id = profiles.user_id
    JOIN signatures
    ON users.id = signatures.userid
    WHERE users.id = ($1)`, [userid]);
};

module.exports.deleteSignature = (userid) => {
    return db.query(
        `DELETE FROM signatures WHERE userid = ($1)`, [userid]);
};

module.exports.updateProfile = (first, last, email, password, age, city, url, userid) => {
    return db.query(`INSERT INTO profiles (first, last, email, password, age, city, url)
    VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id
    ON CONFLICT(first, last, email, password, age, city, url)
    DO UPDATE SET first, last, email, password, age, city, url` , [first, last, email, password, age, city, url, userid]);
}


