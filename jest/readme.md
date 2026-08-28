# Setting Up Jest with TypeScript (ESM / `"type": "module"`)

A step-by-step guide to configure Jest in a modern TypeScript project using ECMAScript Modules (ESM).

---

## Step 1: Install Dependencies

Run the following command in your terminal:

```bash
npm install -D typescript jest ts-jest @types/jest @types/node
```

---

## Step 2: Configure `package.json`

Make sure `"type": "module"` is set, and add the test scripts using Node's native ESM flag (`--experimental-vm-modules`):

```json
{
  "name": "your-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "node --experimental-vm-modules ./node_modules/jest/bin/jest.js",
    "test-coverage": "node --experimental-vm-modules ./node_modules/jest/bin/jest.js --coverage",
    "test:watch": "node --experimental-vm-modules ./node_modules/jest/bin/jest.js --watch"
  }
}
```

> **Why?** Node.js requires the `--experimental-vm-modules` flag to allow Jest to run native ES Modules properly.

---

## Step 3: Configure `tsconfig.json`

Create or update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "types": ["jest", "node"],
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true
  },
  "include": ["src", "tests", "jest.config.ts"]
}
```

> **Key Setting:** `"isolatedModules": true` is required by `ts-jest` when using `NodeNext` to prevent compilation warnings.

---

## Step 4: Configure `jest.config.ts`

Create `jest.config.ts` in the project root:

```typescript
import { createDefaultEsmPreset } from "ts-jest";
import type { Config } from "jest";

// 1. Create the default ESM preset from ts-jest
const preset = createDefaultEsmPreset();

const config: Config = {
  ...preset,
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  // 2. Map .js imports back to .ts source files (standard NodeNext ESM resolution)
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  // 3. Optional: Configure code coverage collection
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
  ],
};

export default config;
```

---

## Step 5: How to Import Files in Tests

Because TypeScript is using `NodeNext` module resolution, relative imports in your test and source files should include the `.js` extension (even for TypeScript files):

```typescript
// tests/example.test.ts
import { getEnrollmentMessage } from "../src/01_first_test.js";

describe("getEnrollmentMessage", () => {
  test("returns correct message", () => {
    expect(getEnrollmentMessage(12)).toBe("12 seats left");
  });
});
```

---

## Step 6: Run Tests

- **Run all tests:**
  ```bash
  npm test
  ```

- **Run with code coverage:**
  ```bash
  npm run test-coverage
  ```

- **Run in watch mode:**
  ```bash
  npm run test:watch
  ```