require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const authRouter = require('./routes/auth');
const studentsRouter = require('./routes/students');
const testSessionsRouter = require('./routes/testSessions');
const interventionsRouter = require('./routes/interventions');
const reportsRouter = require('./routes/reports');
const miniGamesRouter = require('./routes/miniGamesRoutes');

const authenticate = require('./middleware/authenticate');

const app = express();

const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
]);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests and same-origin tools without Origin header.
      if (!origin) return callback(null, true);

      if (allowedOrigins.has(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  }),
);
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
