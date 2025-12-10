# Keysely Admin Panel Backend - AGENTS.md

> [!NOTE]
> This file guides AI agents working on the Keysely Admin Panel Backend. It provides context on architecture, commands, and conventions not fully detailed in the README.

## Project Overview
This is a **serverless backend** for the Keysely Admin Panel.
- **Goal**: Provide API services for Keysely Associates and Support Personnel.
- **Architecture**: AWS Lambda functions triggered by API Gateway, defined via AWS CDK.
- **Region**: `us-east-1`

## Technology Stack

- **Runtime**: Node.js (v22.x+)
- **Language**: TypeScript
- **Infrastructure**: AWS CDK (v2)
- **CI/CD**: GitHub Actions (OIDC authentication)

## Project Structure
- `src/handlers/`: Source code for Lambda functions.
- `src/layers/`: Common code shared across Lambdas.
- `src/__tests__/`: Unit tests (Jest).
- `cdk/lib/`: Infrastructure definitions (Stacks).
- `cdk/bin/`: CDK app entry point.

## Workflow & Commands
Run these commands from the project root.

### Setup
- **Install dependencies**: `npm install`
- **Configure AWS**: Ensure `aws configure` is set if deploying locally, though CI/CD is preferred.

### Development Loop
1.  **Build**: `npm run build` (Compiles TypeScript)
2.  **Test**: `npm test` (Runs Jest)
3.  **Lint**: `npm run lint` (ESLint)
4.  **Format**: `npm run format` (Prettier)

### Infrastructure (CDK)
- **Synthesize**: `npm run cdk:synth` (Generates CloudFormation template)
- **Diff**: `npm run cdk:diff` (Compare local changes vs deployed stack)
- **Deploy**: `npm run cdk:deploy`
    - *Note*: Requires valid AWS credentials.

## Conventions
### Infrastructure as Code
- **CDK First**: All infrastructure changes (e.g., new Lambdas, permissions) must be defined in `cdk/lib/`.
- **OIDC**: Deployment uses GitHub OIDC. Do not embed long-lived AWS credentials.

### Coding
- **Async/Await**: Use modern async patterns.
- **Strict Types**: Maintain high TypeScript coverage; avoid `any`.
- **Linting**: Respect `.eslintrc.json` and `.prettierrc` rules.

### Logging
- **CloudWatch**: All Lambda logs go to `/aws/lambda/keysely-admin-logs`.
- **Retention**: configured to 14 days.
