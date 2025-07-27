const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Middleware
app.use(cors());
app.use(express.json());

// 🔹 Serve static frontend files (optional for static hosting)
app.use(express.static(path.join(__dirname, '../frontend')));

// 🔹 Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// 🔹 User schema & model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  bookmarks: [Number]
});
const User = mongoose.model('User', userSchema);

// 🔹 Sample course list
const courses = [
  { id: 1, title: "Full Stack Web Development", instructor: "Lakshmi Deepika", category: "web", price: "Free", description: "Learn frontend and backend using HTML, CSS, JS, and Node.js." },
  { id: 2, title: "Python for Data Science", instructor: "John Smith", category: "data", price: "$29.99", description: "Explore data analysis, NumPy, pandas, and visualization with Python." },
  { id: 3, title: "UI/UX Design Basics", instructor: "Priya Kumar", category: "design", price: "$19.99", description: "Understand user experience, wireframing, and interface design principles." },
  { id: 4, title: "Java Programming Essentials", instructor: "Ravi Narayan", category: "web", price: "Free", description: "Master object-oriented programming with Java from scratch." },
  { id: 5, title: "Machine Learning Crash Course", instructor: "Ananya Iyer", category: "data", price: "$39.99", description: "Get started with ML concepts, algorithms, and scikit-learn." },
  { id: 6, title: "Graphic Design for Beginners", instructor: "Karan Mehta", category: "design", price: "$24.99", description: "Learn graphic design fundamentals using Canva and Adobe tools." },
  { id: 7, title: "React.js From Scratch", instructor: "Meera Joseph", category: "web", price: "$34.99", description: "Build dynamic web apps using React, components, hooks, and JSX." },
  { id: 8, title: "Statistics with Python", instructor: "Akshay R", category: "data", price: "Free", description: "Understand statistical concepts and implementation using Python." },
  { id: 9, title: "Figma for UI Designers", instructor: "Neha Balan", category: "design", price: "$14.99", description: "Design modern interfaces and prototypes using Figma effectively." }
];

// 🔹 Get all courses
app.get('/api/courses', (req, res) => {
  res.json(courses);
});

// 🔹 Get course by ID
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
});

// 🔹 Register user
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const user = new User({ username, email, password, bookmarks: [] });
    await user.save();
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔹 Login user
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
      password
    });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      message: 'Login successful',
      username: user.username,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔹 Get bookmarks by username or email
app.get('/api/bookmarks/:username', async (req, res) => {
  const userKey = req.params.username;
  try {
    const user = await User.findOne({
  $or: [{ username: userKey }, { email: userKey }]
});
if (!user) return res.status(404).json({ message: 'User not found' });
res.json({ bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
});


// 🔹 Add/remove bookmarks
app.post('/api/bookmarks/:identifier', async (req, res) => {
  const { identifier } = req.params;
  const { courseId, action } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const courseID = Number(courseId);
    if (action === "add" && !user.bookmarks.includes(courseID)) {
      user.bookmarks.push(courseID);
    } else if (action === "remove") {
      user.bookmarks = user.bookmarks.filter(id => id !== courseID);
    }

    await user.save();
    res.json({ message: "Bookmarks updated", bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// 🔹 Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
