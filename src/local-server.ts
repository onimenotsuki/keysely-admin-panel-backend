import express from 'express';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from './handlers/hello-world';
import dotenv from 'dotenv';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.all('/*', async (req, res) => {
  logger.info(`Received request: ${req.method} ${req.path}`);

  // Construct API Gateway Event
  const event: Partial<APIGatewayProxyEvent> = {
    path: req.path,
    httpMethod: req.method,
    headers: req.headers as { [name: string]: string },
    queryStringParameters: req.query as { [name: string]: string },
    body: JSON.stringify(req.body),
    isBase64Encoded: false,
  };

  try {
    const result = await handler(event as APIGatewayProxyEvent);

    // Parse body if it's a string
    let body = result.body;
    try {
      if (typeof result.body === 'string') {
        body = JSON.parse(result.body);
      }
    } catch (e) {
      // keep as string if parsing fails
    }

    res.status(result.statusCode).set(result.headers).send(body);
  } catch (error) {
    logger.error({ err: error }, 'Error invoking function');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  logger.info(`Local server listening at http://localhost:${port}`);
});
