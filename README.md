# NestJS CRUD API on AWS Lambda (container image via ECR)

A NestJS CRUD API backed by PostgreSQL (TypeORM). It's packaged as an **AWS Lambda container image** (pushed to Amazon ECR) using `@vendia/serverless-express`.

## Tech Stack

NestJS 11 · TypeScript · TypeORM · PostgreSQL (`pg`) · `@nestjs/config` · AWS Lambda (Node.js 20 base image) · Docker (multi-stage, buildx-aware)

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Hello / health |
| `POST` | `/employees` | Create an employee |
| `GET` | `/employees` | List employees |
| `GET` | `/employees/:id` | Get one employee |
| `PUT` | `/employees/:id` | Update an employee |
| `DELETE` | `/employees/:id` | Delete an employee |

`Employee` entity fields: `id`, `name`, `position`, `department`. A `User` entity also exists (`src/user`).

> TypeORM runs with `synchronize: true`, so tables are created automatically. Don't use that setting against a production database.

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Local HTTP port (default `3000`) |

```env
DATABASE_URL=your_postgres_connection_string_here
PORT=3000
```

## Run locally

```bash
git clone https://github.com/KahafSameer/nest_crud_Operation_ECR_Lambda_AWS_Meissasoft.git
cd nest_crud_Operation_ECR_Lambda_AWS_Meissasoft
npm install
npm run start:dev
```

## Build the Lambda image

The `Dockerfile` builds the app with `node:20`, then copies `dist/` and `lambda.ts` (as `index.js`) into `public.ecr.aws/lambda/nodejs:20`. The Lambda handler is `index.handler`.

```bash
docker buildx build --platform linux/amd64 -t nest-crud-lambda .
# then tag and push to ECR, and create a Lambda function from the image
```

> **Note:** `lambda.ts` requires `@vendia/serverless-express` and `express`, but neither is listed in `package.json`. Add them (`npm install @vendia/serverless-express express`) before building the image.

## Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Run with watch mode |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run the compiled app |
| `npm run lint` / `npm run format` | ESLint / Prettier |
| `npm test` / `test:e2e` / `test:cov` | Tests |
