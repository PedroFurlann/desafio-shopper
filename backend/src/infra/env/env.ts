import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  GOOGLE_API_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
