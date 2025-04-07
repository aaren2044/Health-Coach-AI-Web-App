import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Mic, Volume2 } from 'lucide-react';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Get configuration from environment variables
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAILbWN9EAoj8S2hzYQRhIgtdM3--a5EI0';
  const FULL_API_URL = `${API_URL}?key=${API_KEY}`;

  const toggleChat = () => setIsOpen(!isOpen);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setLoading(true);
    const newMessages = [
      ...messages,
      { sender: 'user', text: inputText },
    ];
    setMessages(newMessages);
    setInputText('');

    try {
      if (!API_KEY) throw new Error('Gemini API key is not configured');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: inputText }],
            role: "user"
          }],
          generationConfig: {
            temperature: 0.9,
            topP: 1,
            topK: 40,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_ONLY_HIGH"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_ONLY_HIGH"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_ONLY_HIGH"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_ONLY_HIGH"
            }
          ]
        }),
      });
      

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from AI');
      }

      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "I couldn't generate a response. Please try again.";
      
      const updatedMessages = [...newMessages, { sender: 'bot', text: botResponse }];
      setMessages(updatedMessages);
      speakText(botResponse);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...newMessages, { 
        sender: 'bot', 
        text: error instanceof Error ? error.message : 'Sorry, there was an error processing your message.' 
      }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis?.cancel();
      }
    };
  }, [isOpen, messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 text-white flex justify-between items-center">
              <h3 className="font-medium">Health Assistant</h3>
              <button 
                onClick={toggleChat}
                className="p-1 rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="h-64 p-3 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 p-4">
                  <MessageSquare className="w-8 h-8 mb-2" />
                  <p>Ask me anything about your health or medications</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-2 ${message.sender === 'bot' ? 'text-left' : 'text-right'}`}
                  >
                    <div className={`inline-block p-2 px-3 rounded-lg max-w-[90%] ${
                      message.sender === 'bot' 
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {message.text}
                      {message.sender === 'bot' && (
                        <button 
                          onClick={() => speakText(message.text)}
                          className="ml-2 p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          disabled={isSpeaking}
                          aria-label="Speak response"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
              {loading && (
                <div className="text-left">
                  <div className="inline-block p-2 px-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                    <Loader2 className="animate-spin w-4 h-4" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Type your message..."
                  disabled={loading}
                  aria-label="Chat input"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-400 dark:disabled:bg-blue-700"
                  disabled={loading || !inputText.trim()}
                  aria-label="Send message"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                </button>
                {isSpeaking && (
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    aria-label="Stop speaking"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white"
            aria-label="Open chat"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatbot;
