import mongoose from "mongoose";

const orderItemSchema =  mongoose.Schema({
    product:
    {
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true

    }
})


const orderSchema = mongoose.Schema({
     user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
     },
     order:{
        type:[orderItemSchema]
     },
     status:{
        type:String,
        enum:["PENIDNG","COMPLETED"],
        default:"PENDING"
     }
})