import React, { useState, useRef, useEffect } from 'react'
import { Mic2, Paperclip, Send, Loader2 } from 'lucide-react'
import sendMessage from '../features/sendMessage'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage } from '../redux/messageSlice'

const ChatInput = ({ isLoading, setIsLoading }) => {
  const { selectedConversation } = useSelector(state => state.conversation)
  const dispatch = useDispatch()
  const [value, setValue] = useState("")
  const textareaRef = useRef(null)

  // auto-resize textarea based on content
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 160) + 'px' // max height 160px
    }
  }, [value])

  const handleSendMessage = async () => {
    if (!value.trim() || isLoading) return

    const payload = {
      prompt: value.trim(),
      conversationId: selectedConversation?._id
    }

    dispatch(addMessage({ role: "user", content: value.trim() }))
    setValue("")
    setIsLoading(true)

    try {
      const data = await sendMessage(payload)
      dispatch(addMessage({ role: "assistant", content: data }))
    } catch (err) {
      dispatch(addMessage({ role: "assistant", content: "⚠️ Something went wrong. Please try again." }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className='w-full px-2.5 sm:px-5 py-3 sm:py-4 border-t border-white/[0.06] bg-[#0d0f14] shrink-0'>
      <div className='max-w-3xl mx-auto w-full flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-3 sm:px-4 pt-3 pb-2.5 focus-within:border-white/[0.15] transition-colors duration-150'>

        <textarea
          ref={textareaRef}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          value={value}
          disabled={isLoading}
          placeholder='Ask Anything....'
          rows={1}
          className='w-full bg-transparent outline-none resize-none text-[14px] sm:text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50 min-h-[24px] max-h-[160px] overflow-y-auto'
        />

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            <button
              disabled={isLoading}
              className='flex items-center justify-center w-8 h-8 shrink-0 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05]
              border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
            >
              <Paperclip size={16} />
            </button>

            <button
              disabled={isLoading}
              className='flex items-center justify-center w-8 h-8 shrink-0 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05]
              border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
            >
              <Mic2 size={16} />
            </button>
          </div>

          <button
            disabled={!value.trim() || isLoading}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 shrink-0 rounded-lg border-none cursor-pointer transition-all duration-150
              ${value.trim() && !isLoading
                ? "bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white"
                : "bg-white/[0.05] text-slate-600 cursor-not-allowed"}
            `}
          >
            {isLoading ? <Loader2 size={16} className='animate-spin' /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInput