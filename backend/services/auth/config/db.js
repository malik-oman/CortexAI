import mongoose from "mongoose";

 export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("AUTH SERVICE DATABASE CONNECTED")
  } catch (error) {
    console.log(`auth db error ${error}`)
  }
}