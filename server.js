const express = require('express');
const PORT = 3000;
const path = require('path')
const notes = require('./db/db.json')


const app = express();

app.use(express.static('public'));

app.get('/', (client_request, server_response) => {
    server_response.sendFile(path.join(process.cwd(), 'public/index.html'));
  });


app.get('/notes', (client_request, server_response) => {
    server_response.sendFile(path.join(process.cwd(), 'public/notes.html'));
  });

app.get('/api/notes', (client_request, server_response) => {
    server_response.json(notes);
  });

// app.post('/api/notes', (client_request, server_response) => {
//     server_response.json(notes)
//     })

app.listen(PORT, () => console.log('Listening on port %s', PORT));