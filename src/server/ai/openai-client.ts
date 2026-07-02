import "server-only";
import OpenAI from "openai";

let client: OpenAI | null = null;
let initialized = false;

export function getClient(): OpenAI | null {
  if (initialized) return client;
  initialized = true;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    client = null;
    return null;
  }

  client = new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  });

  return client;
}

export function getModel(): string {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

export function isAiAvailable(): boolean {
  return getClient() !== null;
}
