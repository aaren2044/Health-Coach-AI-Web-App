import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Mic, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Rate limiting configuration
const RATE_LIMIT = {
  WINDOW_MS: 60000, // 1 minute
  MAX_REQUESTS: 30, // Adjust based on your quota
};

const AIGuidance = () => {
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const requestTimestamps = useRef<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          setMessages([...messages, {
            sender: 'bot',
            text: 'Sorry, there was an error with voice recognition. Please try typing instead.'
          }]);
        };

        recognitionRef.current.onend = () => {
          if (isListening) {
            setIsListening(false);
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [messages]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      setMessages([...messages, {
        sender: 'bot',
        text: 'Speech recognition is not supported in your browser. Please use Chrome or Edge.'
      }]);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
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
      const botResponse = await sendMessageToGemini(inputText);
      const updatedMessages = [
        ...newMessages,
        { sender: 'bot', text: botResponse },
      ];
      setMessages(updatedMessages);
      speakText(botResponse);
    } catch (error) {
      console.error('Error in message handling:', error);
      const errorMessage = {
        sender: 'bot',
        text: error instanceof Error ? error.message : 'Sorry, there was an error processing your message. Please try again.',
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkRateLimit = async () => {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT.WINDOW_MS;
    
    requestTimestamps.current = requestTimestamps.current.filter(
      timestamp => timestamp > windowStart
    );
    
    if (requestTimestamps.current.length >= RATE_LIMIT.MAX_REQUESTS) {
      const oldestRequest = requestTimestamps.current[0];
      const waitTime = RATE_LIMIT.WINDOW_MS - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return checkRateLimit();
    }
    
    requestTimestamps.current.push(now);
  };

  const sendMessageToGemini = async (text: string): Promise<string> => {
    await checkRateLimit();
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('Gemini API key is not configured');
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
            generationConfig: {
              temperature: 0.9,
              topP: 1,
              topK: 40,
              maxOutputTokens: 2048,
            }
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Message processing failed');
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response available';
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition duration-200 ease-in-out">
      <h1 className="text-3xl font-bold p-4 text-center text-gray-900 dark:text-white">
        CHATUR Guidance
      </h1>
      
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4">
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`py-2 ${message.sender === 'bot' ? 'text-left' : 'text-right'}`}
              >
                <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
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
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
            
            {loading && (
              <div className="py-2 text-left">
                <div className="inline-block p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                  <Loader2 className="animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form 
            onSubmit={handleSendMessage} 
            className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                className="w-full p-2 pr-10 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type or speak your message..."
                disabled={loading}
              />
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                disabled={loading}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
            <button 
              type="submit"
              className="p-2 bg-gradient-to-r from-primary-from to-primary-to text-white rounded-lg hover:opacity-90 disabled:bg-blue-400 dark:disabled:bg-blue-700"
              disabled={loading || !inputText.trim()}
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Send'}
            </button>
            {isSpeaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Stop
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIGuidance;