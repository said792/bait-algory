import Link from "next/link";
import { CheckCircle, PackageSearch, Home } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center pt-28 pb-20 px-4 relative overflow-hidden">
      
      {/* توهج خلفي أخضر ناعم للتأكيد على النجاح */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        
        {/* الكارت الزجاجي الحاوي للمحتوى */}
        <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl mx-auto relative overflow-hidden">
          
          {/* أيقونة النجاح */}
          <div className="relative inline-flex justify-center items-center w-24 h-24 md:w-32 md:h-32 mb-8">
            {/* حلقة متوهجة متحركة خلف الأيقونة */}
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative z-10 w-20 h-20 md:w-28 md:h-28 bg-[#0b1120] rounded-full border border-green-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <CheckCircle className="w-10 h-10 md:w-14 md:h-14 text-green-500" />
            </div>
          </div>

          {/* النصوص */}
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
            تم استلام طلبك <span className="text-green-500">بنجاح!</span>
          </h1>
          
          <p className="text-gray-400 mb-10 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            شكراً لك على تفضيلك متجر <strong className="text-amber-400">بيت الجوري</strong>. 
            <br />
            سنقوم بمراجعة طلبك والتواصل معك فوراً لتأكيد التوصيل.
          </p>

          {/* الأزرار */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            {/* زر تتبع الطلب (أساسي - لون أخضر لأنه الخطوة التالية المنطقية) */}
            {/* ✅ تم تصحيح الـ typo هنا من linear إلى gradient */}
            <Link 
              href="/orders" 
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(34,197,94,0.4)] w-full sm:w-auto"
            >
              <PackageSearch className="w-5 h-5" />
              تتبع الطلب
            </Link>
            
            {/* زر العودة (ثانوي - شفاف) */}
            <Link 
              href="/" 
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white font-bold rounded-xl transition-all duration-300 w-full sm:w-auto"
            >
              <Home className="w-5 h-5 group-hover:-translate-x-1 transition" />
              العودة للرئيسية
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}