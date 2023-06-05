var jwt = require('jsonwebtoken');
const JWT_Secret = "secret";


const getuser = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({
        msg: 'No token, authorization denied'
    });

    try {
        const decoded = jwt.decode(token, JWT_Secret);
        req.user = decoded;
        next();

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = getuser;