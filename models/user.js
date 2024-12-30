const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },

    middleName:{
        type:String,
        required:false
    },

    lastName:{
        type:String,
        required:true
    },
    
    address:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:false
    },

    phoneNo:{
        type:Number,
        required:false
    },

    age:{
        type:Number,
        required:true
    },

    isVoted:{
        type:Boolean,
        default:false
    },

    adhaarNo:{
        type:Number,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },
})

userSchema.pre('save',async function(next){
    
    try{
        const userData=this;

        if(userData.isModified('password')){
            const salt=await bcrypt.genSalt(10);
            const hashPassword=await bcrypt.hash(userData.password,salt);

            userData.password=hashPassword;
            console.log(userData.password);
            next();
        }else{
            next();
        }
    }catch(err){
        next(err);
    }
})

userSchema.methods.isMatchPassword=async(userPassword)=>{
    try{
        const isMatch=await bcrypt.compare(userPassword,this.password);
        return isMatch;
    }catch(err){
        return err;
    }
}

const userModel=mongoose.model('user',userSchema);

module.exports=userModel;