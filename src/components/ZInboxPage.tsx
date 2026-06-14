import React, { useState } from 'react';
import { Search, MoreVertical, Edit, Phone, Video, Info, Paperclip, Send, Smile } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DUMMY_CHATS = [
  { id: '1', name: 'Sarah Jenkins', role: 'Real Estate Agent', lastMessage: 'The viewing is scheduled for tomorrow at 10 AM. See you then!', time: '10:30 AM', unread: 2, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: '2', name: 'Michael Chen', role: 'Property Owner', lastMessage: 'Are you still interested in the 2-bedroom apartment?', time: 'Yesterday', unread: 0, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: '3', name: 'Emily Rodriguez', role: 'Loan Officer', lastMessage: 'Your pre-approval letter is ready.', time: 'Tuesday', unread: 0, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' },
  { id: '4', name: 'Support Team', role: 'Zillow', lastMessage: 'Welcome to the platform! Let us know if you need help.', time: 'Monday', unread: 0, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150' },
];

const DUMMY_MESSAGES = [
  { id: 'm1', sender: 'them', text: 'Hi there! I saw you were looking at the property on Elm Street.', time: '10:15 AM' },
  { id: 'm2', sender: 'me', text: 'Yes, I am very interested. Is it still available?', time: '10:20 AM' },
  { id: 'm3', sender: 'them', text: 'It is! Would you like to schedule a viewing?', time: '10:22 AM' },
  { id: 'm4', sender: 'me', text: 'That would be great. Tomorrow morning works for me.', time: '10:25 AM' },
  { id: 'm5', sender: 'them', text: 'The viewing is scheduled for tomorrow at 10 AM. See you then!', time: '10:30 AM' },
];

export function ZInboxPage() {
  const { t } = useTranslation();
  const [activeChat, setActiveChat] = useState(DUMMY_CHATS[0].id);
  const [newMessage, setNewMessage] = useState('');

  const currentChat = DUMMY_CHATS.find(c => c.id === activeChat);

  return (
    <div className="flex h-full bg-[#FFFFFF] w-full overflow-hidden">
      
      {/* Left Sidebar - Chat List */}
      <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 border-r border-[#E0E6ED] flex flex-col bg-white z-10 h-full">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-[#E0E6ED]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[22px] font-bold text-[#1A1A1A]">{t('Inbox')}</h1>
            <button className="w-10 h-10 rounded-full bg-[#F5EFEB] flex items-center justify-center text-[#2F4156] hover:bg-[#E0E6ED] transition-colors">
              <Edit size={18} />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#567C8D]">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder={t('Search messages')}
              className="w-full bg-[#F5EFEB] border-none rounded-xl pl-10 pr-4 py-2.5 text-[15px] text-[#2F4156] outline-none focus:ring-2 focus:ring-[#0054d6]/20 transition-all"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {DUMMY_CHATS.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`flex items-start gap-3 p-4 cursor-pointer transition-colors border-l-4 ${activeChat === chat.id ? 'bg-[#F5EFEB]/50 border-[#0054d6]' : 'border-transparent hover:bg-[#F5EFEB]/30'}`}
            >
              <div className="relative flex-shrink-0">
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                {chat.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#0054d6] rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                    {chat.unread}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-[#1A1A1A] text-[15px] truncate">{chat.name}</h3>
                  <span className={`text-[12px] whitespace-nowrap ${chat.unread > 0 ? 'text-[#0054d6] font-bold' : 'text-[#567C8D]'}`}>{chat.time}</span>
                </div>
                <p className="text-[13px] text-[#567C8D] truncate">{chat.role}</p>
                <p className={`text-[14px] truncate mt-0.5 ${chat.unread > 0 ? 'text-[#1A1A1A] font-medium' : 'text-[#567C8D]'}`}>
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Area - Chat View */}
      <div className={`flex-1 flex flex-col bg-[#F9FAFB] h-full ${activeChat ? 'hidden md:flex' : 'hidden md:flex items-center justify-center'}`}>
        
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="h-[76px] px-6 border-b border-[#E0E6ED] bg-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <img src={currentChat.avatar} alt={currentChat.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h2 className="font-bold text-[#1A1A1A] text-[16px] leading-tight">{currentChat.name}</h2>
                  <span className="text-[13px] text-[#567C8D]">{currentChat.role} • {t('Online')}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#567C8D] hover:bg-[#F5EFEB] hover:text-[#0054d6] transition-colors">
                  <Phone size={20} />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#567C8D] hover:bg-[#F5EFEB] hover:text-[#0054d6] transition-colors">
                  <Video size={20} />
                </button>
                <div className="w-[1px] h-6 bg-[#E0E6ED] mx-1"></div>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#567C8D] hover:bg-[#F5EFEB] transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#F9FAFB]">
              <div className="text-center my-4">
                <span className="bg-[#E0E6ED] text-[#567C8D] text-[12px] font-medium px-3 py-1 rounded-full uppercase tracking-wide">
                  {t('Today')}
                </span>
              </div>
              
              {DUMMY_MESSAGES.map((msg) => (
                <div key={msg.id} className={`flex max-w-[75%] ${msg.sender === 'me' ? 'self-end' : 'self-start'}`}>
                  {msg.sender === 'them' && (
                    <img src={currentChat.avatar} alt="" className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1" />
                  )}
                  <div className="flex flex-col">
                    <div 
                      className={`px-4 py-2.5 rounded-2xl text-[15px] ${
                        msg.sender === 'me' 
                          ? 'bg-[#0054d6] text-white rounded-br-sm' 
                          : 'bg-white border border-[#E0E6ED] text-[#2F4156] rounded-bl-sm shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className={`text-[11px] text-[#A0B3C6] mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left ml-1'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-[#E0E6ED] flex-shrink-0">
              <div className="flex items-end gap-2 bg-[#F9FAFB] border border-[#E0E6ED] rounded-2xl p-2 focus-within:border-[#0054d6] focus-within:ring-1 focus-within:ring-[#0054d6] transition-all">
                <button className="p-2 text-[#567C8D] hover:text-[#0054d6] transition-colors rounded-xl hover:bg-[#F5EFEB] flex-shrink-0">
                  <Paperclip size={20} />
                </button>
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('Type a message...')}
                  className="flex-1 bg-transparent border-none outline-none resize-none max-h-[120px] min-h-[40px] py-2 text-[15px] text-[#2F4156] leading-relaxed"
                  rows={1}
                />
                <button className="p-2 text-[#567C8D] hover:text-[#0054d6] transition-colors rounded-xl hover:bg-[#F5EFEB] flex-shrink-0">
                  <Smile size={20} />
                </button>
                <button 
                  className={`p-2.5 rounded-xl transition-colors flex-shrink-0 ${newMessage.trim() ? 'bg-[#0054d6] text-white' : 'bg-[#E0E6ED] text-[#A0B3C6]'}`}
                >
                  <Send size={18} className={newMessage.trim() ? 'ml-0.5' : ''} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#E0E6ED] mb-6">
              <Search size={40} className="text-[#C8D9E6]" />
            </div>
            <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-2">{t('Your Inbox')}</h2>
            <p className="text-[#567C8D] text-[15px] leading-relaxed">
              {t('Select a conversation from the left to start messaging. Connect with agents, owners, and support.')}
            </p>
          </div>
        )}
        
      </div>
    </div>
  );
}
