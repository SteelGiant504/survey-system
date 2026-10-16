// Supabaseのプロジェクト設定からURLとanon keyを取得して書き換えてください
const _supabaseUrl = 'YOUR_SUPABASE_URL';
const _supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = window.supabase.createClient(_supabaseUrl, _supabaseAnonKey);
