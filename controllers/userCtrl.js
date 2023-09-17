const UserDetails  = require('../models/userModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config()

// const cloudinary = require('cloudinary').v2


const userCtrl = {
    register: async (req, res) => {
        try {
            const { person, email, password, role, cart, timestamps} = new UserDetails(req.body);

            const user = await UserDetails.findOne({ email });
            if (user) return res.status(400).json({ msg: 'The user already existed' })

            if (password.length < 8)
                return res.status(400).json({msg: 'There should be 8 characters in a password'})

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)
            // res.json({ password, passwordHash });
            const newUser = new UserDetails({
               person, email, password: passwordHash
            })


            // save to a database
            await newUser.save();
            // res.json({ msg: "Successful registered to a database" })
            //  To test on postman use => res.json(newUser);

            //  Create jsonWebToken to authentication
            const accessToken = createAccessToken({ id: newUser._id });
            const refreshToken = createRefreshToken({ id: newUser._id })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path:'/user/refresh_token'
            })
            res.json({accessToken});

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshToken;
            if (!rf_token) return res.status(400).json({msg:"Please login or register"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
                if(error) return res.status(400).json({msg:"Please login or register"})

                const accessToken = createAccessToken({id: user.id})

                // res.json({ user, accessToken });
                res.json({ accessToken });
            })

            // res.json({ rf_token });

        } catch (error) {
            res.json({ msg: error.message });
        }


    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await UserDetails.findOne({email})
            if(!user) return res.status(400).send("User does not found!")

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).send("Invalid Password!")

            // Login success
                const accessToken = createAccessToken({ id: user._id });
                const refreshToken = createRefreshToken({ id: user._id })

            res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    path:'/user/refresh_token'
                })
                res.json({accessToken});
        } catch (error) {
            res.json({msg: error.message})
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshToken', { path: '/user/refresh_token' });
            return res.status(200).send("Logout successfully")
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await UserDetails.findById(req.user.id).select('-password');
            // res.json(req.user);  //This gives out the id of the user
            if (!user) return res.status(400).json({ msg: "User does not exist" });

            res.json(user);
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}


const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = userCtrl;