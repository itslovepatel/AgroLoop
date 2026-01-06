import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { UserType } from '../types';

interface Message {
    id: string;
    created_at: string;
    sender_id: string;
    sender_role: 'farmer' | 'buyer';
    content: string;
    is_read: boolean;
    message_type: 'text' | 'offer' | 'system';
}

interface ChatProps {
    isOpen: boolean;
    onClose: () => void;
    conversationId?: string;
    listingId?: string;
    otherUserId: string;
    otherUserName: string;
    listingTitle?: string;
}

const Chat: React.FC<ChatProps> = ({
    isOpen,
    onClose,
    conversationId: propConversationId,
    listingId,
    otherUserId,
    otherUserName,
    listingTitle
}) => {
    const { state } = useApp();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [conversationId, setConversationId] = useState(propConversationId);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentUserId = state.user?.id;
    const currentUserRole = state.user?.type === UserType.FARMER ? 'farmer' : 'buyer';

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Get or create conversation
    useEffect(() => {
        if (!isOpen || !currentUserId) return;

        const getOrCreateConversation = async () => {
            setLoading(true);

            if (propConversationId) {
                setConversationId(propConversationId);
                await fetchMessages(propConversationId);
                setLoading(false);
                return;
            }

            // Check for existing conversation
            const farmerId = currentUserRole === 'farmer' ? currentUserId : otherUserId;
            const buyerId = currentUserRole === 'buyer' ? currentUserId : otherUserId;

            const { data: existingConv } = await supabase
                .from('conversations')
                .select('id')
                .eq('farmer_id', farmerId)
                .eq('buyer_id', buyerId)
                .eq('listing_id', listingId || null)
                .single();

            if (existingConv) {
                setConversationId(existingConv.id);
                await fetchMessages(existingConv.id);
            } else {
                // Create new conversation
                const { data: newConv, error } = await supabase
                    .from('conversations')
                    .insert({
                        listing_id: listingId,
                        farmer_id: farmerId,
                        buyer_id: buyerId,
                    })
                    .select('id')
                    .single();

                if (newConv) {
                    setConversationId(newConv.id);
                }
                if (error) {
                    console.error('Error creating conversation:', error);
                }
            }

            setLoading(false);
        };

        getOrCreateConversation();
    }, [isOpen, currentUserId, otherUserId, listingId, propConversationId]);

    // Fetch messages
    const fetchMessages = async (convId: string) => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true });

        if (data) {
            setMessages(data as Message[]);
            // Mark messages as read
            markMessagesAsRead(convId);
        }
        if (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Mark messages as read
    const markMessagesAsRead = async (convId: string) => {
        if (!currentUserId) return;

        await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('conversation_id', convId)
            .neq('sender_id', currentUserId);

        // Update unread count in conversation
        const updateField = currentUserRole === 'farmer' ? 'farmer_unread_count' : 'buyer_unread_count';
        await supabase
            .from('conversations')
            .update({ [updateField]: 0 })
            .eq('id', convId);
    };

    // Subscribe to new messages
    useEffect(() => {
        if (!conversationId) return;

        const channel = supabase
            .channel(`messages-${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    setMessages(prev => [...prev, newMsg]);
                    scrollToBottom();

                    // Mark as read if from other user
                    if (newMsg.sender_id !== currentUserId) {
                        markMessagesAsRead(conversationId);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, currentUserId]);

    // Scroll on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !loading) {
            inputRef.current?.focus();
        }
    }, [isOpen, loading]);

    // Send message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversationId || !currentUserId || sending) return;

        setSending(true);

        const { error } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversationId,
                sender_id: currentUserId,
                sender_role: currentUserRole,
                content: newMessage.trim(),
                message_type: 'text'
            });

        if (error) {
            console.error('Error sending message:', error);
        } else {
            setNewMessage('');
        }

        setSending(false);
    };

    // Format timestamp
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full sm:w-96 h-[80vh] sm:h-[600px] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="bg-nature-600 text-white px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <MessageCircle size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold">{otherUserName}</h3>
                            {listingTitle && (
                                <p className="text-xs text-white/80 truncate max-w-[180px]">
                                    Re: {listingTitle}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-earth-50">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="animate-spin text-nature-600" size={32} />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-earth-400">
                            <MessageCircle size={48} className="mb-2 opacity-50" />
                            <p>No messages yet</p>
                            <p className="text-sm">Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.sender_id === currentUserId
                                            ? 'bg-nature-600 text-white rounded-br-md'
                                            : 'bg-white text-earth-800 rounded-bl-md shadow-sm'
                                        }`}
                                >
                                    <p className="text-sm">{msg.content}</p>
                                    <p className={`text-xs mt-1 ${msg.sender_id === currentUserId ? 'text-white/70' : 'text-earth-400'
                                        }`}>
                                        {formatTime(msg.created_at)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-earth-200">
                    <div className="flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-3 bg-earth-100 rounded-full border-none focus:ring-2 focus:ring-nature-500 focus:bg-white transition-all"
                            disabled={loading || sending}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || loading || sending}
                            className="w-12 h-12 bg-nature-600 hover:bg-nature-700 disabled:bg-earth-300 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                            {sending ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Send size={20} />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chat;
