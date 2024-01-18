# Infuser

## Overview

- [Brief](#brief)
- [Setup](#setup)
  - [1. Install Node.js](#1-install-nodejs)
  - [2. Configure environment](#2-configure-environment)
  - [3. Generate PrismaClient](#3-generate-prismaclient)
  - [4. Deploy migrations](#4-deploy-migrations)
  - [5. Build project](#5-build-project)
  - [6. Run application](#6-run-application)

## Brief

Infuser is a fullstack users and posts management application. The application has a monorepo structure powered by [Turborepo](https://turbo.build/repo). It has two workspaces as defined in [package.json](./package.json) file: [apps](./apps) and [packages](./packages). As the names imply, [apps](./apps) workspace includes both backend and frontend applications, while [packages](./packages) workspace presents a shared codebase for both applications. [Backend](./apps/backend) and [frontend](./apps/frontend) applications reside in [apps](./apps) directory as two different applications. Backend application has all the task requirements implemented with [NestJS](https://nestjs.com/), while frontend application is powered by [Angular](https://angular.io/). Regarding the database connectivity, [Prisma ORM](https://www.prisma.io/) has been used for automated migrations and type-safe database interaction with a remote [PostgreSQL](https://www.postgresql.org/) database.

## Setup

### 1. Install Node.js

Install [Node.js](https://nodejs.org/en/) and verify the correct installation by checking the versions of **node** and **npm**:

```bash
node -v
npm -v
```

> **Note**: This project has been developed on **Node.js v20.11.0**.

Install the dependencies for the project:

```bash
npm install
```

### 2. Configure environment

Copy [.env.example](./.env.example) and rename to `.env` - `cp .env.example .env` - which sets the environment variables, such as `PORT`, `DATABASE_URL`. Update the variables as per your details.

### Scripts

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "start": "node apps/backend/dist/main",
    "generate": "prisma generate",
    "migrate": "prisma migrate deploy"
  }
}
```

### 3. Generate PrismaClient

You will need to generate **PrismaClient** for your application to infer correct types.

```bash
npm run generate
```

### 4. Deploy migrations

Deploy the migrations to your database.

```bash
npm run migrate
```

### 5. Build project

This will build both backend and frontend applications in parallel.

```bash
npm run build
```

### 6. Run application

After the process finishes, **NestJS** will serve the built frontend application as an SPA. This eliminates the need for two different deployments, while ensuring that **NestJS** serves the API requests initiated from the frontend application. Execute the following command to start the application.

```bash
npm start
```

Now, simply navigate to `localhost:{PORT}` to explore the application.

> **Note**: Although this manual process is completely okay, I preferred to write a [Dockerfile](./Dockerfile) to build and deploy the project on [Railway](https://railway.app/).

**[⬆ Back to top](#overview)**
