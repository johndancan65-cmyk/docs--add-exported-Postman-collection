const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let students = [
  { id: 1, name: "John Doe", age: 20, course: "Computer Science" },
  { id: 2, name: "Jane Smith", age: 22, course: "Software Engineering" }
];

app.post('/students', (req, res) => {
  const { name, age, course } = req.body;
  if (!name || typeof age!== 'number' ||!course) {
    return res.status(400).json({ status: "error", message: "Invalid input. Ensure name, age (as a number), and course are provided." });
  }
  const maxId = students.reduce((max, s) => s.id > max? s.id : max, 0);
  const newStudent = { id: maxId + 1, name, age, course };
  students.push(newStudent);
  res.status(201).json({ status: "success", data: newStudent });
});

app.get('/students', (req, res) => {
  res.status(200).json({ status: "success", data: students });
});

app.get('/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).json({ status: "error", message: "Student not found." });
  }
  res.status(200).json({ status: "success", data: student });
});

app.put('/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).json({ status: "error", message: "Student not found." });
  }
  const { name, age, course } = req.body;
  if (name) student.name = name;
  if (age!== undefined) {
    if (typeof age!== 'number') {
      return res.status(400).json({ status: "error", message: "Age must be a number." });
    }
    student.age = age;
  }
  if (course) student.course = course;

  res.status(200).json({ status: "success", data: student });
});

app.delete('/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ status: "error", message: "Student not found." });
  }
  const deletedStudent = students.splice(index, 1);
  res.status(200).json({ status: "success", message: "Student removed.", data: deletedStudent[0] });
});

app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
