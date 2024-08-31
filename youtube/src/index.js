import dotenv from "dotenv"
import dbConnect from "./db/index.js";
import {app} from "./app.js";
dotenv.config({
    path:'./.env'
})

dbConnect().
then(()=>{
    app.on("error", (error)=>{
        console.log(error, 'MongoDB error')
    })
    app.listen(process.env.PORT||8000, ()=>{
        console.log('Listening on port')
    })

}).catch((err)=>{
    console.log(err)
})