import 'dotenv/config'
import express from 'express'
import { connectDb } from './config/db.js'
import agentRouter from './routes/agent.route.js'



const app = express()
app.use(express.json())

// ==========================================================================
const port = process.env.PORT

// ===========================================================================
app.use("/", agentRouter)

// ==========================================================================
app.listen(port,()=>{
  connectDb()
  console.log("AGENT  Service Started")
})