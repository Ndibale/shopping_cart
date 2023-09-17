const router = require('express').Router();
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');



// To upload image in the cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


// upload image to cloud
router.post('/upload', (req, res) => {
    try {
        // console.log(req.files)

        if (!req.files && req.Object?.keys(req.files.file).length() === 0)
            return res.status(400).json({msg:"No file uploaded"})

        const file = req?.files?.file;
        if ( file  > 1024*1024) return res.status(400).json({msg:"File is too big"})

        if (file?.mimetype !== 'image/jpeg' && file?.mimetype !== 'image/png')
            return res.status(400).json({ msg: "File format is not supported" })

        cloudinary.uploader.upload(file?.tempFilePath, { folder: "test" }, async (error, result) => {
            if (error) throw error;

            res.json({result})
        })

        res.json('test upload')
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

module.exports = router;