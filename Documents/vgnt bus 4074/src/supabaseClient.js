import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dyiczfrxyahondyznegc.supabase.co';
const supabaseKey = 'sb_publishable_9_cVJll0Mt93wXkR5UzOoQ_9zQ5_iUL';

export const supabase = createClient(supabaseUrl, supabaseKey);
