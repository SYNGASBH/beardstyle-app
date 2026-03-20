/**
 * Environment variable validation - runs at server startup.
 * Blocks boot if critical secrets are missing or insecure.
 */

const INSECURE_JWT_SECRETS = [
  'your_super_secret_jwt_key_here',
  'CHANGE_THIS_TO_A_SECURE_RANDOM_STRING',
  'secret',
  'jwt_secret',
  'changeme',
];

function validateEnv() {
  const errors = [];
  const warnings = [];

  // --- Required variables ---
  if (!process.env.JWT_SECRET) {
    errors.push('Missing required env variable: JWT_SECRET');
  }

  // Database: accept either DATABASE_URL or individual POSTGRES_* vars
  const hasDbUrl = !!process.env.DATABASE_URL;
  const hasDbParts = process.env.POSTGRES_USER && process.env.POSTGRES_PASSWORD && process.env.POSTGRES_DB;
  if (!hasDbUrl && !hasDbParts) {
    errors.push('Missing database config: set DATABASE_URL or POSTGRES_USER + POSTGRES_PASSWORD + POSTGRES_DB');
  }

  // --- JWT Secret strength check ---
  const jwtSecret = process.env.JWT_SECRET || '';
  if (INSECURE_JWT_SECRETS.includes(jwtSecret.toLowerCase())) {
    errors.push(
      'JWT_SECRET is set to an insecure default value. ' +
      'Generate a strong secret: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
    );
  } else if (jwtSecret.length < 32) {
    errors.push(
      `JWT_SECRET is too short (${jwtSecret.length} chars, minimum 32). ` +
      'Generate a strong secret: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
    );
  }

  // --- AI API keys (warn if missing, don't block) ---
  if (!process.env.CLAUDE_API_KEY || process.env.CLAUDE_API_KEY === 'your_claude_api_key_here') {
    if (process.env.USE_MOCK_AI !== 'true') {
      warnings.push('CLAUDE_API_KEY is not set. AI analysis will fail. Set USE_MOCK_AI=true for development without keys.');
    }
  }

  if (!process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_TOKEN === 'your_replicate_api_token_here') {
    if (process.env.USE_MOCK_AI !== 'true') {
      warnings.push('REPLICATE_API_TOKEN is not set. Realistic beard generation will fail.');
    }
  }

  // --- Production-specific checks ---
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.FRONTEND_URL || process.env.FRONTEND_URL.includes('localhost')) {
      errors.push('FRONTEND_URL must be set to a real domain in production (not localhost).');
    }

    if (process.env.POSTGRES_PASSWORD === 'beardpass123') {
      errors.push('POSTGRES_PASSWORD is set to the default value. Use a strong password in production.');
    }
  }

  // --- Output ---
  if (warnings.length > 0) {
    console.warn('\n⚠️  Environment warnings:');
    warnings.forEach(w => console.warn(`   - ${w}`));
    console.warn('');
  }

  if (errors.length > 0) {
    console.error('\n❌ Environment validation failed:');
    errors.forEach(e => console.error(`   - ${e}`));
    console.error('\nFix the issues above and restart the server.');
    console.error('See .env.example for reference.\n');
    process.exit(1);
  }

  console.log('✅ Environment variables validated');
}

module.exports = validateEnv;
