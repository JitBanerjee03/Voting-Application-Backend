const express=require('express');
const router=express.Router();
const candidate=require('../models/candidate');
const admin=require('../models/admin');
const {jwtTokenGeneration,jwtTokenValidation}=require('../jwtAuth');


router.post('/add new candidate',jwtTokenValidation,async(req,res)=>{  //endpoint to add new candidate
    try{
        const isValidAdmin=await admin.findById(req.user.userId);

        if(!isValidAdmin){
            console.log("You are not a admin!");
            res.status(401).json({message:"Authorization Denied!"});
        }else{
   
            const newCandidate=new candidate(req.body);

            const responseData=await newCandidate.save();

            res.status(200).json(responseData);
        }
    }catch(err){
        console.log("Data cannot be saved in the database");
        res.status(200).json({error:"Internal error in the server side"});     
    }
})

module.exports=router;