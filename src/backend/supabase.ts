import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase_types.ts"; // After you setup your database types 
// This will import the data inside the .env file on your project
// Be sure to configure the .env base on your supabase project settings API
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);


