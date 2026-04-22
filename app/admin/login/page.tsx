"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
// ✅ التصحيح: استيراد supabase المجهز مسبقاً
import { supabase } from "@/lib/supabase/client";
import { Lock, ArrowLeft, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // ✅ استخدمنا supabase مباشرة (لم نعد نسخة جديدة بالدالة)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("خطأ في الإيميل أو كلمة المرور");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* توهج خلفي */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* رابط العودة للرئيسية */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
          <ArrowLeft size={20} />
          العودة للموقع
        </Link>

        {/* كارت تسجيل الدخول */}
        <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
          
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-500">
              <Lock size={32} />
            </div>
          </div>

          <h1 className="text-3xl font-black text-center text-white mb-2">لوحة التحكم</h1>
          <p className="text-center text-gray-400 mb-8">أدخل بيانات الدخول للوصول للوحة الإدارة</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-sm mb-2 mr-1">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                placeholder="name@baitaljouri.com"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2 mr-1">كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3.5 rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(245,158,11,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  دخول للإدارة
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}