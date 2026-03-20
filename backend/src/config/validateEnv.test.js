const validateEnv = require('./validateEnv');

// Save original env and exit
const originalEnv = { ...process.env };
const originalExit = process.exit;

beforeEach(() => {
  process.env = { ...originalEnv };
  // Mock process.exit to throw instead of killing the test runner
  process.exit = jest.fn((code) => {
    throw new Error(`process.exit(${code})`);
  });
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  process.env = originalEnv;
  process.exit = originalExit;
  jest.restoreAllMocks();
});

describe('validateEnv', () => {
  const validEnv = {
    JWT_SECRET: 'a'.repeat(64),
    POSTGRES_USER: 'bearduser',
    POSTGRES_PASSWORD: 'beardpass123',
    POSTGRES_DB: 'beard_style_db',
    CLAUDE_API_KEY: 'sk-ant-test-key',
    REPLICATE_API_TOKEN: 'r8_testtoken',
    USE_MOCK_AI: 'false',
  };

  test('passes with valid environment', () => {
    Object.assign(process.env, validEnv);
    expect(() => validateEnv()).not.toThrow();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('validated'));
  });

  test('fails when JWT_SECRET is missing', () => {
    Object.assign(process.env, validEnv);
    delete process.env.JWT_SECRET;
    expect(() => validateEnv()).toThrow('process.exit(1)');
  });

  test('fails when JWT_SECRET is a known insecure default', () => {
    Object.assign(process.env, validEnv);
    process.env.JWT_SECRET = 'your_super_secret_jwt_key_here';
    expect(() => validateEnv()).toThrow('process.exit(1)');
  });

  test('fails when JWT_SECRET is too short', () => {
    Object.assign(process.env, validEnv);
    process.env.JWT_SECRET = 'tooshort';
    expect(() => validateEnv()).toThrow('process.exit(1)');
  });

  test('fails when POSTGRES_USER is missing', () => {
    Object.assign(process.env, validEnv);
    delete process.env.POSTGRES_USER;
    expect(() => validateEnv()).toThrow('process.exit(1)');
  });

  test('warns when CLAUDE_API_KEY is missing and USE_MOCK_AI is not true', () => {
    Object.assign(process.env, validEnv);
    delete process.env.CLAUDE_API_KEY;
    process.env.USE_MOCK_AI = 'false';
    validateEnv();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('CLAUDE_API_KEY'));
  });

  test('does not warn about CLAUDE_API_KEY when USE_MOCK_AI is true', () => {
    Object.assign(process.env, validEnv);
    delete process.env.CLAUDE_API_KEY;
    process.env.USE_MOCK_AI = 'true';
    validateEnv();
    expect(console.warn).not.toHaveBeenCalledWith(expect.stringContaining('CLAUDE_API_KEY'));
  });

  test('fails in production with localhost FRONTEND_URL', () => {
    Object.assign(process.env, validEnv);
    process.env.NODE_ENV = 'production';
    process.env.FRONTEND_URL = 'http://localhost:3000';
    expect(() => validateEnv()).toThrow('process.exit(1)');
  });

  test('fails in production with default POSTGRES_PASSWORD', () => {
    Object.assign(process.env, validEnv);
    process.env.NODE_ENV = 'production';
    process.env.FRONTEND_URL = 'https://beardstyle.app';
    process.env.POSTGRES_PASSWORD = 'beardpass123';
    expect(() => validateEnv()).toThrow('process.exit(1)');
  });
});
