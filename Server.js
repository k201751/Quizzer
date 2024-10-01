const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());  // Parse JSON bodies

// Replace with your own MongoDB URI
mongoose.connect('mongodb+srv://broicharge:7JEdhm5iZM2ab1zv@quizzer-server.rs6gm.mongodb.net/?retryWrites=true&w=majority&appName=Quizzer-server', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("connected to Mongo atlas"))
.catch(err => console.error("MongoDB Atlas connection error:", err));
const UserSchema = new mongoose.Schema({
  rollNumber: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Sign Up route
app.post('/signup', async (req, res) => {
  const { rollNumber, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ rollNumber });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user in the database
  const user = new User({ rollNumber, password: hashedPassword });
  await user.save();

  res.json({ message: "User created successfully" });
});

// Login route
app.post('/login', async (req, res) => {
  const { rollNumber, password } = req.body;

  const user = await User.findOne({ rollNumber });
  if (!user) return res.status(400).json({ message: "Invalid roll number or password" });

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid roll number or password" });

  // Generate JWT
  const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

  res.json({ token });
});

// Protect routes using middleware (example)
const auth = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Example of a protected route
app.get('/dashboard', auth, (req, res) => {
  res.json({ message: "Welcome to the dashboard" });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
