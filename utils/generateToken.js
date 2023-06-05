const jwt = require("jsonwebtoken");
const JWT_Secret = "secret";

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_Secret, {
        expiresIn: "1d",
    });
};

module.exports = generateToken;