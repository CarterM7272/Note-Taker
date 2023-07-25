const express = require('express');
const fs = require('fs');
const path = require('path');

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

app.get("/api/notes", (req, res) => {
    const { title, text } = res.body

  fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.log(err)
    } else {
      const addedNotes = JSON.parse(data);

      
    }
  })
})

app.post('/api/notes', async (req, res) => {

  const { title, text } = req.body

  if (!title || !text) {
    return res.status(500).json(`Please enter in a title or text to add note`)
  }

    const noteRequirements = {
      title,
      text
    }
    
    fs.readFile(path.join(__dirname, './public/notes.html'), 'utf8', (err, data)  => {
      if (err) {
        console.error("err");
      } else {
        const newNote = JSON.parse(data);

        newNote.push(noteRequirements)

        fs.writeFile(`./db/db.json`, JSON.stringify(newNote), (writeErr) => {
          if (writeErr) {
            console.err(writeErr)
          } else {
            const response = {
              status: 'success',
              body: newNote,
            };
            console.log(response);
            res.status(201).json(response)
          }
        }
          )
        }})
})

app.delete('/api/notes/:title', (req, res) => {
  const noteTitleToDelete = req.params.title;

  // Read the existing data from the JSON file
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading the database' });
    }

    try {
      // Parse the data to an array of notes
      const notes = JSON.parse(data);

      // Find the index of the note to delete based on the title
      const noteIndexToDelete = notes.findIndex(note => note.title === noteTitleToDelete);

      if (noteIndexToDelete === -1) {
        // If the note with the provided title is not found, return a 404 response
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




