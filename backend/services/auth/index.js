import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { connectDb } from './config/db.js'
import authRouter from './routes/auth.route.js'

const app = express()
app.use(express.json())

// ==========================================================================
const port = process.env.PORT

// ===========================================================================
app.use("/",authRouter)

// ==========================================================================
app.listen(port,()=>{
  connectDb()
  console.log("AUTH Service Started")
})