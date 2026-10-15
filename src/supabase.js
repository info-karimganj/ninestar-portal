import { createClient } from '@supabase/supabase-js';

// Environment variables or fallback to user project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cllzdcmyndfiqnonxlbe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHpkY215bmRmaXFub254bGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMDQ4NjMsImV4cCI6MjEwNzU4MDg2M30.dD73k9aM8jLD6rM7MRjQjBdI5b0bEbdBaRV6WZZOB5U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
