const express=require('express');
const router=express.Router();
const candidate=require('../models/candidate');
const admin=require('../models/admin');
const voter=require('../models/user');

const {jwtTokenGeneration,jwtTokenValidation}=require('../jwtAuth');

router.post('/add_new_candidate',jwtTokenValidation,async(req,res)=>{  //endpoint to add new candidate in the list by admin only
    try{
        const isValidAdmin=await admin.findById(req.user.userId);
        //console.log(isValidAdmin);
        if(!isValidAdmin){
            console.log("Unauthorised Access!");
            res.status(401).json({message:"Access denied due to unauthorised access!"});
        }else{
            const newCandidateData=await new candidate(req.body);
            
            console.log(newCandidateData);

            const responseData=await newCandidateData.save();

            res.status(200).json(responseData);
        }
    }catch(err){
        console.log("Data cannot be saved in the database");
        res.status(500).json({error:"Internal Server error"});
    }
})

router.put('/update_candidate/:id',jwtTokenValidation,async(req,res)=>{  //endpoints to update details of candidates
    try{
        const isvalidAdmin=await admin.findById(req.user.userId);

        if(!isvalidAdmin){
            console.log("You are not a valid admin!");
            res.status(401).json({message:"Unauthorized access "})
        }else{
            const id=req.params.id;
            const responseData=await candidate.findByIdAndUpdate(id,req.body,{
                new:true,
                runValidators:true
            });

            if(!responseData){
                console.log("Candidate does not exists in the database!");
                res.status(200).json({message:"Candidate data successfully updated!"});
            }else{
                console.log("Candidate successfully updated!");
                res.status(200).json(responseData);
            }
        }
    }catch(err){
        res.status(500).json({error:"Internal error in server!"});
    }
})

router.patch('/polling/:id',jwtTokenValidation,async(req,res)=>{  //end point for polling request by the voter for particular candidate
    try{
        const isValidVoter=await voter.findById(req.user.userId);

        if(!isValidVoter){
            console.log("Only valid voters can vote!");
            res.status.json({message:"You are not a valid voter only registered voter can participate in polling!"});
        }else{
            if(isValidVoter.isVoted==true){
                console.log("You have already given your poll cannot poll twice!");
                res.status(401).json({message:"You have already given you vote and cannot poll twice!"});
            }else{
                const candidateId=req.params.id;

                const getCandidateData=await candidate.findById(candidateId);
                console.log(getCandidateData);

                if(!getCandidateData){
                    console.log("Candidate does not exist in the database");
                    res.status(401).json({message:"Candidate does not exist in the database!"});
                }else{
                    await getCandidateData.votes.push({voter_unique_id:isValidVoter._id});
                    getCandidateData.votesCount=getCandidateData.votesCount+1;

                    await getCandidateData.save();

                    res.status(200).json({message:"Your vote has be recorded , thankyou for your participation in polling"});
                }
            }
        }
    }catch(err){
        res.status(500).json({message:"Internal server error!"});
    }
})
module.exports=router;