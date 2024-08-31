import mongoose from "mongoose";
import { type } from "os";


const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    email:{
        type:String,
        required:[true, "error compulsory "] // required and error messga eif not fulffiled
    },
    isrts:Boolean
}, {timestamps: true}) // auto adds createdAt and updatedAt 

const User = mongoose.model("User", userSchema) //in mongodb stored as users model