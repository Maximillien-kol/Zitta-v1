import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Phone, Video, Info, Paperclip, Send, Smile, MessageSquare, AlertCircle, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { supabase } from '../services/supabase';
import { useSEO } from '../hooks/useSEO';

export function ZInboxPage({ currentUser }: { currentUser?: { id: string; email: string; role: string } | null }) {
  const { t } = useTranslation();
  const location = useLocation();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<string>(currentUser?.id || 'local-user');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useSEO({
    title: 'Inbox & Messages',
    description: 'Chat directly with property owners and agents on Zitta. View your property inquiries.',
    keywords: 'Zitta messages, contact landlord Rwanda, property inquiries Kigali'
  });

  useEffect(() => {
    const initInbox = async () => {
      try {
        // Prefer currentUser prop, fall back to Supabase session
        let currentUserId = currentUser?.id || 'local-user';
        if (!currentUser && import.meta.env.VITE_SUPABASE_URL) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            currentUserId = user.id;
          }
        }
        setUserId(currentUserId);

        const convs = await api.getConversations(currentUserId);
        const buyerConvs = convs.filter(c => c.buyer_id === currentUserId);
        setConversations(buyerConvs);

        // Auto-select conversation from query parameter if present
        const queryParams = new URLSearchParams(window.location.search);
        const chatParam = queryParams.get('chat');
        if (chatParam) {
          setActiveChatId(chatParam);
        } else if (buyerConvs.length > 0) {
          setActiveChatId(buyerConvs[0].id);
        }
      } catch (err) {
        console.error('Failed to initialize inbox:', err);
      } finally {
        setLoading(false);
      }
    };

    initInbox();
  }, [currentUser?.id]);

  // React to chat query param changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const chatParam = queryParams.get('chat');
    if (chatParam && chatParam !== activeChatId) {
      setActiveChatId(chatParam);
    }
  }, [location.search, activeChatId]);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (!activeChatId) return;

    const fetchMessages = async () => {
      try {
        const msgs = await api.getMessages(activeChatId);
        setMessages(msgs);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    fetchMessages();

    // Subscribe to real-time messages for this conversation
    const messageChannel = api.subscribeToMessages(activeChatId, (newMsg) => {
      setMessages(prev => {
        // Prevent duplicate messages if already present
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    // Subscribe to real-time conversation updates (e.g. for last_message, unread counts)
    const convChannel = api.subscribeToConversations(userId, async () => {
      try {
        const convs = await api.getConversations(userId);
        const buyerConvs = convs.filter(c => c.buyer_id === userId);
        setConversations(buyerConvs);
      } catch (err) {
        console.error('Failed to update conversations:', err);
      }
    });

    return () => {
      messageChannel?.unsubscribe();
      convChannel?.unsubscribe();
    };
  }, [activeChatId, userId]);

  // Scroll to bottom of message list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId) return;

    // Derive a display name from currentUser email or fall back gracefully
    const senderName = currentUser?.email
      ? currentUser.email.split('@')[0]
      : 'User';

    try {
      const sentMsg = await api.sendMessage(
        activeChatId, 
        newMessage, 
        userId, 
        senderName
      );
      
      setMessages(prev => [...prev, sentMsg]);
      setNewMessage('');

      // Refresh conversations list to update last message
      const convs = await api.getConversations(userId);
      setConversations(convs);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const currentChat = conversations.find(c => c.id === activeChatId);

  return (
    <div className="flex h-full bg-[#FFFFFF] w-full overflow-hidden">
      
      {/* Left Sidebar - Chat List */}
      <div className={`w-full md:w-[350px] lg:w-[400px] flex-shrink-0 border-r border-[#E0E6ED] flex flex-col bg-white z-10 h-full transition-all duration-300 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-[#E0E6ED]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[22px] font-bold text-[#1A1A1A]">{t('Inbox')}</h1>
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
          {loading ? (
            <div className="text-center py-8 text-[#567C8D]">
              <p>{t('Loading conversations...')}</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 px-6">
              <MessageSquare size={36} className="text-[#C8D9E6] mx-auto mb-3" />
              <h4 className="font-bold text-[#2F4156] text-[15px] mb-1">{t('No conversations yet')}</h4>
              <p className="text-[13px] text-[#567C8D]">{t('Go to a property detail page and click Talk to Agent to start chatting.')}</p>
            </div>
          ) : (
            conversations.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`flex items-start gap-3 p-4 cursor-pointer transition-colors border-l-4 ${activeChatId === chat.id ? 'bg-[#F5EFEB]/50 border-[#0054d6]' : chat.unread > 0 ? 'bg-[#F5EFEB] border-transparent' : 'border-transparent hover:bg-[#F5EFEB]/30'}`}
              >
                <div className="relative flex-shrink-0">
                  <img src={chat.clientImage || chat.agent_image} alt={chat.clientName || chat.agent_name} className="w-12 h-12 rounded-full object-cover" />
                  {chat.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#0054d6] rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                      {chat.unread}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-[#1A1A1A] text-[15px] truncate">{chat.agent_name || 'Owner'}</h3>
                    <span className="text-[12px] text-[#567C8D] whitespace-nowrap">{chat.timestamp || chat.time}</span>
                  </div>
                  <p className="text-[12px] text-[#567C8D] font-medium truncate mb-0.5">{chat.property?.title || 'Property Inquiry'}</p>
                  <p className="text-[13px] truncate text-[#A0B3C6]">
                    {chat.lastMessage || chat.last_message || 'No messages yet'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Area - Chat View */}
      <div className={`flex-1 flex flex-col bg-[#F9FAFB] h-full absolute inset-0 md:static z-20 md:z-auto ${activeChatId ? 'flex' : 'hidden md:flex items-center justify-center'}`}>
        
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="h-[76px] px-4 md:px-6 border-b border-[#E0E6ED] bg-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2 md:gap-3">
                <button onClick={() => setActiveChatId(null)} className="md:hidden p-2 -ml-2 text-[#2F4156]">
                  <ChevronLeft size={24} strokeWidth={2} />
                </button>
                <img src={currentChat.agent_image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} alt="Agent" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h2 className="font-bold text-[#1A1A1A] text-[16px] leading-tight">{currentChat.agent_name || 'Owner'}</h2>
                  <span className="text-[13px] text-[#567C8D]">{currentChat.property?.title || 'Property inquiry'}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#567C8D] hover:bg-[#F5EFEB] hover:text-[#0054d6] transition-colors">
                  <Phone size={20} />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#567C8D] hover:bg-[#F5EFEB] hover:text-[#0054d6] transition-colors">
                  <Video size={20} />
                </button>
              </div>
            </div>

            {/* Property Card */}
            {currentChat.property && (
              <div className="px-6 py-4 border-b border-[#E0E6ED] bg-white flex-shrink-0">
                <Link to={`/property/${currentChat.property_id}`} target="_blank" className="flex items-center gap-4 p-3 bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl hover:shadow-md transition-all">
                  <img src={currentChat.property.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=200'} className="w-14 h-14 rounded-lg object-cover" alt="Property" />
                  <div>
                    <h3 className="font-bold text-[14px] text-[#1A1A1A]">{currentChat.property.title}</h3>
                    <p className="text-[12px] text-[#567C8D]">Click to view property details</p>
                  </div>
                </Link>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#F9FAFB]">
              {messages.length === 0 ? (
                <div className="text-center my-auto px-6">
                  <AlertCircle size={28} className="text-[#A0B3C6] mx-auto mb-2" />
                  <p className="text-[14px] text-[#567C8D]">{t('Start conversation by typing a message below.')}</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === userId || msg.sender === 'me';
                  return (
                    <div key={msg.id} className={`flex max-w-[75%] ${isMe ? 'self-end' : 'self-start'}`}>
                      {!isMe && (
                        <img src={currentChat.clientImage || currentChat.agent_image} alt="" className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1" />
                      )}
                      <div className="flex flex-col">
                        <div 
                          className={`px-4 py-2.5 rounded-2xl text-[15px] ${
                            isMe 
                              ? 'bg-[#0054d6] text-white rounded-br-sm' 
                              : 'bg-white border border-[#E0E6ED] text-[#2F4156] rounded-bl-sm shadow-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className={`text-[11px] text-[#A0B3C6] mt-1 ${isMe ? 'text-right' : 'text-left ml-1'}`}>
                          {msg.timestamp || msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#E0E6ED] flex-shrink-0">
              <div className="flex items-end gap-2 bg-[#F9FAFB] border border-[#E0E6ED] rounded-2xl p-2 focus-within:border-[#0054d6] focus-within:ring-1 focus-within:ring-[#0054d6] transition-all">
                <button type="button" className="p-2 text-[#567C8D] hover:text-[#0054d6] transition-colors rounded-xl hover:bg-[#F5EFEB] flex-shrink-0">
                  <Paperclip size={20} />
                </button>
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder={t('Type a message...')}
                  className="flex-1 bg-transparent border-none outline-none resize-none max-h-[120px] min-h-[40px] py-2 text-[15px] text-[#2F4156] leading-relaxed"
                  rows={1}
                />
                <button type="button" className="p-2 text-[#567C8D] hover:text-[#0054d6] transition-colors rounded-xl hover:bg-[#F5EFEB] flex-shrink-0">
                  <Smile size={20} />
                </button>
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`p-2.5 rounded-xl transition-colors flex-shrink-0 ${newMessage.trim() ? 'bg-[#0054d6] text-white' : 'bg-[#E0E6ED] text-[#A0B3C6]'}`}
                >
                  <Send size={18} className={newMessage.trim() ? 'ml-0.5' : ''} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center text-center max-w-md mx-auto my-auto relative w-full h-full justify-center px-4">
            <button onClick={() => setActiveChatId(null)} className="md:hidden absolute top-6 left-4 p-2 text-[#2F4156] bg-white rounded-full shadow-sm border border-[#E0E6ED]">
              <ChevronLeft size={24} strokeWidth={2} />
            </button>
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#E0E6ED] mb-6">
              <MessageSquare size={40} className="text-[#C8D9E6]" />
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
