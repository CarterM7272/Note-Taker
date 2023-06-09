const express = require('express');
const PORT = process.env.PORT || 3001;


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

appendFile.listen(PORT, (err_ => {
  if (err) console.log(err);
  console.log(`App listening on Post: ${PORT}`)
}));


app.get('/', (req, res) => res.send(''))

app.get('/send', (req, res) => 
  res.sendFile(path.join(__dirname, 'public/'))
)

app.get('/api/notes', (req, res) => {

})

if (title && text) {
  const newNote = {
    title,
    text
  }

  
  const noteReview = JSON.stringify(newNote);


  fs.writeFile(`./db/db.json`, noteReview, (err) => {
    
  })

  const response = {
    status: 'success',
    body: newNote
  }




}