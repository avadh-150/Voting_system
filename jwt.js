const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

const middleware = (req, res, next) => {
    // show the token is define or not define
    const head = req.headers.authorization;
    if (!head) {
        return res.status(401).json({ error: "Invalid token" });
    }
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: "No token provided" });

    }
    try {

        //verify that the token
        const decode = jwt.verify(token, process.env.TOKEN);
        // extract the token data ...
        req.user = decode;
        next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "internal error" });
    }
}


// generate a token
const genToken = (userDate) => {
    return jwt.sign(userDate, process.env.TOKEN, { expiresIn: 30000 });
}

module.exports = { middleware, genToken };

