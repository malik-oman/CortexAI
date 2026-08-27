import React from 'react'
import MarkDown from 'react-markdown'

const MessageBubble = ({ role, content }) => {
  const isUser = role === "user"

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] min-w-0 px-3.5 sm:px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed
        ${isUser
          ? "bg-linear-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
          : "bg-white/[0.04] border border-white/[0.07] text-slate-200 rounded-tl-sm"}`}
      >
        <div className='prose prose-invert prose-sm max-w-none min-w-0 break-words
          prose-p:my-1.5 prose-p:break-words
          prose-headings:break-words
          prose-a:break-all
          prose-code:text-[12.5px] prose-code:break-words prose-code:before:content-none prose-code:after:content-none
          prose-pre:my-2 prose-pre:bg-black/30 prose-pre:rounded-lg prose-pre:p-3'
        >
          <MarkDown
            components={{
              pre: ({ children }) => (
                <pre className='overflow-x-auto max-w-full [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full'>
                  {children}
                </pre>
              ),
              code: ({ inline, children, ...props }) =>
                inline ? (
                  <code className='bg-white/10 px-1 py-0.5 rounded text-[12.5px] break-words' {...props}>
                    {children}
                  </code>
                ) : (
                  <code className='whitespace-pre' {...props}>
                    {children}
                  </code>
                ),
            }}
          >
            {content}
          </MarkDown>
        </div>
      </div>
    </div>
  )
}

export default MessageBubble