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

app.get('/', (req, res) => 
  res.sendFile(path.join(__dirname, '/public/index.html'))
)

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
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
    
    fs.readFile('./db/db.json', 'utf8', (err, data)  => {
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






app.delete('/api/notes:title', (req,res) => {
  const noteId = req.params.title;
  res.status(200).json({message: 'Delete Successful'})
})




  app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log(`App listening on Post: ${PORT}`);
  });




