import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new mongoose.Schema({
    videoFile:{
        type:String,
        required:true,

    },
    thumbnail:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:String,
        required:true,
        default:0
    },
    isPublished:
        {
            type:Boolean,
            required:true,
            default:true
        }
    
}, {timestamps:true})

mongoose.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)