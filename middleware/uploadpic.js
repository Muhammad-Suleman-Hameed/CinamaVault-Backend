const multer = require('multer');
const path = require('path');
const express = require('express')
const ap = express();

ap.use('/profile', express.static('./images')) 

const storage = multer.diskStorage({
    destination: './images',
    filename: (req, file , callback) => {
        return callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({
    storage: storage
})

ap.post( '/upload' , upload.single('profile') ,  (req, res) =>{
     console.log(req.file);
     res.json({
        sucess: 1,
        profile_url: `http;//localhost:4000/profile/${req.file.filename}`
     })
})

ap.listen(4000)
console.log('Running on port 4000')
