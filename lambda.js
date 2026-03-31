const { configure: serverlessExpress } = require('@vendia/serverless-express');
const express = require('express');
const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { AppModule } = require('./dist/src/app.module');

let cachedHandler;

async function createHandler() {
  if (cachedHandler) return cachedHandler;

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const nestApp = await NestFactory.create(AppModule, adapter, {
    logger: ['error', 'warn', 'log'],
  });

  await nestApp.init();
  cachedHandler = serverlessExpress({ app: expressApp });
  return cachedHandler;
}

exports.handler = async (event, context) => {
  const handler = await createHandler();
  return handler(event, context);
};

