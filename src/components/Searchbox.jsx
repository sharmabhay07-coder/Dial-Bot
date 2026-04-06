import React from 'react'

export default function Searchbox({ searchQuery, onsearchChange }) {
  return (
    <>
      <div className="search-box">
        <input type="text"
          placeholder="Search messages.."
          value={searchQuery}
          onChange={(e) => onsearchChange(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <span className="search-clear" onClick={() => onsearchChange('')}>
            X
          </span>
        )}
      </div>

    </>
  );
}
