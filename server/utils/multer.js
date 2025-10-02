const multer = require("multer");


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        if(file.fieldname == "thumbnail"){
            cb(null, "uploads/thumbnails/");
        }else{
            cb(null, "uploads/images/");
        }
    },
    filename: (req, file, cb)=>{
        const suffix = `${file.fieldname === "thumbnail" ? "thumbnail_" : "product-image_"}`
        const newName = file.originalname.replace(/ /g, "_")
        cb(null, Date.now() + "_" + suffix + newName)
    }
})

const upload = multer({storage});

module.exports = upload