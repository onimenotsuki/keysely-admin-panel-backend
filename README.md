# Keysely Admin Panel Backend

## Abstract

The **Keysely Admin Panel Backend** is a serverless API designed to power the Keysely Admin Panel. Built with **Node.js** and **TypeScript**, it leverages **AWS Lambda** for compute and **AWS CDK** for infrastructure as code, ensuring a scalable, maintainable, and cost-effective architecture.

This project uses **Amazon API Gateway** to trigger Lambda functions, providing a secure and efficient way to handle API requests for Keysely Associates and Support Personnel.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v22.x or later)
- **npm** (v10.x or later)
- **AWS CLI** (configured with your credentials)
- **Docker** (optional, for local container Orchestration)

## Installation

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd keysely-admin-panel-backend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

## Local Development

### Running with Docker Compose

You can run the backend services locally using Docker Compose.

```bash
# Start the services
npm run docker:up

# Stop the services
npm run docker:down
```

### Running Locally (Native)

To run the server locally without Docker:

```bash
# Start the local server
npm start
# OR simply build and watch for changes
npm run watch
```

## Scripts

The `package.json` file includes several helpful scripts for development and deployment:

### Build & Test

- `npm run build`: Compiles the TypeScript code to JavaScript.
- `npm run watch`: Compiles the code in watch mode.
- `npm test`: Runs the Jest test suite.

### Code Quality

- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run lint:fix`: Automatically fixes linting errors.
- `npm run format`: Formats code using Prettier.

### Infrastructure (CDK)

- `npm run cdk:synth`: Synthesizes the CloudFormation template for the stack.
- `npm run cdk:diff`: Compares the local stack with the deployed stack.
- `npm run cdk:deploy`: Deploys the stack to your default AWS account/region.

## Project Structure

- `src`: Application source code, including Lambda handlers.
- `cdk`: AWS CDK infrastructure definitions.
- `tests`: Jest test files.
- `docker-compose.yml`: Docker composition for local environment.

## Architecture

This project is deployed as a secure serverless stack on AWS:

- **API Gateway**: Entry point for all API requests.
- **AWS Lambda**: Serverless compute for handling business logic.
- **AWS CDK**: Infrastructure defined as code for reproducible deployments.

## Agents

For AI agents working on this project, please refer to [AGENTS.md](./AGENTS.md) for deeper context and conventions.
