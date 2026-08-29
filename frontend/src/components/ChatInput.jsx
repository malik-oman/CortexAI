import React, { useState, useRef, useEffect } from "react";
import { Mic2, Paperclip, Send, Loader2, Zap, MessageSquare, Code2, FileText, Presentation, ImageIcon, Globe2Icon } from "lucide-react";
import sendMessage from "../features/sendMessage";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../redux/messageSlice";

import {
  addConversation,
  setConvTitle,
  setSelectedConversation,
} from "../redux/conversationSlice";
import { createConversation } from "./../features/createConversation";
import { updateConversation } from "../features/updateConversation";

const ChatInput = ({ isLoading, setIsLoading }) => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);
  const [selectedAgent,setSelectedAgent] = useState("Auto")

  // auto-resize textarea based on content
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px"; // max height 160px
    }
  }, [value]);

  const handleSendMessage = async () => {
    if (!value.trim() || isLoading) return;

    let conversation = selectedConversation;
    if (!conversation) {
      let conv = await createConversation();
      dispatch(setSelectedConversation(conv));
      dispatch(addConversation(conv));
      conversation = conv;
    }

    if (conversation.title === "New Chat") {
      const updateConv = await updateConversation({
        id: conversation._id,
        title: value.trim(),
      });
      dispatch(
        setConvTitle({
          conversationId: updateConv._id,
          title: value.trim(),
        }),
      );
    }

    const payload = {
      prompt: value.trim(),
      conversationId: conversation?._id,
      agent:selectedAgent.toLowerCase()
    };

    dispatch(addMessage({ role: "user", content: value.trim() }));
    setValue("");
    setIsLoading(true);

    try {
      const data = await sendMessage(payload);
      dispatch(addMessage({ role: "assistant", content: data }));
    } catch (err) {
      dispatch(
        addMessage({
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again.",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const agents = [
    {
      id:"auto",
      icon:Zap,
      label:"Auto"
    },
    {
      id:"chat",
      icon:MessageSquare,
      label:"Chat"
    },
    {
      id:"coding",
      icon:Code2,
      label:"Coding"
    },
    {
      id:"pdf",
      icon:FileText,
      label:"PDF"
    },
    {
      id:"ppt",
      icon:Presentation,
      label:"PPT"
    },
    {
      id:"image",
      icon:ImageIcon,
      label:"Image"
    },
    {
      id:"search",
      icon:Globe2Icon,
      label:"Search"
    },
  ]

  return (
    <div className="w-full px-2.5 sm:px-5 py-3 sm:py-4 border-t border-white/[0.06] bg-[#0d0f14] shrink-0">
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-3 sm:px-4 pt-3 pb-2.5 focus-within:border-white/[0.15] transition-colors duration-150">

        <div className="flex w-[80%] gap-2 pr-2 flex-wrap">
          {agents.map((agent)=>{
            const isActive = selectedAgent===agent.label
            const Icon = agent.icon 
            return (
              <div
              onClick={()=>setSelectedAgent(agent.label)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${isActive ? "bg-linear-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]" : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"}`}>

                <Icon size={14} className={isActive ? "text-white" : "text-slate-500"}/>

                {agent.label}

              </div>
            )

          })}
        </div>

        <textarea
          ref={textareaRef}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          value={value}
          disabled={isLoading}
          placeholder="Ask Anything...."
          rows={1}
          className="w-full bg-transparent outline-none resize-none text-[14px] sm:text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50 min-h-[24px] max-h-[160px] overflow-y-auto"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              disabled={isLoading}
              className="flex items-center justify-center w-8 h-8 shrink-0 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05]
              border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Paperclip size={16} />
            </button>

            <button
              disabled={isLoading}
              className="flex items-center justify-center w-8 h-8 shrink-0 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05]
              border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Mic2 size={16} />
            </button>
          </div>

          <button
            disabled={!value.trim() || isLoading}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 shrink-0 rounded-lg border-none cursor-pointer transition-all duration-150
              ${
                value.trim() && !isLoading
                  ? "bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white"
                  : "bg-white/[0.05] text-slate-600 cursor-not-allowed"
              }
            `}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
