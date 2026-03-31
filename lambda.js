// const { configure: serverlessExpress } = require('@vendia/serverless-express');
// const express = require('express');
// const { NestFactory } = require('@nestjs/core');
// const { ExpressAdapter } = require('@nestjs/platform-express');
// const { AppModule } = require('./dist/src/app.module');

// let cachedHandler;

// async function createHandler() {
//   if (cachedHandler) return cachedHandler;

//   const expressApp = express();
//   const adapter = new ExpressAdapter(expressApp);

//   const nestApp = await NestFactory.create(AppModule, adapter, {
//     logger: ['error', 'warn', 'log'],
//   });

//   await nestApp.init();
//   cachedHandler = serverlessExpress({ app: expressApp });
//   return cachedHandler;
// }

// exports.handler = async (event, context) => {
//   const handler = await createHandler();
//   return handler(event, context);
// };

const { configure: serverlessExpress } = require('@vendia/serverless-express');
const express = require('express');
const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { AppModule } = require('./dist/src/app.module');

const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

let cachedHandler;
let cachedSecret;

// 🔐 Secret fetch with caching
async function getSecret() {
  if (cachedSecret) return cachedSecret;

  const data = await secretsManager.getSecretValue({
    SecretId: "prod/crudapp/databseurl1" // 👈 tumhara secret name
  }).promise();

  let secret;

  try {
    // Key/Value case (recommended)
    secret = JSON.parse(data.SecretString);
  } catch (err) {
    // Fallback (plain string)
    secret = { DATABASE_URL: data.SecretString };
  }

  cachedSecret = secret;
  return cachedSecret;
}

async function createHandler() {
  if (cachedHandler) return cachedHandler;

  // ✅ Secret load
  const secret = await getSecret();

  // ✅ ENV inject (IMPORTANT: same key name)
  process.env.DATABASE_URL = secret.DATABASE_URL;

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