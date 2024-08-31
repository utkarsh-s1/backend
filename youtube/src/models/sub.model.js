import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const subSchema = mongoose.Schema({
    subscriber:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Subscription = mongoose.model('Subscription', subSchema)