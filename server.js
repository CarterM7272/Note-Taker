const express = require('express');
const fs = require('fs');
const path = require('path');
const { v1: uuidv1 } = require('uuid');

const id = uuidv1();

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set the MIME type for CSS files
app.use('/css', express.static(path.join(__dirname, 'public/css'), { 
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'text/css');
  }
}));


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading the database' });
    }

    try {
      // Parse the data to an array of notes
      const notes = JSON.parse(data);
      res.status(200).json(notes);
    } catch (parseErr) {
      console.error(parseErr);
      res.status(500).json({ message: 'Error parsing the database' });
    }
  });
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ message: 'Please enter a title and text to add a note.' });
  }

  const newNote = {
    id,
    title,
    text,
  };

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading the database' });
    }

    try {
      // Parse the existing data to an array of notes
      const notes = JSON.parse(data);

      // Add the new note to the array
      notes.push(newNote);

      // Write the updated data back to the db.json file
      fs.writeFile('./db/db.json', JSON.stringify(notes), (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
          return res.status(500).json({ message: 'Error writing to the database' });
        }

        // Respond with the new note as a JSON response
        res.status(201).json(newNote);
      });
    } catch (parseErr) {
      console.error(parseErr);
      res.status(500).json({ message: 'Error parsing the database' });
    }
  });
});

// Endpoint to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const noteIdToDelete = req.params.id;

  // Read the existing data from the JSON file
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading the database' });
    }

    try {
      // Parse the data to an array of notes
      let notes = JSON.parse(data);

      // Find the index of the note to delete based on the id
      const noteIndexToDelete = notes.findIndex(note => note.id === noteIdToDelete);

      if (noteIndexToDelete === -1) {
        // If the note with the provided id is not found, return a 404 response
        return res.status(404).json({ message: 'Note not found' });
      }

      // Remove the note from the array using splice
      notes.splice(noteIndexToDelete, 1);

      // Write the updated data back to the JSON file
      fs.writeFile('./db/db.json', JSON.stringify(notes), (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
          return res.status(500).json({ message: 'Error writing to the database' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'Delete Successful' });
      });
    } catch (parseErr) {
      console.error(parseErr);
      res.status(500).json({ message: 'Error parsing the database' });
    }
  });
});




app.get('/', (req, res) => 
  res.sendFile(path.join(__dirname, '/public/index.html'))
)

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`App listening on Post: ${PORT}`);
});




