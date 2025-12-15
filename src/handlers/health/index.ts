/**
 * Hello World Lambda Handler
 *
 * This is a placeholder handler that will be replaced with actual handlers
 * as the project develops.
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logger } from '../../utils/logger';

const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info({ event }, 'Health Handler invoked');

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Keysely Admin Panel Backend is healthy!',
      timestamp: new Date().toISOString(),
    }),
  };
};

export default handler;
