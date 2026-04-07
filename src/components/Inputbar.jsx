import React from 'react'

export default function Inputbar({
  input,
  loading,
  inputRef,
  onInputchange,
  onKeydown,
  onSendmessage,
}) {
  return (
    <>
      <div className="input-bar">
        <textarea
          ref={inputRef}
          className="input"
          value={input}
          onChange={onInputchange}
          onKeyDown={onKeydown}
          placeholder='Write a message..'
          rows={1}
          disabled={loading}
        />
        <button
          className="send-btn"
          onClick={onSendmessage}
          disabled={loading || !input.trim()}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </>
  );
}
