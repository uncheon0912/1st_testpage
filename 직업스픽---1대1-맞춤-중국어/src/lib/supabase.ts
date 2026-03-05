import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise fallback to provided credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pbeawneymoepgfybsedh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Q0ro8m_ZBoi4-ths8JN8xA_tgDRPi_p';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
