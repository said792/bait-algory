"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, ChevronLeft, ShieldCheck, Star, Award, LockKeyhole, PackageSearch } from "lucide-react";
import { useCart } from "@/store/cart";

// --- مكون الهيدر ---
function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { items } = useCart();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      <div className={`absolute inset-0 transition-all duration-300 ${
        isScrolled ? "bg-[#0f172a]/80 backdrop-blur-md border-b border-amber-500/20" : "bg-transparent"
      }`}></div>

      <div className="container mx-auto px-4 max-w-7xl relative">
        <nav className="flex justify-between items-center h-20">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-amber-500">
            <Menu size={28} />
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              {/* تأكد أن الصورة موجودة في مجلد public */}
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-sm hidden md:block">
              بيت الجوري
            </span>
          </Link>

          <div className="hidden md:flex gap-8 items-center">
            <Link href="/" className="text-white/90 font-medium hover:text-amber-400 transition relative group">
              الرئيسية
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/products" className="text-gray-400 hover:text-white transition">المنتجات</Link>
            <Link href="/about" className="text-amber-400 font-medium hover:text-amber-300 transition">من نحن</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition">اتصل بنا</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/orders" className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-amber-400 transition">
              <PackageSearch size={16} />
              <span>تتبع الطلب</span>
            </Link>

            <Link href="/admin/login" className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-amber-400 transition">
              <LockKeyhole size={16} />
              <span>الإدارة</span>
            </Link>

            <button className="hidden md:flex text-gray-300 hover:text-amber-400 transition">
              <Search size={22} />
            </button>

            <Link href="/cart" className="relative p-2 rounded-full hover:bg-white/10 transition group">
              <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-amber-400 transition" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-[#0f172a]">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-4 right-4 bg-[#1e293b]/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl z-50 flex flex-col p-6 gap-4 animate-in-up">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold text-lg p-2 border-b border-gray-700">الرئيسية</Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold text-lg p-2 border-b border-gray-700">المنتجات</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-amber-400 font-bold text-lg p-2 border-b border-gray-700">من نحن</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold text-lg p-2 border-b border-gray-700">اتصل بنا</Link>
            
            <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-amber-400 font-bold text-lg p-2 border-b border-gray-700 flex items-center gap-2">
              <PackageSearch size={18} />
              تتبع الطلب
            </Link>
             <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)} className="text-amber-400 font-bold text-lg p-2 border-b border-gray-700 flex items-center gap-2">
              <LockKeyhole size={18} />
              الإدارة
            </Link>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-700">
              <span className="text-gray-400">السلة</span>
              <Link href="/cart" className="bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <ShoppingCart size={18} />
                <span>{totalItems}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default function AboutPage() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; background-color: #0f172a; color: #f8fafc; overflow-x: hidden; }
        .hero-bg { background: radial-gradient(circle at 50% 50%, #1e1b4b 0%, #0f172a 100%); position: relative; }
      `}</style>

      <Header />

      <section className="hero-bg pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            قصة <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">بيت الجوري</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            رحلة من الذوق الرفيع لنعكس فخامة المنازل المصرية والأصالة العربية.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#0f172a]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">رؤيتنا ورسالتنا</h2>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                تأسس "بيت الجوري" على فكرة بسيطة ولكنه عظيمة: أن الإضاءة والديكور ليست مجرد وظائف، بل هي لغة تعبر عن هوية أصحاب المنزل ونظرتهم للجمال.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                نسعى دائماً لتقديم أرقى قطع النجف والتحف التي تجمع بين الأصالة المصرية العريقة والتصاميم العصرية، ليصبح منزلك تحفة فنية تتحدث عنك.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-[#1e293b]/50 p-6 rounded-2xl border border-white/10 text-center">
                  <div className="text-amber-500 text-3xl mb-2">🏛️</div>
                  <h4 className="text-white font-bold">أصالة</h4>
                  <p className="text-xs text-gray-500">تصاميم محلية خالصة</p>
                </div>
                <div className="bg-[#1e293b]/50 p-6 rounded-2xl border border-white/10 text-center">
                  <div className="text-amber-500 text-3xl mb-2">✨</div>
                  <h4 className="text-white font-bold">جودة</h4>
                  <p className="text-xs text-gray-500">مواد خام ممتازة</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-500/20 rounded-3xl blur-2xl"></div>
              {/* ✅ تصحيح الارتفاع واستخدام class Tailwind صحيح */}
              <img 
                src="/hero.jpg" 
                alt="عن بيت الجوري" 
                className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px] border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0b1120]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">لماذا تختارنا؟</h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1e293b]/50 p-8 rounded-3xl border border-white/10 hover:border-amber-500/30 transition group">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition">
                <Award size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">خبرة طويلة</h3>
              <p className="text-gray-400">
                سنوات من الخبرة في اختيار أجمل القطع التي تناسب الذوق المصري الراقي.
              </p>
            </div>

            <div className="bg-[#1e293b]/50 p-8 rounded-3xl border border-white/10 hover:border-amber-500/30 transition group">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">ضمان حقيقي</h3>
              <p className="text-gray-400">
                نضمن لك جودة كل منتج تقتنيه من بيت الجوري، مع خدمة ما بعد البيع.
              </p>
            </div>

            <div className="bg-[#1e293b]/50 p-8 rounded-3xl border border-white/10 hover:border-amber-500/30 transition group">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition">
                <Star size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">تصاميم حصرية</h3>
              <p className="text-gray-400">
                تشكيلات متجددة دورية، لتظل دائماً في طليعة الأناقة والحداثة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* الفوتر */}
      <footer className="bg-[#020617] pt-20 pb-10 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <span className="text-2xl font-black text-amber-400 mb-6 block">بيت الجوري</span>
              <p className="text-gray-400 text-sm leading-relaxed">
                وجهتكم الأولى للذوق الرفيع والأناقة المصرية الأصيلة في مجال النجف والتحف و الادوات و المستلزمات المنزلية.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">روابط سريعة</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/" className="hover:text-amber-400 transition">الرئيسية</Link></li>
                <li><Link href="/products" className="hover:text-amber-400 transition">المنتجات</Link></li>
                <li><Link href="/about" className="hover:text-amber-400 transition">من نحن</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">تواصل معنا</h4>
              <ul className="space-y-3 text-gray-400">
                <li>+20 01015183003</li>
                <li>+20 01220139070</li>
                <li>info@baitaljouri.com</li>
                <li>📍 بشالوش - ميت غمر - دقهلية</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} بيت الجوري. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </>
  );
}