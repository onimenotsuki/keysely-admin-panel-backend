import * as cdk from 'aws-cdk-lib';
import { execSync } from 'child_process';
import * as path from 'path';

import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class KeyselyAdminBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Centralized CloudWatch Log Group for all Lambda functions
    // Note: CloudWatch Logs supports 1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, 3653 days
    // 15 days will round to 14 days (nearest supported value)
    const logGroup = new logs.LogGroup(this, 'KeyselyAdminLogGroup', {
      logGroupName: '/aws/lambda/keysely-admin-panel-backend-logs',
      retention: logs.RetentionDays.TWO_WEEKS, // 14 days (closest to 15 days requirement)
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Output the log group name (existing)
    new cdk.CfnOutput(this, 'LogGroupName', {
      value: logGroup.logGroupName,
      description: 'CloudWatch Log Group for Lambda functions',
      exportName: 'KeyselyAdminBackend-LogGroupName',
    });

    // -------------------------------------------------------------------------
    // Lambda Layer for node_modules (Production Dependencies)
    // -------------------------------------------------------------------------
    const nodeModulesLayer = new cdk.aws_lambda.LayerVersion(this, 'NodeModulesLayer', {
      code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, '../../'), {
        bundling: {
          image: cdk.aws_lambda.Runtime.NODEJS_20_X.bundlingImage, // Fallback (not used with local bundling if successful)
          local: {
            tryBundle(outputDir: string) {
              try {
                // Check if Bun is installed
                execSync('bun --version', { stdio: 'ignore' });

                // Create nodejs directory required for Lambda Layers
                const layerOutputDir = path.join(outputDir, 'nodejs');
                execSync(`mkdir -p ${layerOutputDir}`);

                // Copy package.json and bun.lockb (if exists)
                execSync(`cp package.json ${layerOutputDir}`, {
                  cwd: path.join(__dirname, '../../'),
                });
                try {
                  execSync(`cp bun.lockb ${layerOutputDir}`, {
                    cwd: path.join(__dirname, '../../'),
                    stdio: 'ignore',
                  });
                } catch (e) {
                  // bun.lockb might not exist
                }

                // Install production dependencies
                execSync('bun install --production', { cwd: layerOutputDir });

                return true;
              } catch (error) {
                console.error('Local bundling via Bun failed:', error);
                return false;
              }
            },
          },
        },
      }),
      compatibleRuntimes: [cdk.aws_lambda.Runtime.NODEJS_20_X],
      description: 'Layer containing production node_modules',
    });

    // -------------------------------------------------------------------------
    // Handler Configuration Helper
    // -------------------------------------------------------------------------
    const createKeyselyLambda = (id: string, entry: string, handler: string = 'index.default') => {
      return new cdk.aws_lambda.Function(this, id, {
        runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
        handler: handler,
        code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, '../../'), {
          // Asset root is project root to allow resolving shared utils
          bundling: {
            image: cdk.aws_lambda.Runtime.NODEJS_20_X.bundlingImage,
            local: {
              tryBundle(outputDir: string) {
                try {
                  execSync('bun --version', { stdio: 'ignore' });

                  // Build command
                  // --target=node: Targets Node.js environment
                  // --external: Exclude dependencies provided by the layer
                  // --define: Replace Bun.env with process.env for Node.js compatibility
                  const cmd = [
                    'bun',
                    'build',
                    entry,
                    '--target=node',
                    '--outfile=' + path.join(outputDir, 'index.js'),
                    '--external',
                    'pino', // Add other externals if needed
                    '--define',
                    'Bun.env=process.env',
                  ].join(' ');

                  execSync(cmd, {
                    cwd: path.join(__dirname, '../../'),
                    stdio: 'inherit',
                  });

                  return true;
                } catch (error) {
                  console.error(`Local bundling for ${id} failed:`, error);
                  return false;
                }
              },
            },
          },
        }),
        layers: [nodeModulesLayer],
        logGroup,
        environment: {
          NODE_ENV: 'production',
          LOG_LEVEL: 'info',
        },
      });
    };

    // -------------------------------------------------------------------------
    // Lambda Functions
    // -------------------------------------------------------------------------

    // Health Check Lambda
    const healthFunction = createKeyselyLambda('HealthFunction', 'src/handlers/health/index.ts');

    // Hello World Lambda
    const helloWorldFunction = createKeyselyLambda(
      'HelloWorldFunction',
      'src/handlers/hello-world/index.ts'
    );

    // Outputs
    new cdk.CfnOutput(this, 'HealthFunctionArn', { value: healthFunction.functionArn });
    new cdk.CfnOutput(this, 'HelloWorldFunctionArn', { value: helloWorldFunction.functionArn });
  }
}
