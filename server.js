const express=require('express');
const app=express();
const db=require('./db');
const candidate=require('./models/candidate');

const bodyParser=require('body-parser');
require('dotenv').config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.get('/',async(req,res)=>{
    res.send("Wellcome to voting app");
})

//this is the api request for the current number of votes for the registered candidates
app.get('/poll-update',async(req,res)=>{
    try{
        const responseData=await candidate.find().sort({votesCount:-1});  //getting the data in sortted order of the votes
        console.log(responseData);

        if(!responseData){
            res.status(401).json({message:"Poll is not started yet!"});
        }

        const curPollResult=responseData.map((curObject)=>{
            const obj={
                "First name":curObject.firstName,
                "Middle name":curObject.middleName,
                "Last name":curObject.lastName,
                "Age":curObject.age,
                "Party":curObject.party,
                "Vote Count":curObject.votesCount
            }
            
            console.log(obj);
            return obj;
        });

        res.status(200).json(curPollResult);
    }catch(err){
        res.status(500).json({error:"Internal server error!"});
    }
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