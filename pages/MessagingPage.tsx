
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { moderateMessage } from '../services/geminiService';
import { SendIcon } from '../components/Icons';

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    const bubbleClasses = isUser 
        ? 'bg-indigo-700 text-white self-end rounded-l-2xl rounded-t-2xl' 
        : 'bg-gray-200 text-gray-800 self-start rounded-r-2xl rounded-t-2xl';
    
    return (
        <div className={`max-w-md p-3 px-4 shadow-sm ${bubbleClasses}`}>
            <p>{message.text}</p>
            {message.status === 'flagged' && (
                <p className="text-xs mt-1 text-yellow-300 border-t border-yellow-400 pt-1">
                    تم الإبلاغ عن هذه الرسالة لمراجعتها.
                </p>
            )}
        </div>
    );
};

const MessagingPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', text: 'أهلاً بك، كيف يمكنني مساعدتك اليوم في تعلم تصميم الجرافيك؟', sender: 'bot', timestamp: '10:00 AM' },
        { id: '2', text: 'مرحباً! أنا متحمس للبدء. ما هي أول خطوة؟', sender: 'user', timestamp: '10:01 AM' },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;
        
        setIsSending(true);

        const moderationStatus = await moderateMessage(newMessage);

        const userMessage: ChatMessage = {
            id: String(Date.now()),
            text: newMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString('ar-SA'),
            status: moderationStatus
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        
        // Simulate expert reply after a delay
        setTimeout(() => {
            const expertReply: ChatMessage = {
                id: String(Date.now() + 1),
                text: 'سؤال رائع! لنبدأ بأساسيات الألوان والخطوط. سأرسل لك بعض المواد.',
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString('ar-SA')
            };
            setMessages(prev => [...prev, expertReply]);
        }, 1500);

        setIsSending(false);
    }, [newMessage, isSending]);

    return (
        <div className="flex flex-col h-[calc(100vh-220px)] md:h-[calc(100vh-240px)] max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
            <header className="p-4 border-b bg-gray-50 flex items-center gap-4 flex-shrink-0">
                 <img src="https://picsum.photos/seed/ahmed/100/100" alt="أحمد الغامدي" className="w-12 h-12 rounded-full" />
                 <div>
                    <h2 className="text-xl font-bold text-gray-800">أحمد الغامدي</h2>
                    <p className="text-sm text-green-600 flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        متصل الآن
                    </p>
                 </div>
            </header>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto flex flex-col bg-gray-50/50">
                {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-gray-100 border-t flex-shrink-0">
                 <p className="text-xs text-center text-gray-500 mb-2">
                    🔒 لحمايتك، يتم تحليل الرسائل بواسطة الذكاء الاصطناعي للكشف عن الاحتيال أو المحتوى المخالف.
                </p>
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        className="flex-1 w-full bg-white border-2 border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:border-indigo-500 transition-colors"
                        disabled={isSending}
                    />
                    <button type="submit" disabled={isSending || !newMessage.trim()} className="bg-indigo-700 text-white p-3 rounded-full hover:bg-indigo-800 disabled:bg-gray-400 transition-colors flex-shrink-0 shadow-lg">
                        <SendIcon className="w-6 h-6 transform -rotate-12"/>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MessagingPage;
