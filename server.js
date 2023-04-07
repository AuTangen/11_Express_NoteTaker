const express = require('express');
const PORT = process.env.PORT || 3000;
const path = require('path')
const fs = require('fs');

// const api_routes = require('./routes/api_routes.js');
const notes = require('./db/db.json')
const uuid = require('./helpers/uuid');


const app = express();

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (client_request, server_response) => {
    server_response.sendFile(path.join(process.cwd(), 'public/index.html'));
  });


app.get('/notes', (client_request, server_response) => {
    server_response.sendFile(path.join(process.cwd(), 'public/notes.html'));
  });

app.get('/api/notes', (client_request, server_response) => {
    server_response.json(notes);
  });

app.post('/api/notes', (client_request, server_response) => {

    const { title, text } = client_request.body
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
      
      });
    server_response.json('I cant get this to update the list until after server restart')
    })
    
app.listen(PORT, () => console.log('Listening on port %s', PORT));