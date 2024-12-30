const jwt=require('jsonwebtoken');
require('dotenv').config();

const jwtTokenGeneration=async(payLoad)=>{
    try{
        const token=await jwt.sign(payLoad,process.env.SECKET_KEY,{expiresIn:30000});
        return token;
    }catch(err){
        return err
    }
}

const jwtTokenValidation=async(req,res,next)=>{
    
    try{
        const authorization=req.headers.authorization;

        if(!authorization){
            console.log("Token not found please login and then continue");
            res.status(401).json({message:"Token not found please login then continue"});
        }else{
            const token=authorization.split(' ')[1];
    
            const payLoadDecoded=await jwt.verify(token,process.env.SECKET_KEY);
    
            req.user=payLoadDecoded;

            next();
        }
    }catch(err){
        next(err);
    }
}

module.exports={jwtTokenGeneration,jwtTokenValidation};