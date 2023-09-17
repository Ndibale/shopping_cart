const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    _id: {
        String
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
}, {
    timestamps:true
});


module.exports = mongoose.model("Categories", categorySchema);