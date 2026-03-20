const jwt = require('jsonwebtoken');
const { authenticateToken, authenticateUser, authenticateSalon, optionalAuth } = require('./auth');

const JWT_SECRET = 'test-secret-key-for-testing-only-min32chars';

beforeAll(() => {
  process.env.JWT_SECRET = JWT_SECRET;
});

function mockReqRes(token) {
  const req = {
    headers: {
      authorization: token ? `Bearer ${token}` : undefined,
    },
    user: null,
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();
  return { req, res, next };
}

describe('authenticateToken', () => {
  test('returns 401 when no token provided', () => {
    const { req, res, next } = mockReqRes(null);
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 403 for invalid token', () => {
    const { req, res, next } = mockReqRes('invalid.token.here');
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('passes with valid token and sets req.user', () => {
    const payload = { userId: 1, email: 'test@test.com', accountType: 'user' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const { req, res, next } = mockReqRes(token);

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.userId).toBe(1);
    expect(req.user.email).toBe('test@test.com');
  });

  test('returns 401 for expired token', () => {
    const token = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: '-1s' });
    const { req, res, next } = mockReqRes(token);

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token expired' });
  });
});

describe('authenticateUser', () => {
  test('passes for user account type', () => {
    const req = { user: { accountType: 'user' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authenticateUser(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('returns 403 for salon account type', () => {
    const req = { user: { accountType: 'salon' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authenticateUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});

describe('authenticateSalon', () => {
  test('passes for salon account type', () => {
    const req = { user: { accountType: 'salon' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authenticateSalon(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('returns 403 for user account type', () => {
    const req = { user: { accountType: 'user' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authenticateSalon(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});

describe('optionalAuth', () => {
  test('sets req.user to null when no token', () => {
    const { req, res, next } = mockReqRes(null);
    optionalAuth(req, res, next);
    expect(req.user).toBeNull();
    expect(next).toHaveBeenCalled();
  });

  test('sets req.user to null for invalid token', () => {
    const { req, res, next } = mockReqRes('bad-token');
    optionalAuth(req, res, next);
    expect(req.user).toBeNull();
    expect(next).toHaveBeenCalled();
  });

  test('sets req.user for valid token', () => {
    const payload = { userId: 5, email: 'test@test.com', accountType: 'user' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const { req, res, next } = mockReqRes(token);

    optionalAuth(req, res, next);

    expect(req.user.userId).toBe(5);
    expect(next).toHaveBeenCalled();
  });
});
