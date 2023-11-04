
const ENV_NAMES = [
  'NEXT_PUBLIC_BACKEND_URL',
  'BACKEND_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'X_API_KEY',
  'FORTY_TWO_CLIENT_ID',
  'FORTY_TWO_CLIENT_SECRET',
]

function checkEnv() {
  const errs = [];
  for (const env of ENV_NAMES) {
    if (!process.env[env]) {
      errs.push(env)
    }
  }
  if (errs.length > 0) {
    console.error("Missing environment variables: ", errs)
    process.exit(1)
  }
}

export function register() {
  checkEnv()
}