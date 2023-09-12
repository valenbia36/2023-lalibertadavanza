
const bcrypt = require("bcryptjs");

const encrypt = async (passwordPlain) => {
    const hash = await bcrypt.hash(passwordPlain, 10);
    return hash;
}

const compare = async (passwordPlain, hashPassword) => {
    const isMatch = await bcrypt.compare(passwordPlain, hashPassword);
    return isMatch;
}

module.exports = {encrypt, compare};