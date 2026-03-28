import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { chatWithGemini } from './services/gemini';
import './index.css';

const App = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'model',
      text: "Hello! I am Aayush GPT. I'm an AI assistant created by Aayush Tiwari. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    
    // Add User Message
    const userMessageObj = { id: Date.now(), role: 'user', text: userMsg };
    setMessages(prev => [...prev, userMessageObj]);
    setIsLoading(true);

    try {
      const responseText = await chatWithGemini(messages.slice(1), userMsg); // skip first intro message for history
      const aiMessageObj = { id: Date.now() + 1, role: 'model', text: responseText };
      setMessages(prev => [...prev, aiMessageObj]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'model', text: "Error: Could not connect to the Gemini API." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex item-center justify-center p-4 sm:p-8" style={{ height: '100vh', padding: '2rem', boxSizing: 'border-box' }}>
      <div 
        className="glass-panel w-full max-w-4xl h-full flex flex-col relative overflow-hidden" 
        style={{ width: '100%', maxWidth: '900px', height: '100%', display: 'flex', flexDirection: 'column', margin: '0 auto', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', padding: '0.75rem', borderRadius: '14px', marginRight: '1rem', boxShadow: '0 0 15px var(--accent-glow)' }}>
            <Sparkles color="#fff" size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.5px' }}>Aayush <span style={{ color: 'var(--accent-light)' }}>GPT</span></h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Personal Assistant of Aayush Tiwari</p>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  gap: '1rem'
                }}
              >
                <div style={{
                  background: msg.role === 'user' ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
                  padding: '0.6rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {msg.role === 'user' ? <User size={18} color="#fff" /> : <Bot size={18} color="#fff" />}
                </div>
                
                <div style={{
                  background: msg.role === 'user' ? 'var(--user-msg-bg)' : 'transparent',
                  padding: msg.role === 'user' ? '1rem 1.25rem' : '0.5rem 0',
                  borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '0',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  maxWidth: '80%',
                  border: msg.role === 'user' ? '1px solid var(--border-color)' : 'none'
                }}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
            >
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '12px' }}>
                 <Sparkles size={18} color="var(--accent-light)" className="animate-spin" style={{ animation: 'spin 2s linear infinite' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <span className="dot" style={{ width: 6, height: 6, background: 'var(--text-secondary)', borderRadius: '50%', animation: 'pulse 1.5s infinite 0s' }} />
                <span className="dot" style={{ width: 6, height: 6, background: 'var(--text-secondary)', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.2s' }} />
                <span className="dot" style={{ width: 6, height: 6, background: 'var(--text-secondary)', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.4s' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Aayush GPT..."
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1rem 1.5rem',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--accent-light)'; e.target.style.background = 'rgba(255, 255, 255, 0.06)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.background = 'rgba(255, 255, 255, 0.03)'; }}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              style={{
                background: input.trim() ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '16px',
                width: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                boxShadow: input.trim() ? '0 4px 15px var(--accent-glow)' : 'none'
              }}
            >
              <Send size={20} color={input.trim() ? '#fff' : 'rgba(255,255,255,0.4)'} />
            </button>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default App;
