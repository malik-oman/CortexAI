import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import colors from 'colors'
import proxy from 'express-http-proxy'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import  protect  from './middleware/auth.middleware.js'
import { getCurrentUser } from './controllers/user.controller.js'

const app = express()
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true
}))
app.use(cookieParser())
// ==========================================================================
const port = process.env.PORT

app.use("/api/auth",proxy(process.env.AUTH_SERVICE))
app.get("/api/me",protect,getCurrentUser)
// ===========================================================================



// ==========================================================================
app.listen(port,()=>{
  console.log("Gateway Service Started".bgBlack)
})