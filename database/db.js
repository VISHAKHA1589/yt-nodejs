const mongoose= require('mongoose');
const connectToDB= async()=>{
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('mongodb connected succesfully')
  }catch(e){
    console.error('mongodb connection failed');
    process.exit(1);
  }
}

module.exports= connectToDB;