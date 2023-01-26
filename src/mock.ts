import { join } from 'node:path'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { getRandomNum, mockFilesDir } from './shared';

type AvailableExtType = 'js' | 'jsx' | 'ts' | 'tsx'

function randomGenerateContent(ext: AvailableExtType) {
  const randomNum = getRandomNum(1, 100)
  if (randomNum >= 30 && randomNum < 60) {
    // static import statements
    return `import { something } from 'pkg-${getRandomNum()}';
import otherThing from 'pkg-${getRandomNum()}';
${
  ext.startsWith('ts')
    ? `import type { SomeType } from 'pkg-${getRandomNum()}';`
    : ''
}`
  } else if (randomNum >= 60 && randomNum < 80) {
    // dynamic import with no variable interpolation
    return `const something1 = import('./dynamic-plain-${getRandomNum()}/some-file-1');
const something2 = import('./dynamic-plain-${getRandomNum()}/some-file-2');
const something3 = import('./dynamic-plain-${getRandomNum()}/some-file-3');`
  } else if (randomNum >= 80 && randomNum <= 100) {
    // dynamic import with variable interpolation
    return `const something1 = import(\`./dynamic-interpolation-\${${getRandomNum()}}/some-file-1\`);
const something2 = import(\`./dynamic-interpolation-\${${getRandomNum()}}/some-file-2\`);
const something3 = import(\`./dynamic-interpolation-\${${getRandomNum()}}/some-file-3\`);`
  }

  // Don't generate import statements
  return Array.from(
    { length: 10 },
    (_, i) => `const n${i+1} = ${randomNum};`
  ).join('\n')
}

function randomPickFileExt(): AvailableExtType {
  const randomNum = getRandomNum(1, 100)
  if (randomNum >= 30 && randomNum < 60) {
    return 'js'
  } else if (randomNum >= 60 && randomNum < 80) {
    return 'jsx'
  } else if (randomNum >= 80 && randomNum <= 100) {
    return 'tsx'
  }
  return 'ts'
}

async function createMockFile(index: Number) {
  const ext = randomPickFileExt();
  const randomFileName = `test-file-${index}-${randomUUID()}.${ext}`;
  const content = randomGenerateContent(ext);
  await writeFile(
    join(mockFilesDir, randomFileName),
    content,
    { encoding: 'utf-8' }
  )
}

async function cleanMockFilesDir() {
  if (existsSync(mockFilesDir)) {
    await rm(mockFilesDir, { recursive: true, force: true });
  }
  await mkdir(mockFilesDir, { recursive: true });
}

async function generateMockFiles() {
  await cleanMockFilesDir();

  for (let i = 0; i < 1e4; ++i) {
    await createMockFile(i+1);
  }

  console.log('\033[32mMock files generation finished.\033[0m');
}

generateMockFiles();
