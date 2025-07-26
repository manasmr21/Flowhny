const multer = require("multer");


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "uploads/thumbnails/");
    },
    filename: (req, file, cb)=>{
        const suffix = "thumbnail"
        cb(null, suffix + file.originalname)
    }
})

const upload = multer({storage});

module.exports = upload