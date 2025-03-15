const Image= require('../models/image');
const { uploadTOCloudinary }= require('../helpers/cloudinary_helper');
const fs= require('fs');
const cloudinary=('../config/cloudinary')

const uploadImageController= async(req,res)=>{
  try{
    //check if file is missing in request object

    if(!req.file){
      return res.status(400).json({
        success:false,
        message: "file is required, please upload an image"
      })
    }

    //upload to cloudinary
    const {url, publicId}= await uploadTOCloudinary(req.file.path)

    //store the image url and public id along with the uploaded userId in databsse

    const newlyUPloadedImage= new Image({
      url,
      publicId,
      UploadedBy: req.userInfo.userId
    })

    await newlyUPloadedImage.save();

    //delete the file form local storage
    fs.unlinkSync(req.file.path)
    res.status(201).json({
      success:true,
      message: "image uploaded successfully",
      image: newlyUPloadedImage
    })


  }catch(error){
    console.log(error);
    res.status(500).json({
      success: false,
      message: "could not upload image, please try again later"
    })
  }

}


const fetchImageController= async(req,res)=>{
  try{
    const page= parseInt (req.query.page)||1;
    const limit= parseInt(req.query.limit)||5;
    const skip=(page-1)*limit;

    const sortBy= req.query.sortBy ||'createdAt';
    const sortOrder= req.query.sortOrder === 'asc'? 1:-1;

    const totalImages= await Image.countDocuments();
    const totalPages= Math.ceil(totalImages/limit);


    const sortObj= {};
    sortObj [sortBy]= sortOrder;
    
    const images= await Image.find().sort(sortObj).skip(skip).limit();
    if(images){
      res.status(200).json({
        success:true,
        currentPage:page,
        totalPages:totalPages,
        totalImages: totalImages,
        data:images
      })
    }

  }catch(error){
    console.log(error);
    res.status(500).json({
      success:true,
      message: "could not fetch images"
    })

  }
}


const deleteImageController = async (req, res) => {
  try {
    const getCurrentIdOfImageToBeDeleted = req.params.id;
    const userId = req.userInfo.userId;

    // Find the image in the database
    const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Check if the image was uploaded by the current user
    if (image.UploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this image as you didn't upload it.",
      });
    }

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Delete the image from MongoDB
    await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

    // Send success response
    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the image",
    });
  }
};

module.exports={
  uploadImageController,
  fetchImageController,
  deleteImageController
};