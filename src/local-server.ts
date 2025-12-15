import { logger } from './utils/logger';
import helloWorldHandler from './handlers/hello-world';
import healthCheckHandler from './handlers/health';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const port = parseInt(process.env.PORT || '3000', 10);

async function transformEvent(
  req: Request,
  handler: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>
) {
  const url = new URL(req.url);

  logger.info(`Received request: ${req.method} ${url.pathname}`);

  const headers: { [key: string]: string } = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const query: { [key: string]: string } = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });

  let bodyString: string | null = null;
  if (req.body) {
    bodyString = await req.text();
  }

  // Construct API Gateway Event
  const event: Partial<APIGatewayProxyEvent> = {
    path: url.pathname,
    httpMethod: req.method,
    headers: headers,
    queryStringParameters: query,
    body: bodyString,
    isBase64Encoded: false,
  };

  try {
    const result = await handler(event as APIGatewayProxyEvent);

    return new Response(
      typeof result.body === 'string' ? result.body : JSON.stringify(result.body),
      {
        status: result.statusCode,
        headers: result.headers as HeadersInit,
      }
    );
  } catch (error) {
    logger.error({ err: error }, 'Error invoking function');
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

const routes = {
  '/hello': async (req: Request) => await transformEvent(req, helloWorldHandler),
  '/health': async (req: Request) => await transformEvent(req, healthCheckHandler),
};

const server = Bun.serve({
  development: Bun.env.NODE_ENV !== 'production',
  port,
  routes,
});

logger.info(`Local server listening at http://localhost:${server.port}`);
