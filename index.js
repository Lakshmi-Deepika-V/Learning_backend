const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Dummy data for all courses
const courses = [
  { id: 1, title: "Full Stack Web Development", instructor: "Lakshmi Deepika", category: "web", price: "Free" },
  { id: 2, title: "Python for Data Science", instructor: "John Smith", category: "data", price: "$29.99" },
  { id: 3, title: "UI/UX Design Basics", instructor: "Priya Kumar", category: "design", price: "$19.99" },
  { id: 4, title: "Java Programming Essentials", instructor: "Ravi Narayan", category: "web", price: "Free" },
  { id: 5, title: "Machine Learning Crash Course", instructor: "Ananya Iyer", category: "data", price: "$39.99" },
  { id: 6, title: "Graphic Design for Beginners", instructor: "Karan Mehta", category: "design", price: "$24.99" },
  { id: 7, title: "React.js From Scratch", instructor: "Meera Joseph", category: "web", price: "$34.99" },
  { id: 8, title: "Statistics with Python", instructor: "Akshay R", category: "data", price: "Free" },
  { id: 9, title: "Figma for UI Designers", instructor: "Neha Balan", category: "design", price: "$14.99" }
];

// API endpoint
app.get('/api/courses', (req, res) => {
  res.json(courses);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
