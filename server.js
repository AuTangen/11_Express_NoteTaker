const express = require('express');
const PORT = process.env.PORT || 3000;
const path = require('path')
const fs = require('fs');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('./helpers/fsUtils');

// const api_routes = require('./routes/api_routes.js');
const notes = require('./db/db.json')
const uuid = require('./helpers/uuid');


const app = express();

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.delete('/api/notes/:id', (req, res) => {
  const noteID = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteID);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${noteID} has been deleted 🗑️`);
    });
});


app.get('/', (client_request, server_response) => {
    server_response.sendFile(path.join(process.cwd(), 'public/index.html'));
  });


app.get('/notes', (client_request, server_response) => {
    server_response.sendFile(path.join(process.cwd(), 'public/notes.html'));
  });

app.get('/api/notes', (client_request, server_response) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf-8", (err, data) => {
    if (err) {
      return res.status(400).json({ err });
    }
    server_response.json(JSON.parse(data));
  })
  });

app.post('/api/notes', (client_request, server_response) => {

    const { title, text } = client_request.body
    if ( title && text) {
    
    const newNote = {
      title,
      text,
      id: uuid()
    }
    // console.log(newNote)
   
      fs.readFile('db/db.json', 'utf-8', (err, data) => {
        if(err) throw err;
        data = JSON.parse(data);
        data.push(newNote);
        
        fs.writeFile(`./db/db.json`, JSON.stringify(data, null, '\t'), (err) =>
           err
            ? console.error(err)
            : console.log(
                `${newNote.title} has been written to JSON file`
             )
             
      );
      // server_response.sendFile(path.join(process.cwd(), 'public/notes.html'));
      server_response.json(notes)
      });
      
    }
    })
   
    
app.listen(PORT, () => console.log('Listening on port %s', PORT));