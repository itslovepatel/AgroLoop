import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, Loader2, AlertTriangle, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { UserType } from '../types';

interface Message {
    id: string;
    created_at: string;
    sender_id: string;
    sender_role: 'farmer' | 'buyer' | 'admin' | 'system';
    content: string;
    is_read: boolean;
    message_type: 'text' | 'offer' | 'system' | 'blocked';
    was_filtered?: boolean;
}

interface DealContext {
    cropType: string;
    quantity: number;
    pricePerTon: number;
    location: string;
    bidAmount?: number;
}

interface ChatProps {
    isOpen: boolean;
    onClose: () => void;
    conversationId?: string;
    listingId?: string;
    bidId?: string;
    otherUserId: string;
    otherUserName: string;
    dealContext?: DealContext;
}

// Filter phone numbers, links, emails from message
const filterMessage = (content: string): { filtered: string; wasFiltered: boolean } => {
    let filtered = content;
    let wasFiltered = false;

    // Phone numbers (Indian format)
    if (/\d{10}|\+91\d{10}|\d{5}[\s-]\d{5}/.test(filtered)) {
        filtered = filtered.replace(/\d{10}|\+91\d{10}|\d{5}[\s-]\d{5}/g, '[phone hidden]');
        wasFiltered = true;
    }

    // URLs
    if (/https?:\/\/[^\s]+|www\.[^\s]+/i.test(filtered)) {
        filtered = filtered.replace(/https?:\/\/[^\s]+|www\.[^\s]+/gi, '[link hidden]');
        wasFiltered = true;
    }

    // Emails
    if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(filtered)) {
        filtered = filtered.replace(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, '[email hidden]');
        wasFiltered = true;
    }

    // WhatsApp
    if (/whatsapp|wa\.me/i.test(filtered)) {
        filtered = filtered.replace(/whatsapp|wa\.me[^\s]*/gi, '[contact hidden]');
        wasFiltered = true;
    }

    return { filtered, wasFiltered };
};

const Chat: React.FC<ChatProps> = ({
    isOpen,
    onClose,
    conversationId: propConversationId,
    listingId,
    bidId,
    otherUserId,
    otherUserName,
    dealContext
}) => {
    const { state } = useApp();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [conversationId, setConversationId] = useState(propConversationId);
    const [conversationStatus, setConversationStatus] = useState<'open' | 'closed'>('open');
    const [filterWarning, setFilterWarning] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentUserId = state.user?.id;
    const currentUserRole = state.user?.type === UserType.FARMER ? 'farmer' : 'buyer';

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
                // Get conversation status
                const { data: conv } = await supabase
                    .from('conversations')
                    .select('status')
                    .eq('id', propConversationId)
                    .single();
                if (conv) setConversationStatus(conv.status as 'open' | 'closed');
                await fetchMessages(propConversationId);
                setLoading(false);
                return;
            }

            const farmerId = currentUserRole === 'farmer' ? currentUserId : otherUserId;
            const buyerId = currentUserRole === 'buyer' ? currentUserId : otherUserId;

            // Check for existing conversation
            const { data: existingConv } = await supabase
                .from('conversations')
                .select('id, status')
                .eq('farmer_id', farmerId)
                .eq('buyer_id', buyerId)
                .eq('listing_id', listingId || null)
                .single();

            if (existingConv) {
                setConversationId(existingConv.id);
                setConversationStatus(existingConv.status as 'open' | 'closed');
                await fetchMessages(existingConv.id);
            } else {
                // Create new conversation (tied to deal)
                const { data: newConv, error } = await supabase
                    .from('conversations')
                    .insert({
                        listing_id: listingId,
                        bid_id: bidId,
                        farmer_id: farmerId,
                        buyer_id: buyerId,
                        status: 'open'
                    })
                    .select('id')
                    .single();

                if (newConv) {
                    setConversationId(newConv.id);
                    // Add system message
                    await supabase.from('messages').insert({
                        conversation_id: newConv.id,
                        sender_id: currentUserId,
                        sender_role: 'system',
                        content: 'Conversation started. Discuss pricing, quantity, and pickup details.',
                        message_type: 'system'
                    });
                }
                if (error) console.error('Error creating conversation:', error);
            }

            setLoading(false);
        };

        getOrCreateConversation();
    }, [isOpen, currentUserId, otherUserId, listingId, propConversationId, bidId]);

    // Fetch messages
    const fetchMessages = async (convId: string) => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true });

        if (data) {
            setMessages(data as Message[]);
            markMessagesAsRead(convId);
        }
        if (error) console.error('Error fetching messages:', error);
    };

    // Mark messages as read
    const markMessagesAsRead = async (convId: string) => {
        if (!currentUserId) return;

        await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('conversation_id', convId)
            .neq('sender_id', currentUserId);

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
            .channel(`conversation:${conversationId}`)
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

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && !loading) {
            inputRef.current?.focus();
        }
    }, [isOpen, loading]);

    // Send message with filtering
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversationId || !currentUserId || sending) return;
        if (conversationStatus === 'closed') return;

        // Check message count limit (soft limit: 100)
        if (messages.length >= 100) {
            alert('Message limit reached for this conversation.');
            return;
        }

        setSending(true);

        // Filter the message
        const { filtered, wasFiltered } = filterMessage(newMessage.trim());

        if (wasFiltered) {
            setFilterWarning(true);
            setTimeout(() => setFilterWarning(false), 3000);
        }

        const { error } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversationId,
                sender_id: currentUserId,
                sender_role: currentUserRole,
                content: filtered,
                message_type: wasFiltered ? 'blocked' : 'text',
                was_filtered: wasFiltered,
                original_content: wasFiltered ? newMessage.trim() : null
            });

        if (error) {
            console.error('Error sending message:', error);
        } else {
            setNewMessage('');
        }

        setSending(false);
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full sm:w-[420px] h-[85vh] sm:h-[650px] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="bg-nature-600 text-white px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <MessageCircle size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold">{otherUserName}</h3>
                            <p className="text-xs text-white/80">
                                {conversationStatus === 'closed' ? '🔒 Read-only' : '🟢 Active'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Deal Context Header */}
                {dealContext && (
                    <div className="bg-nature-50 border-b border-nature-200 px-4 py-3">
                        <div className="text-xs text-nature-600 font-medium mb-1">DEAL CONTEXT</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-earth-500">Crop:</span>
                                <span className="ml-1 font-medium">{dealContext.cropType}</span>
                            </div>
                            <div>
                                <span className="text-earth-500">Qty:</span>
                                <span className="ml-1 font-medium">{dealContext.quantity}T</span>
                            </div>
                            <div>
                                <span className="text-earth-500">Price:</span>
                                <span className="ml-1 font-medium">₹{dealContext.pricePerTon}/ton</span>
                            </div>
                            <div>
                                <span className="text-earth-500">Location:</span>
                                <span className="ml-1 font-medium truncate">{dealContext.location}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter Warning */}
                {filterWarning && (
                    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-amber-700 text-sm">
                        <AlertTriangle size={16} />
                        Phone numbers, links & emails are hidden to protect your deal.
                    </div>
                )}

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
                            <p className="text-sm">Discuss pricing, quantity & pickup</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender_role === 'system'
                                        ? 'justify-center'
                                        : msg.sender_id === currentUserId
                                            ? 'justify-end'
                                            : 'justify-start'
                                    }`}
                            >
                                {msg.sender_role === 'system' ? (
                                    <div className="bg-earth-200 text-earth-600 text-xs px-3 py-1 rounded-full">
                                        {msg.content}
                                    </div>
                                ) : (
                                    <div
                                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.sender_id === currentUserId
                                                ? 'bg-nature-600 text-white rounded-br-md'
                                                : 'bg-white text-earth-800 rounded-bl-md shadow-sm'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.content}</p>
                                        <div className={`flex items-center gap-1 mt-1 ${msg.sender_id === currentUserId ? 'text-white/70' : 'text-earth-400'
                                            }`}>
                                            <span className="text-xs">{formatTime(msg.created_at)}</span>
                                            {msg.was_filtered && (
                                                <span className="text-xs">• filtered</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                {conversationStatus === 'closed' ? (
                    <div className="p-4 bg-earth-100 border-t border-earth-200 text-center">
                        <Lock size={20} className="inline mr-2 text-earth-400" />
                        <span className="text-earth-500">This conversation is closed</span>
                    </div>
                ) : (
                    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-earth-200">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Discuss price, quantity, pickup..."
                                className="flex-1 px-4 py-3 bg-earth-100 rounded-full border-none focus:ring-2 focus:ring-nature-500 focus:bg-white transition-all"
                                disabled={loading || sending}
                                maxLength={500}
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
                        <p className="text-xs text-earth-400 mt-2 text-center">
                            {messages.length}/100 messages • Keep discussions on-platform
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Chat;
