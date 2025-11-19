# Keysely Admin Panel Backend

Serverless backend infrastructure for the Keysely Admin Panel, built with AWS CDK, TypeScript, and AWS Lambda.

## Overview

This project provides the infrastructure and backend services for the Keysely Admin Panel - a centralized web portal for Keysely Associates and Support Personnel to manage the marketplace ecosystem. The infrastructure is deployed using AWS CDK (Cloud Development Kit) and runs on AWS Lambda in a serverless architecture.

## Architecture

- **Runtime**: Node.js with TypeScript
- **Infrastructure**: AWS CDK (TypeScript)
- **Compute**: AWS Lambda (Serverless)
- **API**: AWS API Gateway (REST)
- **Logging**: AWS CloudWatch Logs
- **Deployment**: GitHub Actions with OIDC authentication
- **Region**: us-east-1

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.x or higher)
- **npm** (v9.x or higher)
- **AWS CLI** (v2.x or higher)
- **AWS CDK CLI** (v2.x or higher)
- **AWS Account** with appropriate permissions
- **GitHub Repository** with Actions enabled

### AWS Account Setup

1. Configure AWS credentials:
   ```bash
   aws configure
   ```

2. Bootstrap CDK in your AWS account (first time only):
   ```bash
   cdk bootstrap aws://ACCOUNT-ID/us-east-1
   ```

## Project Structure

```
├── src/
│   ├── handlers/              # Lambda function handlers
│   │   ├── hello-world/    # Hello world Lambda
│   ├── layers/                # Shared Lambda layers
│   │   └── common/            # Common utilities
│   └── __tests__/             # Test files
├── cdk/                       # AWS CDK infrastructure
│   ├── bin/                   # CDK app entry point
│   └── lib/                   # CDK stack definitions
├── .github/                   # GitHub configuration
│   ├── workflows/             # CI/CD pipelines
│   └── dependabot.yml         # Dependabot configuration
└── docs/                      # Documentation
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Project

```bash
npm run build
```

### 3. Run Tests

```bash
npm test
```

### 4. Lint and Format Code

```bash
npm run lint
npm run format
```

## CDK Commands

### Synthesize CloudFormation Template

```bash
npm run cdk:synth
```

### View Differences

```bash
npm run cdk:diff
```

### Deploy Stack

```bash
npm run cdk:deploy
```

### Destroy Stack

```bash
cdk destroy
```

## GitHub OIDC Setup

This project uses GitHub OIDC (OpenID Connect) for secure, keyless authentication to AWS. The IAM role and identity provider are automatically created by the CDK stack.

### Initial Manual Deployment

For the first deployment, you'll need to deploy manually to create the IAM role:

1. **Deploy the stack manually:**
   ```bash
   npm run build
   npm run cdk:deploy
   ```

2. **Get the IAM Role ARN from the stack output:**
   After deployment, CDK will output the `GitHubActionsRoleArn`. Copy this value.

3. **Add GitHub Secret:**
   - Go to your GitHub repository: `onimenotsuki/keysely-admin-panel-backend`
   - Navigate to **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `AWS_ROLE_ARN`
   - Value: Paste the role ARN from step 2
   - Click **Add secret**

### Automated Deployments

After the initial setup, all pushes to the `main` branch will automatically:
1. Build the project
2. Synthesize the CDK stack
3. Deploy to AWS using the IAM role via OIDC

The workflow file is located at `.github/workflows/deploy.yml`.

### OIDC Configuration Details

The CDK stack creates:
- **IAM OIDC Identity Provider**: Trusts `token.actions.githubusercontent.com`
- **IAM Role**: `KeyselyAdminBackend-GitHubActionsRole`
- **Trust Policy**: Scoped to `onimenotsuki/keysely-admin-panel-backend` repository, `main` branch only
- **Permissions**: CloudFormation, S3, IAM, Lambda, Logs, API Gateway, and EC2 read permissions

## Infrastructure Components

### CloudWatch Log Group

- **Name**: `/aws/lambda/keysely-admin-logs`
- **Retention**: 14 days (closest to 15 days requirement - CloudWatch Logs supports specific retention periods)
- **Purpose**: Centralized logging for all Lambda functions

### IAM Role for GitHub Actions

- **Name**: `KeyselyAdminBackend-GitHubActionsRole`
- **Purpose**: Allows GitHub Actions to deploy CDK stacks without long-lived credentials
- **Scope**: Limited to the specific repository and main branch

## Development

### Adding New Lambda Functions

1. Create handler in `src/handlers/`
2. Add Lambda function definition in CDK stack
3. Configure API Gateway routes if needed
4. Write tests in `src/__tests__/`

### Adding Lambda Layers

1. Create layer code in `src/layers/`
2. Define layer in CDK stack
3. Attach to Lambda functions as needed

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

- Triggers on push to `main` branch
- Installs dependencies
- Builds the project
- Synthesizes CDK stack
- Deploys to AWS using OIDC authentication

## Security

- **No Long-Lived Credentials**: Uses OIDC for authentication
- **Scoped Permissions**: IAM role limited to specific repository and branch
- **Audit Logging**: All deployments are logged in CloudWatch
- **Least Privilege**: IAM policies follow least privilege principle

## Troubleshooting

### CDK Bootstrap Required

If you see an error about CDK bootstrap:

```bash
cdk bootstrap aws://YOUR-ACCOUNT-ID/us-east-1
```

### GitHub Actions Fails with OIDC Error

1. Verify the `AWS_ROLE_ARN` secret is set correctly
2. Ensure the IAM role exists in AWS
3. Check that the repository name matches: `onimenotsuki/keysely-admin-panel-backend`
4. Verify the branch is `main`

### Deployment Fails

1. Check AWS credentials are configured
2. Verify you have necessary IAM permissions
3. Review CloudFormation stack events in AWS Console
4. Check CloudWatch Logs for detailed error messages

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue in the GitHub repository.

