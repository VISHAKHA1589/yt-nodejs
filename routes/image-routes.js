const express= require('express');

const router= express.Router();
const authMiddleware= require("../middleware/auth-middleware")
const adminMiddleware= require("../middleware/admin-middleware");
const uploadMiddleware= require("../middleware/upload-middleware");
const {uploadImageController}= require("../controllers/image-controller") 
const {fetchImageController}= require("../controllers/image-controller")

const {deleteImageController}= require("../controllers/image-controller")


//upload the image
//auth, admin and multer middleware
router.post('/upload',authMiddleware, adminMiddleware,uploadMiddleware.single('image'), uploadImageController)





//get all the images

router.get("/get",authMiddleware, fetchImageController);

router.delete("/:id",authMiddleware, adminMiddleware,deleteImageController);

module.exports= router