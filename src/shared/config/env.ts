import { z } from "zod";

const serverEnvSchema = z.object({
  AUTH_GITHUB_ID: z.string().min(1).optional(),
  AUTH_GITHUB_SECRET: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  DIRECT_URL: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
});

export const serverEnv = serverEnvSchema.parse({
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
  AUTH_SECRET: process.env.AUTH_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
});

export const isDatabaseConfigured = Boolean(
  serverEnv.DATABASE_URL && serverEnv.DIRECT_URL
);

export const isGithubAuthConfigured = Boolean(
  serverEnv.AUTH_SECRET &&
    serverEnv.AUTH_GITHUB_ID &&
    serverEnv.AUTH_GITHUB_SECRET
);

export const isOpenAiConfigured = Boolean(serverEnv.OPENAI_API_KEY);
