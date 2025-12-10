/**
 * Hello World Lambda Handler
 * 
 * This is a placeholder handler that will be replaced with actual handlers
 * as the project develops.
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logger } from '../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info({ event }, 'Hello World Handler started');

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Keysely Admin Panel Backend!',
      timestamp: new Date().toISOString(),
    }),
  };
};

