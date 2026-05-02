// src/app.ts
import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { notFound, errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './modules/auth/auth.route';
import userRoutes from './modules/user/user.route';
import attendanceRoutes from './modules/attendance/attendance.route';
import mealRoutes from './modules/meal/meal.route';
import noticeRoutes from './modules/notice/notice.route';
import utilityRoutes from './modules/utility/utility.route';
import routineRoutes from './modules/routine/routine.route';

dotenv.config();

const app: Express = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Welcome Route
app.get('/', (req, res) => {
  res.send('Welcome To Hall Management Software');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/utilities', utilityRoutes);
app.use('/api/routines', routineRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
