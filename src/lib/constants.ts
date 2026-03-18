export const ANON_KEY = process.env.NEXT_PUBLIC_STACK_AI_ANON_KEY!;
export const BASE_URL = process.env.NEXT_PUBLIC_STACK_AI_BASE_URL!;
export const SUPABASE_URL = process.env.NEXT_PUBLIC_STACK_AI_SUPABASE_URL!;

if (!ANON_KEY || !BASE_URL || !SUPABASE_URL) {
  throw new Error("Missing environment variables for api configuration");
}
