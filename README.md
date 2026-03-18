# Stack AI - Take Me Home

[![CI](https://github.com/rubeniskov/stack-ai-take-me-home/actions/workflows/ci.yml/badge.svg)](https://github.com/rubeniskov/stack-ai-take-me-home/actions/workflows/ci.yml)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Personal taste and best practices

### Automated Code Quality (Git Hooks)

To ensure the codebase adheres to React good practices and maintains high code quality standards throughout in development cycle, I implemented an automated linting and formatting pipeline using Husky and lint-staged.Husky: Manages native Git hooks to prevent "dirty" code from being committed to the repository.lint-staged.

### Standardized Commit Messages

To maintain a clear and readable project history, I have enforced the Conventional Commits specification using Commitlint.

- Enforcement: A commit-msg Husky hook intercepts every commit to validate the message format.

- Structure: Commits must follow the pattern: type(scope): description (e.g., feat(api): add useDrive hook for file indexing).

### Testing Suite

I have implemented a testing pipeline to ensure UI/UX quality and functional stability.

- Test Runner: Vitest (optimized for Next.js and fast execution).

- Snapshots: Used for lib/api/drive.ts to ensure API response structures remain consistent.

- Execution:
  - `pnpm test`: Runs all tests once (ideal for CI/CD).
  - `pnpm run test:watch`: Continuous testing during development.

- Safety Gate: Tests are integrated into the Git pre-commit hook via Husky, ensuring that no breaking changes to the Google Drive connection or Knowledge Base indexing are pushed to the repository.

### CI/CD

I have implemented a GitHub Actions workflow to automate the testing, linting, and formatting checks on every push or pull request to the `main` branch.

- **Workflow**: [.github/workflows/ci.yml](.github/workflows/ci.yml)
- **Steps**:
  - **Lint**: Ensures the code follows ESLint rules.
  - **Format**: Verifies that the code is formatted with Prettier.
  - **Test**: Runs the unit tests using Vitest.
- **Environment**: Node.js 22, pnpm 9, Ubuntu.
