const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));



app.get('/', (req, res) => 
  res.sendFile(path.join(__dirname, 'public/index.html'))
)

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'))
})

app.post('/api/notes', (req,res) => {

  if (title && text) {
    const noteRequirements = {
      title,
      text
    }
    
    fs.readFile('./db/db.json', 'utf8', (err, data)  => {
      if (err) {
        console.error(err);
      } else {
        const newNote = JSON.parse(data);
        
        newNote.push(noteRequirements)

        fs.writeFile(`./db/db.json`, newNote, (err) => {
      
        })





      }
    })
  

  
    const response = {
      status: 'success',
      body: newNote,
    }
  }})

app.delete('/api/notes', (req,res) => {
  
})

// const { title, text } = req.body


  app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log(`App listening on Post: ${PORT}`);
  });




