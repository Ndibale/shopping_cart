const UserDetails = require('../models/userModel');

const authAdmin = async (req, res, next) => {
    try {
        // get user information by id
        const user = await UserDetails.findByIdAndUpdate({
            _id: req.user.id
        })
        if (user.role === 0) return res.status(400).send("Admin resources access denied")


        next();
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}
module.exports = authAdmin;