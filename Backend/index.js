const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');``

const app = express();
const port = 4001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());


app.post('/api/openFile', (req, res) => {
  const filePath = req.body.path;
  const searchValue = req.body.searchValue;

  // Use the 'fs' module to read the file content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading file content');
    } else {
      // Highlight the search value in the file content
      const highlightedContent = data.replace(
        new RegExp(searchValue, 'g'),
        `<span style="background-color: yellow">${searchValue}</span>`
      );

      // Send the highlighted file content as a response
      res.send(highlightedContent);
    }
  });
});


// Define a route to serve file content
app.get('/api/getFileContent', (req, res) => {
  const filePath = req.query.path;

  // Use the 'fs' module to read the file content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading file content');
    } else {
      // Send the file content as a response
      res.send(data);
    }
  });
});



// DetailDashboard old code
// app.post('/backend-endpoint', (req, res) => {
//   const data = req.body;
//   console.log('Received data from frontend:', data);

//   // Verify the file path
//   if (!fs.existsSync(data.path)) {
//     console.error('File not found');
//     res.status(404).send('File not found');
//     return;
//   }

//   // Serve the file to the frontend
//   res.sendFile(data.path); // This sends the file to the client

//   // No need to read the file content here
// });


//  second old code
app.post('/backend-endpoint', (req, res) => {
  const data = req.body;
  console.log('Received data from frontend:', data);

  if (!data || !data.path) {
    console.error('Invalid request data');
    res.status(400).send('Invalid request data');
    return;
  }

  // Verify the file path
  if (!fs.existsSync(data.path)) {
    console.error('File not found');
    res.status(404).send('File not found');
    return;
  }

  // Read the file content
  fs.readFile(data.path, 'utf8', (err, fileContent) => {
    if (err) {
      console.error('Error reading the file:', err);
      res.status(500).send('Error reading the file');
    } else {
      // Serve the file content to the frontend
      res.status(200).send(fileContent);
    }
  });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});















// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const cors = require('cors'); // Import the cors package

// const app = express();
// const port = 4001;

// // Enable CORS for all routes
// app.use(cors()); // Use cors middleware

// app.use(express.json());

// app.get('/verifyFilePath', (req, res) => {
//   const filePath = req.query.path;

//   // Check if the file exists
//   if (fs.existsSync(filePath)) {
//     // Read the file content if it exists
//     const fileContent = fs.readFileSync(filePath, 'utf-8');
//     res.status(200).json({ isPathValid: true, fileContent });
//   } else {
//     res.status(404).json({ isPathValid: false, fileContent: '' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
