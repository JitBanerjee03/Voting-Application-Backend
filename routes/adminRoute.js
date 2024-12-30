const express=require('express');
const router=express.Router();
const admin=require('../models/admin');
const {jwtTokenGeneration,jwtTokenValidation}=require('../jwtAuth');
const db=require('../db');

router.post('/signup',async(req,res)=>{  //endpoint for signup for admin
    try{
        let count=await db.collection('admins').countDocuments();

        if(count>0){
            console.log("System cannot have multiple admins");
            res.status(401).json({message:"System cannot have multiple admins!"});
        }else{
            const data=req.body;

            const newAdminData=await new admin(data);
    
            const responseData=await newAdminData.save();
            
            const payLoad={
                userName:responseData.firstName,
                userId:responseData._id
            }
    
            const token=await jwtTokenGeneration(payLoad);
    
            console.log("Data successfully saved in the database");
            res.status(200).json({"response Data : ":responseData,"Token : ":token});
        }
        
    }catch(err){
        console.log("Data cannot saved in the database");
        res.status(200).json({error:"Some error occured while saving the data in the database!"});     
    }
})

router.get('/login',async(req,res)=>{  //endpoint for login for admin
    try{
        const data=req.body;
        const isValidAdmin=await admin.findOne({adhaarNo:data.userId});
        console.log(isValidAdmin);
        if(!isValidAdmin){
            console.log("Invalid User Id (Unauthorised access)");
            res.status(401).json({message:"Invalid User Id (Unauthorised access)"});
        }else{
            console.log("Hello World");
            const isMatch=await isValidAdmin.isMatchPassword(data.password);
            console.log(isMatch);
            if(isMatch){
                const payLoad={
                    userName:isValidAdmin.firstName,
                    userId:isValidAdmin._id
                }
        
                const token=await jwtTokenGeneration(payLoad);
        
                res.status(200).json({"response Data : ":isValidAdmin,"Token : ":token});
            }else{
                console.log("Invalid passord (Unauthorised access)");
                res.status(401).json({message:"Invalid password (Unauthorised access)"});
            }
        }
    }catch(err){
        res.status(200).json({error:"Some error occured while saving the data in the database!"});     
    }
})

router.put('/update',jwtTokenValidation,async(req,res)=>{  //end point to update data for admin
    try{
        const getAdminData=await admin.findById(req.user.userId);

        if(!getAdminData){
            console.log("User deleted!");
            res.status(401).json({error:"User does not exist or deleted !"});
        }else{
            const responseData=await admin.findByIdAndUpdate(req.user.userId,req.body,{
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

router.delete('/delete',jwtTokenValidation,async(req,res)=>{  //end point to delete data for admin
    try{
        const getAdminData=await admin.findById(req.user.userId);

        if(!getAdminData){
            console.log("Voter already deleted !");
            res.status(401).json({message:"Voter already deleted!"});
        }else{
            const responseData=await admin.findByIdAndDelete(req.user.userId);
            res.status(405).json({message:"Admin deleted successfully !"});
        }
    }catch(err){
        res.status(500).json({error:"Internal error occured in the server"});
    }
})

router.get('/',jwtTokenValidation,async(req,res)=>{  //endpoint to get data of  a particular voter
    try{
        const responseData=await admin.find({_id:req.user.userId});

        if(!responseData){
            console.log("Admin does not exist in the database");
            res.status(405).json({message:"Admin already deleted!"});
        }else{
            res.status(200).json(responseData);
        }
    }catch(err){
        res.status(500).json({message:"Internal error in the database!"});
    }
})

module.exports=router;