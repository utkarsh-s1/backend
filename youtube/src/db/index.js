import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


export default async function dbConnect(){
    try {

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) 
        console.log("mongodb connected")
        
    } catch (error) {
        console.log("DB connection error: ", error)
        process.exit(1)
        
    }

}