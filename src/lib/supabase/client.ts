import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, ANON_KEY } from "../constants";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, ANON_KEY);
}
