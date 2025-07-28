const express = require('express');
const path = require('path');
//const cloudBros = require('cloud-bros');

const app = express();

// app.use(cloudBros());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port);
