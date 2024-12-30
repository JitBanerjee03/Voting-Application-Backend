const express=require('express');
const app=express();
const db=require('./db');
const bodyParser=require('body-parser');
require('dotenv').config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.get('/',async(req,res)=>{
    res.send("Wellcome to voting app");
})

//requiring userRoute 
const userRoute=require('./routes/userRoute');
app.use('/voter',userRoute);

//requiring candidateRoute
const candidateRoute=require('./routes/candidateRoute');
app.use('/candidate',candidateRoute);

//requiring adminRoute
const adminRoute=require('./routes/adminRoute');
app.use('/admin',adminRoute);

app.listen(process.env.PORT,()=>{
    console.log("Server is live now !");
})