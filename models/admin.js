const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const adminSchema=mongoose.Schema({
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
    
    email:{
        type:String,
        required:false
    },

    age:{
        type:Number,
        required:true
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

adminSchema.pre('save',async function(next){
    
    try{
        const adminData=this;

        if(adminData.isModified('password')){
            const salt=await bcrypt.genSalt(10);
            const hashPassword=await bcrypt.hash(adminData.password,salt);

            adminData.password=hashPassword;
            next();
        }else{
            next();
        }
    }catch(err){
        next(err);
    }
})

adminSchema.methods.isMatchPassword=async function(adminPassword){
    try{
        const isValidPassword=await bcrypt.compare(adminPassword,this.password);

        return isValidPassword;
    }catch(err){
        return err;
    }
}
const adminModel=mongoose.model('admin',adminSchema);

module.exports=adminModel;
