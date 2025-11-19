import * as cdk from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class KeyselyAdminBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Centralized CloudWatch Log Group for all Lambda functions
    // Note: CloudWatch Logs supports 1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, 3653 days
    // 15 days will round to 14 days (nearest supported value)
    const logGroup = new logs.LogGroup(this, 'KeyselyAdminLogGroup', {
      logGroupName: '/aws/lambda/keysely-admin-logs',
      retention: logs.RetentionDays.TWO_WEEKS, // 14 days (closest to 15 days requirement)
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // GitHub OIDC Identity Provider
    const githubProvider = new iam.OpenIdConnectProvider(this, 'GitHubOIDCProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
      thumbprints: [
        '6938fd4d98bab03faadb97b34396831e3780aea1',
        '1c58a3a8518e8759bf075b76b750d4f2df264fcd',
      ],
    });

    // IAM Role for GitHub Actions with CDK deployment permissions
    const githubActionsRole = new iam.Role(this, 'GitHubActionsRole', {
      roleName: 'KeyselyAdminBackend-GitHubActionsRole',
      assumedBy: new iam.WebIdentityPrincipal(
        githubProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub':
              'repo:onimenotsuki/keysely-admin-panel-backend:ref:refs/heads/main',
          },
        }
      ),
      description: 'IAM Role for GitHub Actions to deploy Keysely Admin Panel Backend',
      maxSessionDuration: cdk.Duration.hours(1),
    });

    // Grant CDK deployment permissions
    githubActionsRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'cloudformation:*',
          's3:*',
          'iam:*',
          'lambda:*',
          'logs:*',
          'apigateway:*',
          'ec2:DescribeVpcs',
          'ec2:DescribeSubnets',
          'ec2:DescribeSecurityGroups',
          'sts:GetCallerIdentity',
        ],
        resources: ['*'],
      })
    );

    // Output the role ARN for reference in GitHub Actions
    new cdk.CfnOutput(this, 'GitHubActionsRoleArn', {
      value: githubActionsRole.roleArn,
      description: 'ARN of the IAM Role for GitHub Actions',
      exportName: 'KeyselyAdminBackend-GitHubActionsRoleArn',
    });

    // Output the log group name
    new cdk.CfnOutput(this, 'LogGroupName', {
      value: logGroup.logGroupName,
      description: 'CloudWatch Log Group for Lambda functions',
      exportName: 'KeyselyAdminBackend-LogGroupName',
    });
  }
}

