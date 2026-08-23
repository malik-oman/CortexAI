import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { connectDb } from './config/db.js'
import chatRouter from './routes/chat.route.js'


const app = express()
app.use(express.json())

// ==========================================================================
const port = process.env.PORT

// ===========================================================================
app.use("/",chatRouter)

// ==========================================================================
app.listen(port,()=>{
  connectDb()
  console.log("CHAT Service Started")
})