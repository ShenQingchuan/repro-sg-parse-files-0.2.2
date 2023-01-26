# Bug Reproduce for ast-grep 0.2.2 `parseFiles`

## How to use

0. Run `npm i` to install dependencies.
1. Run `npm run mock` to create 10000 mock files under `src/mockFiles` directories,
2. Run `npm run parse` to run reproduction process.

## Bug description

You could see this kind of output:

```txt
File: /workspace/repro-sg-parse-files/src/mockFiles/test-file-7304-7bf21e37-8fda-473d-8d0f-74804dd95620.js - Run callback
File: /workspace/repro-sg-parse-files/src/mockFiles/test-file-7303-9f5f76c6-b72f-46bf-a2b7-1c1e01c01a56.tsx - Run callback
File: /workspace/repro-sg-parse-files/src/mockFiles/test-file-7302-d89a12ba-0e94-4e3f-bd95-a0b3ff1fca4e.tsx - Run callback
File: /workspace/repro-sg-parse-files/src/mockFiles/test-file-7301-c85276ef-f257-4563-bc63-74ca8084f8ec.js - Run callback
File: /workspace/repro-sg-parse-files/src/mockFiles/test-file-7300-649fcf13-ce01-4f6f-900b-da37d249b6ca.tsx - Run callback

 --- Main Function Over ---

/workspace/repro-sg-parse-files/src/mockFiles/test-file-9999-5113bbf8-4df2-4bde-b3de-3f13155ede8a.tsx == Imports ==>
/workspace/repro-sg-parse-files/src/mockFiles/test-file-9998-eadc0534-fc86-4a20-acd7-e95d60410f31.ts == Imports ==> './dynamic-plain-65/some-file-1', './dynamic-plain-34/some-file-2', './dynamic-plain-43/some-file-3'
File: /Users/bytedance/repro-sg-parse-files/src/mockFiles/test-file-1000-d473afad-1769-43f4-ba5d-8ef2bcfd100d.js - Run callback
File: /Users/bytedance/repro-sg-parse-files/src/mockFiles/test-file-10-dfb747d7-4007-42d5-b81b-17dc3a35d2c7.jsx - Run callback
File: /Users/bytedance/repro-sg-parse-files/src/mockFiles/test-file-1-2dd70aa9-77a6-4411-ba35-0231b9d386aa.ts - Run callback
```

After `--- Main Function Over ---` there're still `Run callback` output.

the async function `runAstGrepParse` is not worked as expected, it should end after every callback function synchronously executed.
