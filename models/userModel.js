const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new mongoose.Schema(
    {
        _id: {
            String
        },
        person: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: Number,
            default: 0
        },
        cart: {
            type: Array,
            default: []
        },
    },
       {
        timestamps: true
    }

)

module.exports= mongoose.model('UserDetails', userSchema)
