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
// DATASET (YOUR TIMETABLE)
// =====================
let schedule = [
  {
    id: 1,
    subject: "SIA 101",
    teacher: "Mr. Nathaniel",
    day: "Monday",
    startTime: "08:00",
    endTime: "09:30",
    room: "A204"
  },
  {
    id: 2,
    subject: "PF 102",
    teacher: "Ms. Llyod",
    day: "Monday",
    startTime: "10:00",
    endTime: "11:30",
    room: "A202"
  },
  {
    id: 3,
    subject: "GEC 12",
    teacher: "Mrs. Vilma",
    day: "Tuesday",
    startTime: "08:00",
    endTime: "09:30",
    room: "E202"
  },
  {
    id: 4,
    subject: "GEC 9",
    teacher: "Mr. Noel",
    day: "Wednesday",
    startTime: "10:00",
    endTime: "11:00",
    room: "Virtual Class"
  }
];

let currentId = 5;

// =====================
// CRUD OPERATIONS
// =====================

// GET ALL
app.get("/schedule", (req, res) => {
  res.json(schedule);
});

// GET BY ID
app.get("/schedule/:id", (req, res) => {
  const item = schedule.find(s => s.id == req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

// CREATE
app.post("/schedule", (req, res) => {
  const { subject, teacher, day, startTime, endTime, room } = req.body;

  if (!subject || !teacher || !day || !startTime || !endTime || !room) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newItem = {
    id: currentId++,
    subject,
    teacher,
    day,
    startTime,
    endTime,
    room
  };

  schedule.push(newItem);
  res.status(201).json(newItem);
});

// UPDATE
app.put("/schedule/:id", (req, res) => {
  const item = schedule.find(s => s.id == req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });

  Object.assign(item, req.body);
  res.json(item);
});

// DELETE
app.delete("/schedule/:id", (req, res) => {
  const index = schedule.findIndex(s => s.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });

  const deleted = schedule.splice(index, 1);
  res.json(deleted);
});

// =====================
// EXTRA ENDPOINTS (REQUIRED 10+)
// =====================

// filter by day
app.get("/schedule/day/:day", (req, res) => {
  res.json(schedule.filter(s => s.day.toLowerCase() === req.params.day.toLowerCase()));
});

// search
app.get("/schedule/search", (req, res) => {
  const q = (req.query.subject || "").toLowerCase();
  res.json(schedule.filter(s => s.subject.toLowerCase().includes(q)));
});

// room filter
app.get("/schedule/room/:room", (req, res) => {
  res.json(schedule.filter(s => s.room.toLowerCase() === req.params.room.toLowerCase()));
});

// today schedule
app.get("/schedule/today", (req, res) => {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const today = days[new Date().getDay()];
  res.json(schedule.filter(s => s.day === today));
});

// stats
app.get("/schedule/stats", (req, res) => {
  const stats = {};
  schedule.forEach(s => {
    stats[s.day] = (stats[s.day] || 0) + 1;
  });

  res.json({
    total: schedule.length,
    perDay: stats
  });
});

// =====================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});