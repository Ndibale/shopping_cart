const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]||[]
        if (!token) return res.status(400).json({ msg: "You are not authorized" });

        jwt.verify(token.toString(), process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if (error) {
                return res.status(400).json({ msg: error.message })
            } else {
                if (token === null) return res.status(401).json({ msg: "Token is null" })
            };

            req.user = user;
            next();
        });
    } catch (error) {
        res.status(500).json(error.message)
    }
}

module.exports = auth;