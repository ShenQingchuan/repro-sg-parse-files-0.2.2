import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const mockFilesDir = join(__dirname, './mockFiles');

export function getRandomNum(n = 1, m = 100) {
  var num = Math.floor(Math.random() * (m - n + 1) + n)
  return num
}

export function consoleLog(msg: string) {
  process.stdout.write(`${msg}\n`);
}