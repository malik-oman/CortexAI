import React, { useEffect, useState } from 'react'
import { CoinsIcon, LogOut, MessageSquare, PanelLeftIcon, PenBoxIcon, Plus, User2Icon } from 'lucide-react'
import { getConversations } from '../features/getConversations'
import { useDispatch, useSelector } from 'react-redux';
import { addConversation, setConversations, setSelectedConversation } from '../redux/conversationSlice';
import { createConversation } from '../features/createConversation';
import logOut from '../features/logOut';
import { setUserData } from '../redux/userSlice';

const SideBar = () => {

const [collapsed,setCollapsed] = useState(false)          // desktop collapse (icon-only)
const [mobileOpen,setMobileOpen] = useState(false)          // mobile drawer open/close
const dispatch = useDispatch()
const {conversations,selectedConversation} = useSelector(state=>state.conversation)
const {userData} = useSelector(state=>state.user)
const [imageError,setImageError] = useState(false)

useEffect(()=>{
  const getConv = async () => {
  const data =  await getConversations()
  dispatch(setConversations(data))
  }
  getConv()
},[userData?._id])

const handleCreateConversation = async () => {
 const data = await createConversation()
 dispatch(addConversation(data))
 setMobileOpen(false) 
}

const handleSelectConversation = (conv) => {
  dispatch(setSelectedConversation(conv))
  setMobileOpen(false) 
}

  return (
    <>
      
      <button
        onClick={()=>setMobileOpen(true)}
        className='lg:hidden fixed top-4 left-4 z-40 flex items-center justify-center w-9 h-9 rounded-lg text-slate-300 bg-white/[0.05] border border-white/[0.08]'
      >
        <PanelLeftIcon size={16}/>
      </button>

      
      {mobileOpen && (
        <div
          onClick={()=>setMobileOpen(false)}
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.06]
        transition-transform lg:transition-[width] duration-300 ease-in-out
        ${collapsed ? 'lg:w-[70px]' : 'lg:w-[270px]'}
        w-[270px]
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>

        {collapsed ? (
          <div className='hidden lg:flex flex-col items-center h-full py-4'>
            <div onClick={()=>setCollapsed(false)}
             className='flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent cursor-pointer'>
              <PanelLeftIcon/>
            </div>

            <button onClick={handleCreateConversation}
             className='flex items-center justify-center w-9 h-9 rounded-xl text-white bg-linear-to-br from-indigo-500 to-violet-700 border-none cursor-pointer hover:opacity-90 transition-opacity duration-150 mt-4'>
              <Plus size={16}/>
            </button>

            <div className='flex-1 flex flex-col items-center gap-1.5 overflow-y-auto mt-4 w-full px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
              {conversations.map((conv,i)=>{
                const isActive = selectedConversation?._id==conv?._id
                return (
                  <div key={conv?._id || i} onClick={()=>handleSelectConversation(conv)}
                   title={conv?.title || "New Chat"}
                   className={`flex items-center justify-center shrink-0 w-9 h-9 rounded-lg cursor-pointer transition-colors duration-150 
                  ${isActive ? "bg-indigo-500/15 text-indigo-400" : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-300"}`}>
                    <MessageSquare size={16}/>
                  </div>
                )
              })}
            </div>

            {userData ? (
              <div className='relative shrink-0 cursor-pointer'>
                {
                (userData?.avatar || !imageError)
                ?
                <img className='w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25'
                src={userData.avatar} alt="profile" onError={()=>setImageError(true)} />
                :
                <div className='w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25 flex items-center justify-center bg-white/[0.05]'>
                  <User2Icon size={15} className='text-slate-400'/>
                </div>
                }
              </div>
            ) : (
              <button className='flex items-center justify-center w-9 h-9 rounded-xl text-slate-200 bg-white/[0.05] border border-white/[0.08] cursor-pointer hover:bg-white/[0.08] transition-colors duration-150'>
                <User2Icon size={16}/>
              </button>
            )}
          </div>
        ) : null}

        <div className={`${collapsed ? 'lg:hidden' : ''} flex flex-col h-full`}>
          <div className='flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]'>

            <div onClick={()=>{ setCollapsed(true); setMobileOpen(false) }}
             className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent cursor-pointer'>
              <PanelLeftIcon/>
            </div>

            <span className='text-[20px] font-semibold text-slate-100 tracking-tight flex-1'>CortexAI</span>
            <span className='text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 text-[13px] py-0.5 rounded-full tracking-wide'>Free</span>

            <button onClick={handleCreateConversation}
             className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer'>
              <PenBoxIcon size={14}/>
            </button>
          </div>


          <div className='px-4 pt-4 pb-1'>
            <button onClick={handleCreateConversation}
             className='w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150'>
              <Plus size={15}/>
              New Chat
            </button>
          </div>


          {conversations.length==0
           ?
          <div className='px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600'>
              No Recent Conversations
            </div>
             : 
             (
              <div className='px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600'>
                  Recent
              </div>
             )}

             <div className='flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none]
             [&::-webkit-scrollbar]:hidden'>
              {conversations.map((conv,i)=>{
                const isActive = selectedConversation?._id==conv?._id
                return (
                  <div key={conv?._id || i} onClick={()=>handleSelectConversation(conv)}
                   className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 
                  ${isActive ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                   : "bg-transparent border-transparent"}`}>

                     <div className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150 
                      ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/[0.05] text-slate-500"}`}>
                      <MessageSquare size={16}/>
                      </div> 
                    <span className={`text-[13px] font-medium truncate ${isActive ? "text-slate-100" : "text-slate-300"}`}>{conv?.title || "New Chat"}</span>
                  </div>
                )
              })}

             </div>

             <div className='mx-2.5 h-px bg-white/[0.06]'/>

             <div className='px-3.5 py-3.5'>
              {userData ? (
               <div className='flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors duration-150'>
                 <div className='relative shrink-0'>
                  {
                  (  userData?.avatar || !imageError) 
                  ?
                  <img className='w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25'
                  src={userData.avatar} alt="profile" onError={()=>setImageError(true)} />
                  :
                  <div className='w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25'>
                    <User2Icon size={15} className='text-slate-400'/>
                    </div>
                    
                  }
                  </div> 

                  <div className='flex-1 min-w-0'>
                    <p className='text-[13.5px] font-semibold text-slate-100 truncate'>{userData?.name || "user"}</p>
                    <p className='text-[11px] text-slate-600 mt-px'>{"Free Plan"}</p>
                  </div>

                  <div className='flex gap-1'>
                   <button className='flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150'>
                    <CoinsIcon size={16}/>
                    </button> 

                    <button onClick={()=>{
                      logOut();
                      dispatch(setUserData(null))
                    }}
                     className='flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150'>
                      <LogOut size={16}/>
                    </button>
                  </div>
                </div>) 
               : 
               <button className='w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-200 bg-white/[0.05] border border-white/[0.08] rounded-xl py-[11px] cursor-pointer hover:bg-white/[0.08] transition-colors duration-150'>
                  Login
                </button>
                }
             </div>
            
          </div>
        </div>
      
    </>
  )
}

export default SideBar