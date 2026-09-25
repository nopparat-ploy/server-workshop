const express = require('express');
const cors = require('cors');
const app = express();

// Middleware บันทึกล็อกทุกคำขอ (ขั้นที่ 11)
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next(); // ต้องเรียกเสมอ ไม่งั้นคำขอจะค้าง ไปต่อไม่ถึง route
});

app.use(cors());                   // อนุญาตคำขอข้าม origin (ขั้นที่ 18)
app.use(express.json());           // แปลง body ที่เป็น JSON ให้เป็น req.body (ขั้นที่ 9)
app.use(express.static('public')); // เสิร์ฟหน้าเว็บจากโฟลเดอร์ public (ขั้นที่ 16)

let tasks = [
  { id: 1, text: 'เรียน Node.js', done: false },
  { id: 2, text: 'ติดตั้ง VS Code', done: true }
];
let nextId = 3;

// GET /api/tasks และ /api/tasks?done=true — ดึงรายการทั้งหมด / กรองด้วย query string
app.get('/api/tasks', (req, res) => {
  const { done } = req.query;
  if (done === undefined) {
    return res.json(tasks);
  }
  res.json(tasks.filter(t => String(t.done) === done));
});

// GET /api/tasks/:id — ดึงรายการเดียวด้วย route parameter
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'ไม่พบรายการนี้' });
  }
  res.json(task);
});

// POST /api/tasks — เพิ่มรายการใหม่
app.post('/api/tasks', (req, res) => {
  const text = req.body.text;
  if (!text) {
    return res.status(400).json({ error: 'ต้องระบุ text' });
  }
  const newTask = { id: nextId++, text: text, done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id — สลับสถานะ done
app.patch('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'ไม่พบรายการนี้' });
  }
  task.done = !task.done;
  res.json(task);
});

// DELETE /api/tasks/:id — ลบรายการตาม id
app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).end();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
