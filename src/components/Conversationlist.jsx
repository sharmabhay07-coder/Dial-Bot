import React from 'react'
export default function Conversationlist({
  conversations,
  currentConvid,
  onLoadConversations,
  onDeleteConversations,
}) {

  return (
    <>
      <div className="conversation-list">
        {conversations.map(conv => (
          <div key={conv.id}
            className={`conv-item ${conv.id === currentConvid ? 'active' : ''}`}
            onClick={() => onLoadConversations(conv.id)}
          >
            <div className="conv-content">
              <div className="conv-title"> {conv.title}</div>
              <div className="conv-date">
                {new Date(conv.updatedAt).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
            <button className="delete-conv-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this conversation?')) {
                  onDeleteConversations(conv.id);
                }
              }}
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
