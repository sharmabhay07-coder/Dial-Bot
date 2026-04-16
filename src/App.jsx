import React, { useEffect, useRef, useState } from 'react';
import { saveConversations, generateId, } from './utils/Storage.js';
import Sidebar from "./components/Sidebar"
import Chatwindow from './components/Chatwindow';
import './App.css'

// const SYSTEM_PROMPT = "You are DialBot, a friendly and helpful AI assistant. Keep replies clear and concise.";

export default function App() {

  const [conversations, setConversations] = useState(() => {
    try {
      const data = localStorage.getItem('dialbot_conversations');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading conversations:', e);
      return [];
    }
  });
  const [currentConvid, setcurrentConvid] = useState(null);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm DialBot, your AI Assistant. How can i help you Today?", time: timeNow() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [showSidebar, setshowSidebar] = useState(() => window.innerWidth >= 901);
  // const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 767);

  const historyRef = useRef([]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setshowSidebar(width >= 901);
      // setIsMobile(width <= 767);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (currentConvid === null) {
      if (conversations.length === 0) {
        const newConv = {
          id: generateId(),
          title: 'New Chat',
          messages: [{ role: 'bot', text: "Hi! I'm DialBot, your AI assistant. How can I help you today?", time: timeNow() }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setConversations(prev => {
          const updated = [newConv, ...prev];
          saveConversations(updated);
          return updated;
        });
        setcurrentConvid(newConv.id);
        setMessages(newConv.messages);
        historyRef.current = [];
      } else if (conversations[0]?.id) {
        loadConversations(conversations[0].id);
      }
    }
  }, []);

  useEffect(() => {
    if (!currentConvid) return;
    setConversations(prev => {
      if (prev.length === 0) return prev;
      const updated = prev.map(conv => conv.id === currentConvid
        ? { ...conv, messages, updatedAt: new Date().toISOString() } : conv);
      saveConversations(updated);
      return updated;
    });
  }, [messages, currentConvid]);

  function timeNow() {
    return new Date().toLocaleDateString([], { hour: '2-digit', minute: '2-digit' });
  }

  const loadConversations = (convId, convList = conversations) => {
    const conv = convList.find(c => c.id === convId);
    if (conv && conv.messages) {
      setcurrentConvid(convId);
      setMessages(conv.messages);
      historyRef.current = conv.messages
        .filter(m => m.role !== 'bot' || !m.error)
        .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));
    }
  };

  const deleteConversation = (convId) => {
    if (convId === currentConvid && conversations.length > 1) {
      const newCurrent = conversations.find(c => c.id !== convId);
      loadConversations(newCurrent.id);
    }
    const updatedConversations = conversations.filter(c => c.id !== convId);
    setConversations(updatedConversations);
    saveConversations(updatedConversations);
  };

  const updatedConversationsTitle = (convId, title) => {
    setConversations(prev => {
      const updated = prev.map(conv => conv.id === convId ? { ...conv, title } : conv);
      saveConversations(updated);
      return updated;
    });

    // const updatedConversations = conversations.map(conv => conv.id === convId ? { ...conv, title } : conv);
    // setConversations(updatedConversations);
    // saveConversations(updatedConversations);
  }

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: 'user', text, time: timeNow() }]);
    setInput('');
    setLoading(true);

    historyRef.current.push({ role: 'user', content: text });

    if (historyRef.current.length === 1 && currentConvid) {
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate a short 4-5 word chat title for this message: "${text}". Reply with only the title, no quotes, no explanation.`,
          history: []
        }),
      })
        .then(res => res.json())
        .then(data => {
          const title = data.choices?.[0]?.message?.content?.trim();
          if (title) updatedConversationsTitle(currentConvid, title);
        })
        .catch(() => {
          updatedConversationsTitle(currentConvid, text.substring(0, 30) + (text.length > 30 ? '...' : ''));
        });
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyRef.current.slice(0, -1)
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Request Failed');
      if (data.error) throw new Error(data.error);

      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't respond..";
      historyRef.current.push({ role: 'assistant', content: reply });

      const words = reply.split(' ');
      let current = '';
      setMessages(prev => [...prev, { role: 'bot', text: '', time: timeNow() }]);

      for (let i = 0; i < words.length; i++) {
        await new Promise(res => setTimeout(res, 50));
        current += (i === 0 ? '' : ' ') + words[i];
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...updated[updated.length - 1], text: current };
          return updated;
        });
      }
    } catch (err) {
      historyRef.current.pop();

      const msg = err.message.toLowerCase();
      let friendlyError = `Error: ${err.message}`;
      if (msg.includes('quota') || msg.includes('rate') || msg.includes('429')) {
        friendlyError = '⏳ Rate limit hit. Please wait a moment and try again.';
      } else if (msg.includes('401') || msg.includes('api key')) {
        friendlyError = '🔑 Invalid API key. Please check your .env file.';
      } else if (msg.includes('network') || msg.includes('fetch')) {
        friendlyError = '📡 Network error. Please check your connection.';
      }
      setMessages(prev => [...prev, { role: 'bot', text: friendlyError, time: timeNow(), error: true }]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div id="dialbot-root">
        <div className={`screen ${theme}`}>

          <Sidebar
            conversations={conversations}
            currentConvid={currentConvid}
            showSidebar={showSidebar}
            onLoadConversations={(id) => {
              loadConversations(id);
              setshowSidebar(false);
            }}
            onDeleteConversations={deleteConversation}
            onCreatenew={() => {
              const newConv = {
                id: generateId(),
                title: 'New Chat',
                messages: [{ role: 'bot', text: "Hi! I'm DialBot, your AI assistant. How can I help you today?", time: timeNow() }],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              setConversations(prev => {
                const updated = [newConv, ...prev];
                saveConversations(updated);
                return updated;
              });
              setcurrentConvid(newConv.id);
              setMessages(newConv.messages);
              historyRef.current = [];
              setshowSidebar(false);
            }}
            onTogglesidebar={() => setshowSidebar(!showSidebar)}
          />
          {showSidebar && <div className="overlay visible" onClick={() => setshowSidebar(false)} />}

          <Chatwindow
            messages={messages}
            input={input}
            loading={loading}
            theme={theme}
            onInputchange={setInput}
            onSendmessage={sendMessage}
            onTogglesidebar={() => setshowSidebar(!showSidebar)}
            onToggletheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            onDeletemessage={(idx) => setMessages(prev => prev.filter((_, i) => i !== idx))}
          />
        </div>
      </div>
    </>
  )
}