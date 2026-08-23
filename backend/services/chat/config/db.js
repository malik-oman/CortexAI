import mongoose from "mongoose";

 export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("CHAT SERVICE DATABASE CONNECTED")
  } catch (error) {
    console.log(`chat db error ${error}`)
  }
}