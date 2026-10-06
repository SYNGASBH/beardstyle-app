jest.mock('./config/validateEnv', () => jest.fn());
jest.mock('./config/database', () => ({ pool: { query: jest.fn().mockResolvedValue({}), end: jest.fn().mockResolvedValue() } }));
jest.mock('./routes/authRoutes', () => require('express').Router());
jest.mock('./routes/userRoutes', () => require('express').Router());
jest.mock('./routes/styleRoutes', () => require('express').Router());
jest.mock('./routes/salonRoutes', () => require('express').Router());
const express = require('express');
const { pool } = require('./config/database');
let app, shutdown, listen, exit, close;
beforeAll(async () => {
  const previous = new Set(process.listeners('SIGTERM'));
  close = jest.fn(callback => callback());
  listen = jest.spyOn(express.application, 'listen').mockReturnValue({ close });
  exit = jest.spyOn(process, 'exit').mockImplementation(() => {});
  app = require('./server');
  shutdown = process.listeners('SIGTERM').find(fn => !previous.has(fn));
  await Promise.resolve();
});
afterAll(() => {
  process.removeListener('SIGTERM', shutdown);
  process.removeListener('SIGINT', shutdown);
  listen.mockRestore();
  exit.mockRestore();
});
function healthHandler() { return app._router.stack.find(layer => layer.route?.path === '/health').route.stack[0].handle; }
function response() { const res = { json: jest.fn(), status: jest.fn() }; res.status.mockReturnValue(res); return res; }
test('health checks PostgreSQL and reports readiness', async () => {
  const res = response();
  await healthHandler()({}, res);
  expect(pool.query).toHaveBeenCalledWith({ text: 'SELECT 1', query_timeout: 3000 });
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ database: 'OK' }));
});
test('health returns 503 without leaking database errors', async () => {
  pool.query.mockRejectedValueOnce(new Error('private connection details'));
  const res = response();
  await healthHandler()({}, res);
  expect(res.status).toHaveBeenCalledWith(503);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ database: 'unavailable' }));
});
test('shutdown closes the HTTP server before draining the pool and is idempotent', async () => {
  shutdown();
  shutdown();
  await Promise.resolve();
  expect(close).toHaveBeenCalledTimes(1);
  expect(pool.end).toHaveBeenCalledTimes(1);
  expect(exit).toHaveBeenCalledWith(0);
});
