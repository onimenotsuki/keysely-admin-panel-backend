#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { KeyselyAdminBackendStack } from '../lib/keysely-admin-backend-stack';

const app = new cdk.App();

new KeyselyAdminBackendStack(app, 'KeyselyAdminBackendStack', {
  env: {
    region: 'us-east-1',
  },
  description: 'Keysely Admin Panel Backend - Serverless infrastructure',
});
