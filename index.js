const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// FIX: root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =====================
// SIMPLE DATA
// =====================
let schedule = [
  {
    id: 1,
    subjectName: "SIA 101",
    instructorName: "Mr. Nathaniel",
    room: "A204",
    startTime: "08:00 AM",
    endTime: "09:30 AM",
    day: "Monday"
  }
];

// =====================
// CREATE - POST
// =====================
app.post("/schedule", (req, res) => {
  const newItem = {
    id: schedule.length + 1,
    subjectName: req.body.subjectName,
    instructorName: req.body.instructorName,
    room: req.body.room,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    day: req.body.day
  };

  schedule.push(newItem);
  res.status(201).json(newItem);
});

// =====================
// READ - GET ALL
// =====================
app.get("/schedule", (req, res) => {
  res.json(schedule);
});

// =====================
// READ - GET BY ID
// =====================
app.get("/schedule/:id", (req, res) => {
  const item = schedule.find(s => s.id == req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

// =====================
// UPDATE - PUT
// =====================
app.put("/schedule/:id", (req, res) => {
  const item = schedule.find(s => s.id == req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Not found" });
  }

  item.subjectName = req.body.subjectName || item.subjectName;
  item.instructorName = req.body.instructorName || item.instructorName;
  item.room = req.body.room || item.room;
  item.startTime = req.body.startTime || item.startTime;
  item.endTime = req.body.endTime || item.endTime;
  item.day = req.body.day || item.day;

  res.json(item);
});

// =====================
// DELETE - DELETE
// =====================
app.delete("/schedule/:id", (req, res) => {
  schedule = schedule.filter(s => s.id != req.params.id);
  res.json({ message: "Deleted successfully" });
});

// =====================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});