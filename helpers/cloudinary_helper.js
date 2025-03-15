const cloudinary= require("../config/cloundinary");

const uploadTOCloudinary = async (filePath) => {
  try {
      const result = await cloudinary.uploader.upload(filePath);
      return {
          url: result.secure_url,
          publicId: result.public_id,
          
      };
  } catch (error) {
      console.error('Error while uploading to Cloudinary:', error.message);
      throw new Error('Error while uploading to Cloudinary');
  }
};

module.exports={
  uploadTOCloudinary
}