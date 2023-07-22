import * as fs from 'fs';

type Env = {
  [key: string]: string | number | any;
};

const envFileData = fs.readFileSync('.env', { encoding: 'utf8' });
const line = envFileData.split('\n').filter((l) => l && !l.startsWith('#'));
const env: Env = {};
line.forEach((l) => {
  const kv = l.split('=');
  const key = kv[0];
  const value = kv[1] || undefined;
  Object.assign(env, { [key]: value });
});

export { env };
