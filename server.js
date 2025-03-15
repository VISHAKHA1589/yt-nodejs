require('dotenv').config();
const express= require('express');
const connectToDB= require('./database/db');
connectToDB();
const authRoutes= require('./routes/auth-routes');
const homeRoutes= require('./routes/home-routes');
const adminRoutes= require('./routes/admin-routes');
const uploadImageRoutes= require('./routes/image-routes')

const app= express();

//middleware

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes)
const PORT= process.env.port || 3000

app.listen(PORT, ()=>{
  console.log(`server is now listening to port ${PORT}`)
});