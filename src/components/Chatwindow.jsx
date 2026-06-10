import React, { useEffect, useRef } from 'react'
import Chatheader from './Chatheader';
import Messagelist from './Messagelist';
import Inputbar from './Inputbar';

export default function Chatwindow({
  messages,
  input,
  loading,
  theme,
  isNewChat,
  onInputchange,
  onSendmessage,
  onTogglesidebar,
  onToggletheme,
  onDeletemessage,
}) {

  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const isEmpty = messages.length === 0;

  useEffect(() => {
    const el = bottomRef.current?.parentElement;
    if (el && isNearbottom()) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  const isNearbottom = () => {
    const el = bottomRef.current?.parentElement;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  };

  const handleInput = (e) => {
    onInputchange(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
  };

  const handleKeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendmessage();
    }
  };

  const handleSend = () => {
    onSendmessage();
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  return (
    <div className="chat-window">
      <Chatheader
        theme={theme}
        onTogglesidebar={onTogglesidebar}
        onToggletheme={onToggletheme}
      />

      <Messagelist
        messages={messages}
        loading={loading}
        bottomRef={bottomRef}
        onDeletemessage={onDeletemessage}
      />

      <Inputbar
        input={input}
        loading={loading}
        inputRef={inputRef}
        isEmpty={isNewChat}
        onInputchange={handleInput}
        onSendmessage={handleSend}
        onKeydown={handleKeydown}
      />
    </div>
  );
}