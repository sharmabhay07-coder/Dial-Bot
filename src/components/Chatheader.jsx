import React from 'react'

export default function Chatheader({
  theme,
  onTogglesidebar,
  onToggletheme,
}) {
  return (
    <>
      <div className="chat-header">
        <div className="avatar">
          <video src="/assistance.mp4"
            className="icon-video"
            autoPlay
            muted
            loop
          />
        </div>
        <div className="header-info">
          <span className="header-name">DialBot</span>
          <span className="header-status">
            <span className="status-dot" />
            Online
          </span>
        </div>
        <button className="theme-btn" onClick={onToggletheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </>
  );
}
