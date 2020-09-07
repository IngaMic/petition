const bcryptjs = require("bcryptjs");
//generate salt, hash and decript passwords
// they all async, they work with callback. We use promises
let { genSalt, hash, compare } = bcryptjs;
const { promisify } = require("util");

genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

module.exports.compare = compare;
//make it so it generates the salt and then had the password:
module.exports.hash = plainTextPasswordFromUser => genSalt().then(salt => hash(plainTextPasswordFromUser, salt));