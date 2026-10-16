// Supabaseのプロジェクト設定からURLとanon keyを取得して書き換えてください
const _supabaseUrl = 'https://rtgaonjndhsbpynarbch.supabase.co';
const _supabaseAnonKey = 'sb_publishable_JwPBvLrPeoD9pO6878jGZQ_ZH7NbtXH';

const supabase = window.supabase.createClient(_supabaseUrl, _supabaseAnonKey);
