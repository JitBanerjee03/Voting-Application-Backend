const mongoose=require('mongoose');
require('dotenv').config();

const MONGO_LOCAL_URL=process.env.MONGO_LOCAL_URL;
mongoose.connect(MONGO_LOCAL_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,  
})

const db=mongoose.connection;

db.on('connected',()=>{console.log("Database connected")});
db.on('disconnected',()=>{console.log("Database disconnected")});

module.exports=db;