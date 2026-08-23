import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { connectDb } from './config/db.js'



const app = express()
app.use(express.json())

// ==========================================================================
const port = process.env.PORT

// ===========================================================================


// ==========================================================================
app.listen(port,()=>{
  connectDb()
  console.log("AGENT  Service Started")
})