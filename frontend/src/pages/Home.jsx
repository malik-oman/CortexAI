import React from 'react'
import api from './../utils/axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './../utils/firebase';
import {FcGoogle} from 'react-icons/fc'



const Home = () => {


 const handleLogin = async (token) => {
  try {
   const {data} = await api.post("/api/auth/login", {token})
  } catch (error) {
    console.log(error)
  }
 } 

const googleLogin = async () => {
const data =  await signInWithPopup(auth,googleProvider)
const token = await data.user.getIdToken()
await handleLogin(token)
}

 return (
    <div className='h-screen flex bg-[#0d0f14] text-white overflow-hidden'>

      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 
      backdrop-blur-sm'> 
      <div className='w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl
      p-7 flex flex-col gap-5'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-[17px] font-semibold text-slate-100
          tracking-tight'>Welcome to CortexAI</h2>
          <p className='text-[13px] text-slate-500 '>Please Login to continue using the app.</p>
        </div>

    <button  onClick={googleLogin}
     className='w-full flex items-center justify-center gap-3 py-3 px-4
    rounded-2xl text-sm font-semibold text-white 
    bg-linear-to-br from-indigo-500 via-purple-600 to-violet-700
    hover:from-indigo-400 hover:via-purple-500 hover:to-violet-600
    active:from-indigo-600 active:via-purple-700 active:to-violet-800
    shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40
    hover:scale-[1.02] active:scale-[0.98]
    transition-all duration-200 ease-out
    cursor-pointer border border-white/10'>
    <span className='bg-white rounded-full p-1 flex items-center justify-center shadow-sm'>
        <FcGoogle size={14} />
    </span>
    Continue With Google
    </button>
      </div>

      </div>

    </div>
  )
}

export default Home