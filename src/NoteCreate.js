import React, { useState } from 'react';

const NoteCreate = ({ addNote }) => {
  const [noteText, setNoteText] = useState('');

  const handleTextChange = (e) => {
    setNoteText(e.target.value);
  };

  const handleAddNote = () => {
    addNote(noteText);
    setNoteText('');
  };

  return (
    <div>
      <textarea className='note'
        value={noteText}
        onChange={handleTextChange}
        placeholder="note"
      />
      <div style={{ position: 'relative', marginTop: '10px' }}>
        {noteText && (
          <button className='addNoteButton'
            onClick={handleAddNote}
            style={{
              fontSize: '20px',
            }}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteCreate;
