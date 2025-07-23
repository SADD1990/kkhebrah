
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { continueChat } from '../services/geminiService';
import { ChatbotIcon, CloseIcon, SendIcon, LoadingSpinner, LogoIcon } from './Icons';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'init',
            sender: 'bot',
            text: 'أهلاً بك في خِبرة! أنا "كيب"، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟',
            timestamp: new Date().toISOString()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: String(Date.now()),
            sender: 'user',
            text: input,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const botResponseText = await continueChat(input);

        const botMessage: ChatMessage = {
            id: String(Date.now() + 1),
            sender: 'bot',
            text: botResponseText,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    }, [input, isLoading]);

    return (
        <>
            <div className={`fixed bottom-5 right-5 z-50 transition-transform duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-indigo-700 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all"
                    aria-label="افتح المساعد الذكي"
                >
                    <ChatbotIcon className="w-8 h-8"/>
                </button>
            </div>

            <div className={`fixed bottom-0 right-0 md:bottom-5 md:right-5 w-full h-full md:w-[400px] md:h-[600px] bg-white rounded-none md:rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full md:translate-y-10 opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <header className="flex-shrink-0 bg-gray-100 p-4 flex justify-between items-center border-b rounded-t-none md:rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <LogoIcon className="w-8 h-8 text-teal-500" />
                        <h3 className="font-bold text-gray-800 text-lg">مساعد خِبرة الذكي (KIB)</h3>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800" aria-label="أغلق المحادثة">
                        <CloseIcon className="w-6 h-6"/>
                    </button>
                </header>

                {/* Messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'bot' && <LogoIcon className="w-8 h-8 text-teal-500 flex-shrink-0 mb-1" />}
                            <div className={`max-w-xs md:max-w-sm p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-700 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start items-end gap-2">
                             <LogoIcon className="w-8 h-8 text-teal-500 flex-shrink-0 mb-1" />
                            <div className="bg-gray-200 text-gray-800 p-3 rounded-2xl rounded-bl-none">
                                <LoadingSpinner className="w-5 h-5 text-indigo-500" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <footer className="flex-shrink-0 p-3 bg-white border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="اسأل عن أي شيء..."
                            className="flex-1 w-full bg-slate-100 border-2 border-transparent rounded-full py-2.5 px-4 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 disabled:bg-gray-400 transition-colors flex-shrink-0">
                            <SendIcon className="w-6 h-6 transform -rotate-12"/>
                        </button>
                    </form>
                </footer>
            </div>
        </>
    );
};

export default Chatbot;
