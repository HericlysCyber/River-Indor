// ============================================
// CONEXÃO COM O SUPABASE
// ============================================

const SUPABASE_URL = "https://lseofiikzddefnyccirv.supabase.co";

const SUPABASE_KEY = "sb_publishable_zK_5JuelZ6yUSmvXNUajWg_35poIYTE";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
console.log("River Indoor conectado ao Supabase!");
console.log("Cliente Supabase:", supabaseClient);
