import React from 'react'

export default function Typing() {
  return (
    <>
      <div className="row-bot">
        <div className="bot-avatar">
          <video src="https://dialbotchat.netlify.app/assistance.mp4"
            className="icon-video"
            autoPlay
            muted
            loop
          />
        </div>
        <div className="bubble-typing">
          <span />
          <span />
          <span />
        </div>
      </div>
    </>
  );
}
