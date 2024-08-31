import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()


// app.use for middleware
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))

app.use(urlencoded())

app.use(express.static("public"))

app.use(cookieParser())

//routes import 
import userRouter from "./routes/user.routes.js"


//
app.use('/api/v1/users', userRouter)

export {app}