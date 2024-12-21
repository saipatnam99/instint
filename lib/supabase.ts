import { createClient } from '@supabase/supabase-js';

// Access the Supabase environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
