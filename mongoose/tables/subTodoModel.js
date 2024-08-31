import mongoose from "mongoose";
 
const subTodoSchema  = mongoose.Schema({
    content:{
        type:String,
        required:true,
        default:""
    },
    complete:{
        type:Boolean,
        default:false,
    }
}, {timestamps:true})

const SubTodoTable  = mongoose.model("SubTodoTable", subTodoSchema)