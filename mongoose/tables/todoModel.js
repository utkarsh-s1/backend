import mongoose from "mongoose";
import { type } from "os";
 
const todoSchema  = mongoose.Schema({
    content:{
        type:String,
        required:true,
        default:""
    },
    complete:{
        type:Boolean,
        default:false,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User" // same name by which we made table , not name stieed in tbale  
    },
    subTodos:[
       { type:mongoose.Schema.Types.ObjectId,
        ref:"SubTodoTable"}


    ] // array of subtofos

}, {timestamps:true})

const todoTable  = mongoose.model("TodoTable", todoSchema)