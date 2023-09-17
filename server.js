require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
const path = require('path');
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
    useTempFiles: true
}))

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/uploadRouter'))


// connect to mongoDB
mongoose.set("strictQuery", false);
const URI = process.env.TESTING_URL
mongoose.connect(URI, {
    useNewUrlParser: true,

    useUnifiedTopology: true

}, err => {
    if (err) throw err;


    console.log('Connected Successfully to a Database')
})




const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
