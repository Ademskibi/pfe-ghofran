require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const authRouter = require('./routes/auth');
const studentsRouter = require('./routes/students');
const testSessionsRouter = require('./routes/testSessions');
const interventionsRouter = require('./routes/interventions');
const reportsRouter = require('./routes/reports');

const authenticate = require('./middleware/authenticate');

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

connectDB();

app.use('/api/auth', authRouter);
app.use('/api/students', authenticate, studentsRouter);
app.use('/api/testSessions', authenticate, testSessionsRouter);
app.use('/api/interventions', authenticate, interventionsRouter);
app.use('/api/reports', authenticate, reportsRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
