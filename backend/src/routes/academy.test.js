jest.mock('../models/User', () => ({ getLessonProgress: jest.fn(), completeLesson: jest.fn() }));
jest.mock('../services/claudeService', () => ({}));
jest.mock('../middleware/auth', () => ({
  authenticateToken: (req,res,next) => { req.user = { userId: 7 }; next(); },
  authenticateUser: (req,res,next) => next(),
}));
const express = require('express');
const request = require('supertest');
const User = require('../models/User');
const app = express();
app.use(express.json());
app.use('/api/user', require('./userRoutes'));
beforeEach(() => jest.clearAllMocks());
test('returns completed lessons for the authenticated user', async () => {
  User.getLessonProgress.mockResolvedValue([{ lesson_id: 'bb1', course_id: 'beard-basics' }]);
  const response = await request(app).get('/api/user/lessons/progress');
  expect(response.status).toBe(200);
  expect(response.body.completedLessons[0].lesson_id).toBe('bb1');
  expect(User.getLessonProgress).toHaveBeenCalledWith(7);
});
test('accepts real lesson completion', async () => {
  User.completeLesson.mockResolvedValue({ lesson_id: 'ps1' });
  const response = await request(app).post('/api/user/lessons/complete').send({ courseId: 'precision-styles', lessonId: 'ps1' });
  expect(response.status).toBe(201);
  expect(User.completeLesson).toHaveBeenCalledWith(7, 'precision-styles', 'ps1');
});
test.each([
  { courseId: 'beard-basics', lessonId: 'ps1' },
  { courseId: '__proto__', lessonId: 'bb1' },
  { courseId: ['beard-basics'], lessonId: 'bb1' },
  { courseId: 'beard-basics' },
])('rejects malformed or mismatched completion %j', async body => {
  const response = await request(app).post('/api/user/lessons/complete').send(body);
  expect(response.status).toBe(400);
  expect(User.completeLesson).not.toHaveBeenCalled();
});
