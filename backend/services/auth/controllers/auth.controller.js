import { getAuth } from 'firebase-admin/auth'
import { app } from '../config/firebase.js';
import User from '../models/user.model.js';
import redis from '../../../shared/redis/redis.js';
import crypto from 'crypto';

export const login = async (req,res) => {
  try {
    const {token} = req.body;
    const decoded = await getAuth(app).verifyIdToken(token)
    let user = await User.findOne({
      firebaseUid:await decoded.uid
    })
    if (!user) {
      user = await User.create({
        firebaseUid:await decoded.uid,
        name: await decoded.name,
        email:await decoded.email,
        avatar:await decoded.picture
      })
    }

    const sessionId = crypto.randomUUID()
   await redis.set(`session-${sessionId}`,JSON.stringify({
    userId:user._id,
    name:user.name,
    email:user.email,
    avatar:user.avatar
   }),"EX",7*24*60*60)
   

    res.cookie("session",sessionId,{
      httpOnly:true,
      secure:false,
      sameSite:"strict",
      maxAge:7*24*60*60*1000
    })

    return res.status(200).json(user)
  } catch (error) {
    res.status(500).json({message:"Login User Error", error})
  }
}



export const logOut = async (req,res) => {
  try {
    const sessionId = req.cookies?.session
    await redis.del(`session-${sessionId}`)

    res.clearCookie("session")
    return res.status(200).json({message:"Logout successfully"})
  } catch (error) {
     res.status(500).json({message:"Logout User Error", error})
  }
}