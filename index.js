const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yoga", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const conn = mongoose.connection;

conn.once('open', () => {
  console.log('Successfully connected to the database');
});

conn.on('error', (error) => {
  console.error('Error connecting to the database:', error);
  process.exit(1);
});

// Define User Schema and Model
const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  selectedBatch: String, // Add your batch field
});

const UserModel = mongoose.model("users", UserSchema);

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/getUsers", (req, res) => {
  UserModel.find({}).then(function (users) {
    res.json(users);
  }).catch(function (err) {
    console.log(err);
  });
});

// API endpoint for user registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, age, selectedBatch } = req.body;

    // Validate data on the server-side
    if (!name || !age || !selectedBatch) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Additional validation logic for age (adjust as needed)
    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber) || ageNumber < 18 || ageNumber > 65) {
      return res.status(400).json({ error: 'Invalid age. Must be between 18 and 65' });
    }

    // Store user information in the database
    const user = new UserModel({ name, age, selectedBatch });
    await user.save();

    // You can perform additional actions here (e.g., payment processing)

    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


//get single user using id
app.get('/profile/:id', async (req, res) => {
  const user = await UserModel.findById(req.params.id)
  res.status(200).json({
    success: true,
    user
  })
});

//get all users

app.get('/profile', async (req, res) => {
  const user = await UserModel.find({});
  res.status(200).json({
    success: true,
    user
  })
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
