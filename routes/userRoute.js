const express=require('express');
const router=express.Router();
const user=require('../models/user');
const {jwtTokenGeneration,jwtTokenValidation}=require('../jwtAuth');

router.post('/signup',async(req,res)=>{  //endpoint for signup for a particular user
    try{
        const data=req.body;

        const newUserData=await new user(data);

        const responseData=await newUserData.save();
        
        const payLoad={
            userName:responseData.firstName,
            userId:responseData._id
        }

        const token=await jwtTokenGeneration(payLoad);

        console.log("Data successfully saved in the database");
        res.status(200).json({"response Data : ":responseData,"Token : ":token});
    }catch(err){
        console.log("Data cannot saved in the database");
        res.status(200).json({error:"Some error occured while saving the data in the database!"});     
    }
})

router.get('/login',async(req,res)=>{  //endpoint for a login of a user using username and password
    try{
        const data=req.body;
        const isValidUser=await user.findOne({adhaarNo:data.userId});

        if(!isValidUser){
            console.log("Invalid User Id (Unauthorised access)");
            res.status(401).json({message:"Invalid User Id (Unauthorised access)"});
        }else{
            const isMatchPassword=await isValidUser.isMatchPassword(data.password);

            if(isMatchPassword){
                const payLoad={
                    userName:isValidUser.firstName,
                    userId:isValidUser._id
                }
        
                const token=await jwtTokenGeneration(payLoad);
        
                console.log("Data successfully saved in the database");
                res.status(200).json({"response Data : ":isValidUser,"Token : ":token});
            }else{
                console.log("Invalid passord (Unauthorised access)");
                res.status(401).json({message:"Invalid password (Unauthorised access)"});
            }
        }
    }catch(err){
        console.log("Data cannot saved in the database");
        res.status(200).json({error:"Some error occured while saving the data in the database!"});     
    }
})

router.put('/update',jwtTokenValidation,async(req,res)=>{  //end point to update data for a particular voter
    try{
        const getVoterData=await user.findById(req.user.userId);

        if(!getVoterData){
            console.log("User deleted!");
            res.status(401).json({error:"User does not exist or deleted !"});
        }else{
            const responseData=await user.findByIdAndUpdate(req.user.userId,req.body,{
                new:true,
                runValidators:true
            })

            console.log("voter successfully saved in the database");
            res.status(200).json(responseData);
        }
    }catch(err){
        console.log("error from the server side");
        res.status(500).json({error:"Error form the server side!"});
    }
})

router.delete('/delete',jwtTokenValidation,async(req,res)=>{  //end point to delete data for a particular voter before his voting has been done 
    try{
        const getVoterData=await user.findById(req.user.userId);

        if(!getVoterData){
            console.log("Voter already deleted !");
            res.status(401).json({message:"Voter already deleted!"});
        }else if(getVoterData.isVoted===true){
            console.log("Voter already given vote hence data cannot be deleted");
            res.status(405).json({message:"Voter already given vote hence data cannot be deleted"});
        }else{
            await user.findByIdAndDelete(req.user.userId);
            res.status(200).json({message:"Voter successfully deleted"});
        }
    }catch(err){
        res.status(500).json({error:"Internal error occured in the server"});
    }
})

router.get('/',jwtTokenValidation,async(req,res)=>{  //endpoint to get data of  a particular voter
    try{
        const responseData=await user.find({_id:req.user.userId});

        if(!responseData){
            console.log("User does not exist in the database");
            res.status(405).json({message:"User already deleted!"});
        }else{
            res.status(200).json(responseData);
        }
    }catch(err){
        res.status(500).json({message:"Internal error in the database!"});
    }
})
module.exports=router;