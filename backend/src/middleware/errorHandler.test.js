const errorHandler = require('./errorHandler');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

function mockRes() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
}

describe('errorHandler', () => {
  test('returns 500 for generic errors', () => {
    const err = new Error('Something broke');
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          message: 'Something broke',
          status: 500,
        }),
      })
    );
  });

  test('returns custom status from error', () => {
    const err = new Error('Not found');
    err.status = 404;
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('handles ValidationError', () => {
    const err = new Error('Validation failed');
    err.name = 'ValidationError';
    err.errors = { field: { message: 'Field is required' } };
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('handles PostgreSQL unique violation (23505)', () => {
    const err = new Error('duplicate key');
    err.code = '23505';
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ message: 'Resource already exists' }),
      })
    );
  });

  test('handles PostgreSQL foreign key violation (23503)', () => {
    const err = new Error('foreign key');
    err.code = '23503';
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('hides stack trace in production', () => {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const err = new Error('Secret error');
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    const body = res.json.mock.calls[0][0];
    expect(body.error.stack).toBeUndefined();

    process.env.NODE_ENV = origEnv;
  });

  test('includes stack trace in development', () => {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const err = new Error('Debug error');
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    const body = res.json.mock.calls[0][0];
    expect(body.error.stack).toBeDefined();

    process.env.NODE_ENV = origEnv;
  });
});
