import { parseFiles, SgNode } from "@ast-grep/napi";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { consoleLog, getRandomNum, mockFilesDir } from "./shared";

// 这里是各个搜寻需要的 ast-grep 规则
export const SG_SINGLE_RULES = {
  dynamicImportsHasVar: {
    all: [
      { pattern: '$PATH' },
      { kind: 'template_string' },
      { inside: { pattern: 'import($PATH)' } }
    ]
  },
  dynamicImportsNoVar: {
    all: [
      { kind: 'string' },
      { inside: { pattern: 'import($PATH)' } }
    ]
  },
  staticImports: {
    all: [
      { pattern: '$PATH' },
      { kind: 'string' },
      {
        inside: { 
          kind: 'import_statement',
          not: {
            regex: '^import\\stype'
          }
        },
      }
    ]
  },
} as const
export const SG_RULES = {
  ...SG_SINGLE_RULES,
  allDynamicImports: {
    any: [
      SG_SINGLE_RULES.dynamicImportsHasVar,
      SG_SINGLE_RULES.dynamicImportsNoVar,
    ]
  },
  allImports: {
    any: [
      SG_SINGLE_RULES.dynamicImportsHasVar,
      SG_SINGLE_RULES.dynamicImportsNoVar,
      SG_SINGLE_RULES.staticImports,
    ]
  }
} as const
export type PIONEER_SG_RULE_TYPE = keyof typeof SG_RULES;
export function findAllFromSgRoot(sgRoot: SgNode, rule: PIONEER_SG_RULE_TYPE) {
  return sgRoot.findAll({
    rule: SG_RULES[rule]
  })
}

async function readAllFilePaths() {
  const fileNames = await readdir(mockFilesDir);
  return fileNames.map(
    fileName => join(mockFilesDir, fileName)
  );
}

async function runAstGrepParse(
  allPaths: string[],
  records: Map<string, Set<string>>,
) {
  await parseFiles(
    allPaths,
    (err, result) => {
      const fileName = result.filename();
      if (err) {
        console.error(`File: ${fileName} - Parsing Error ${err}`);
        return;
      }
      consoleLog(`File: ${fileName} - Run callback`);
      const matchedNodes = findAllFromSgRoot(
        result.root(),
        getRandomNum() > 50
          ? 'allDynamicImports'
          : 'allImports'
      )

      if (!records.has(fileName)) {
        records.set(fileName, new Set());
      }
      for (const node of matchedNodes) {
        const importSource = node.text().slice(1. -1); // 掐头去尾引号
        records
          .get(fileName)!
          .add(importSource)
      }
    }
  )
}

async function main() {
  let records = new Map<string, Set<string>>();
  const allPaths = await readAllFilePaths();
  await runAstGrepParse(allPaths, records);
  consoleLog('\n\033[32m --- Main Function Over --- \033[0m\n');
  consoleLog(
    [...records.entries()]
      .map(([fileName, importsSet], i) => `(${i+1}): ${fileName} == Imports ==> ${[...importsSet].join(', ')}`)
      .join('\n')
  )
}

main();
