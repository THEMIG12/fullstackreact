import React, { useState } from 'react';
import './Note.css';

function Note({ id, text, deleteNote}) {
  const [noteText, setNoteText] = useState(text);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    deleteNote(id);
  };

  const handleNoteClick = () => {
    setIsEditing(true);
  };

  return (
    <div className={`note ${isEditing ? 'editing' : ''}`} onClick={handleNoteClick}>
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        rows="4"
        cols="15"
        readOnly={!isEditing}
      />
      <div className="button-container">
        <button onClick={handleDelete} className="delete-button">
          X
        </button>
      </div>
    </div>
  );
}

export default Note;
