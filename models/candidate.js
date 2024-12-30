const mongoose=require('mongoose');

const candidateSchema=mongoose.Schema({
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
    
    party:{
        type:String,
        enum:['Aam Aadmi Party (AAP)',
            'Bahujan Samaj Party (BSP)',
            'Bharatiya Janata Party (BJP)',
            'Communist Party of India (Marxist) (CPI(M))',
            'Indian National Congress (INC)',
            "National People's Party (NPP)"],
        required:true
    },

    age:{
        type:Number,
        required:true
    },

    educationalDetails:{
        type:String,
        required:false
    },

    NoCriminalCases:{
        type:Number,
        required:true
    },

    votes:[
        {
            voter_unique_id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'user',
                required:true
            },

            votedAt:{
                type:Date,
                default:Date.now()
            }
        }
    ],

    votesCount:{
        type:Number,
        default:0
    }

})