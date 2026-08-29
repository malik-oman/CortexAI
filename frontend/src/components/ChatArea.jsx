import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux'
import getMessages from '../features/getMessages'
import { setMessages } from '../redux/messageSlice'

const ChatArea = () => {
  const { selectedConversation } = useSelector(state => state.conversation)
  const dispatch = useDispatch()
  const [isFetching, setIsFetching] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // AI response ka wait

  useEffect(() => {
    const getMesg = async () => {
      if (selectedConversation) {
        if(selectedConversation.title=="New Chat") return
        setIsFetching(true)
        try {
          const data = await getMessages(selectedConversation?._id)
          dispatch(setMessages(data))
        } finally {
          setIsFetching(false)
        }
      }
    }
    getMesg()
  }, [selectedConversation?._id])

  return (
    <div className='flex-1 flex flex-col h-screen min-w-0'>
      <Nav />
      <MessageList isFetching={isFetching} isLoading={isLoading} />
      <ChatInput isLoading={isLoading} setIsLoading={setIsLoading} />
    </div>
  )
}

export default ChatArea