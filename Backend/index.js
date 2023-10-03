const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 4001;

// Enable CORS for all routes
app.use(cors()); // Use cors middleware

app.use(express.json());

app.get('/verifyFilePath', (req, res) => {
  const filePath = req.query.path;

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Read the file content if it exists
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    res.status(200).json({ isPathValid: true, fileContent });
  } else {
    res.status(404).json({ isPathValid: false, fileContent: '' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
