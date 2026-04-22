// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

// قراءة المتغيرات
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// --- جملة التشخيص (سنجد النتيجة في Console F12) ---
if (typeof window !== 'undefined') {
    console.log("🔍 Supabase URL:", supabaseUrl);
    console.log("🔑 Supabase Key:", supabaseAnonKey ? "يوجد مفتاح" : "المفتاح مفقود!");
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ خطأ: لم يتم العثور على متغيرات البيانات في .env.local");
}

// ننشئ النسخة ونقوم بتصديرها (export)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export { createClient }