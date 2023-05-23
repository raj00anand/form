const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://aranandraj02:raj-anand@cluster0.odmbdit.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Define resource schema
const resourceSchema = new mongoose.Schema({
  fullName: String,
  resume: String,
  technologies: [String]
});

// Create resource model
const Resource = mongoose.model('Resource', resourceSchema);

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve the form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/submit', upload.single('resume'), (req, res) => {
  const fullName = req.body.fullName;
  const resumePath = req.file.path;
  const technologies = req.body.technology;

  // Create a new resource document
  const resource = new Resource({
    fullName: fullName,
    resume: resumePath,
    technologies: technologies
  });

  // Save the resource to the database
    resource.save().then(()=>{
        console.log("Resource saved successfully");
        res.redirect('/dashboard');
    })
    .catch((err)=>{
        console.error('Error saving resource:', err);
        res.status(500).send('Error saving resource');
    });
});

// Display all resources on the dashboard
app.get('/dashboard', (req, res) => {
  Resource.find({}).then((resources)=>{
    res.send(resources);
  })
  .catch((err)=>{
    console.log("Error fetching resources:", err);
    res.status(500).send("Error fetching resources");
  })
});



// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});