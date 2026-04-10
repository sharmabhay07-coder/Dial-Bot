import React from 'react'
import Message from './Message'
import Typing from './Typing'

export default function Messagelist({
  messages,
  loading,
  bottomRef,
  onDeletemessage,
}) {
  return (
    <>
      <div className="messages">
        {messages.map((msg, i) => (
          <Message
            key={i}
            message={msg}
            messageIndex={i}
            // onDelete={onDeletemessage}
          />
        ))}

        {loading && <Typing />}

        <div ref={bottomRef} />

      </div>
    </>
  );
}
