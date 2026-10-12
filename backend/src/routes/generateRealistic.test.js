jest.mock('../config/database', () => ({ pool: { query: jest.fn() } }));
jest.mock('../services/replicateService', () => ({
  isAvailable: jest.fn(() => true),
  generateBeardVisualization: jest.fn(async (image, mask, styleSlug) => ({ imageUrl: '/uploads/generated/x.jpg', styleSlug })),
}));
const express = require('express');
const request = require('supertest');
const ReplicateService = require('../services/replicateService');
const styleRoutes = require('./styleRoutes');

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use('/api/styles', styleRoutes);
app.use((err, req, res, next) => res.status(500).json({ error: err.message })); // eslint-disable-line no-unused-vars

const image = 'data:image/jpeg;base64,AAAA';
const engine = process.env.BEARD_ENGINE;
afterEach(() => {
  jest.clearAllMocks();
  if (engine === undefined) delete process.env.BEARD_ENGINE; else process.env.BEARD_ENGINE = engine;
});

test('default edit engine generates without a mask (AR try-on capture)', async () => {
  delete process.env.BEARD_ENGINE;
  const res = await request(app).post('/api/styles/generate-realistic').send({ imageBase64: image, styleSlug: 'van-dyke' });
  expect(res.status).toBe(200);
  expect(res.body).toEqual(expect.objectContaining({ success: true, imageUrl: '/uploads/generated/x.jpg' }));
  expect(ReplicateService.generateBeardVisualization).toHaveBeenCalledWith(image, undefined, 'van-dyke', expect.any(Object));
});

test('inpaint engine still requires a mask', async () => {
  process.env.BEARD_ENGINE = 'inpaint';
  const res = await request(app).post('/api/styles/generate-realistic').send({ imageBase64: image, styleSlug: 'van-dyke' });
  expect(res.status).toBe(400);
  expect(ReplicateService.generateBeardVisualization).not.toHaveBeenCalled();
});

test('image and style remain required', async () => {
  expect((await request(app).post('/api/styles/generate-realistic').send({ styleSlug: 'van-dyke' })).status).toBe(400);
  expect((await request(app).post('/api/styles/generate-realistic').send({ imageBase64: image })).status).toBe(400);
});
