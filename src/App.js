import React, { useState, useEffect } from 'react';
import './App.css';
import Note from './Note';

function App() {
  const [notes, setNotes] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Assuming there is a login API endpoint on the server
    fetch('http://localhost:8000/login', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLoggedIn(true);
        } else {
          console.error('Login failed');
        }
      });
  }, []);

  const addNote = () => {
    const newNote = {
      id: notes.length + 1,
      text: '',
    };

    setNotes([...notes, newNote]);
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
  };

  if (!loggedIn) {
    return <div>Loading...</div>; // Add a loading indicator while checking login status
  }

  return (
    <div>
      {notes.map((note) => (
        <Note
          key={note.id}
          id={note.id}
          text={note.text}
          deleteNote={deleteNote}
        />
      ))}
      <button className='AddButton' onClick={addNote}>
        +
      </button>
    </div>
  );
}

export default App;
