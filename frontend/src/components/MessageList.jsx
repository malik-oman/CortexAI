import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import MessageBubble from './MessageBubble'

const TypingIndicator = () => (
  <div className='flex justify-start'>
    <div className='flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/[0.07]'>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className='w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce'
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  </div>
)

const SkeletonBubble = ({ align }) => (
  <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`h-9 rounded-2xl bg-white/[0.04] border border-white/[0.06] animate-pulse ${
        align === 'right' ? 'w-40 rounded-tr-sm' : 'w-56 rounded-tl-sm'
      }`}
    />
  </div>
)

const MessageList = ({ isFetching, isLoading }) => {
  const { selectedConversation } = useSelector(state => state.conversation)
  const { messages } = useSelector(state => state.message)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className='flex-1 overflow-y-auto px-3 sm:px-6 py-6 space-y-4 sm:space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>

      {isFetching ? (
        <div className='space-y-4 max-w-3xl mx-auto w-full'>
          <SkeletonBubble align='right' />
          <SkeletonBubble align='left' />
          <SkeletonBubble align='right' />
        </div>
      ) : messages.length === 0 || !selectedConversation ? (
        <div className='h-full flex flex-col items-center justify-center gap-4 text-center px-4'>
          <div className='flex flex-col gap-1.5'>
            <h1 className='text-[20px] font-semibold text-slate-200 tracking-tight'>CortexAI</h1>
            <p className='text-[15px] font-semibold text-slate-400 tracking-tight'>How can I help you?</p>
            <p className='text-[13px] font-semibold text-slate-600 max-w-[260px] leading-relaxed'>
              Ask me anything - code, ideas, explanation, or just a quick question.
            </p>
          </div>

          <div className='flex flex-wrap justify-center gap-2 mt-1'>
            {["Write a Netflix clone", "Explain Redis", "Build a dashboard"].map((s, i) => (
              <button
                key={i}
                className='text-[12px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer'
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className='max-w-3xl mx-auto w-full space-y-4 sm:space-y-5'>
          {messages.map((msg, i) => (
            <div key={msg?._id || i} className='animate-[fadeIn_0.25s_ease-out]'>
              <MessageBubble role={msg?.role} content={msg?.content} />
            </div>
          ))}

          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}

export default MessageList