import React from 'react'

export default function Message({ message, messageIndex, onDelete }) {

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    alert("Message Copied!")
  };

  return (
    <>
      <div className={`row ${message.role}`}>
        {message.role === 'bot' && (
          <div className="bot-avatar">
            <video
              src="/assistance.mp4"
              className="icon-video"
              autoPlay
              muted
              loop
            />
          </div>
        )}
        <div className={`bubble ${message.error ? 'error' : ''}`}>
          <p>{message.text}</p>
          <span className="time">{message.time}</span>
          <div className="message-actions">
            <button className="action-btn"
              onClick={() => copyMessage(message.text)}
              title="copy"
            >
              🗐
            </button>
            {/* <button className="action-btn"
              onClick={() => onDelete(messageIndex)}
              title="Delete"
            >
              ❌
            </button> */}
          </div>
        </div>

      </div>
    </>
  )
}
