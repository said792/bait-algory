"use client";

import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, ShoppingCart, Menu, ChevronLeft, Truck, ShieldCheck, Phone, Mail, LockKeyhole, PackageSearch, X } from "lucide-react";
import { useCart } from "@/store/cart";

// --- تحديث واجهة المنتجات لتطابق قاعدة البيانات ---
interface Product {
  id: string;
  title: string;
  name: string;
  price: number; // السعر الحالي (الجديد)
  discount_price?: number | null; // السعر القديم (قبل الخصم) - موجود في الـ Schema الجديد
  image?: string;
  images?: string[];
}

// --- مكون الهيدر (بدون تغييرات كبيرة، فقط للتأكد من العملية) ---
function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { items } = useCart();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (window.scrollY > 50 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  const handleCloseMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 transition-all duration-300">
        <div className={`absolute inset-0 transition-all duration-300 ${
          isScrolled ? "bg-[#0f172a]/80 backdrop-blur-md border-b border-amber-500/20" : "bg-transparent"
        }`}></div>

        <div className="container mx-auto px-4 max-w-7xl relative">
          <nav className="flex justify-between items-center h-20">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-amber-500 focus:outline-none">
              <Menu size={28} />
            </button>

            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition shadow-[0_0_15px_rgba(245,158,11,0.1)]">
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
              <Link href="/about" className="text-gray-400 hover:text-white transition">من نحن</Link>
              <Link href="/contact" className="text-amber-400 font-medium hover:text-amber-300 transition">اتصل بنا</Link>
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

          {/* ================= طبقة الخلفية (Overlay) ================= */}
          {isMobileMenuOpen && (
            <div 
              onClick={handleCloseMenu}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] transition-opacity duration-300 flex items-center justify-center p-4"
            >
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="bg-[#1e293b]/95 backdrop-blur-xl border border-amber-500/30 rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 relative"
              >
                <button onClick={handleCloseMenu} className="absolute top-4 left-4 text-gray-400 hover:text-white p-2">
                  <X size={24} />
                </button>

                <Link href="/" onClick={handleCloseMenu} className="text-white font-bold text-xl p-3 border-b border-white/10 text-center block">الرئيسية</Link>
                <Link href="/products" onClick={handleCloseMenu} className="text-white font-bold text-xl p-3 border-b border-white/10 text-center block">المنتجات</Link>
                <Link href="/about" onClick={handleCloseMenu} className="text-white font-bold text-xl p-3 border-b border-white/10 text-center block">من نحن</Link>
                <Link href="/contact" onClick={handleCloseMenu} className="text-white font-bold text-xl p-3 border-b border-white/10 text-center block">اتصل بنا</Link>
                
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-gray-400">السلة</span>
                  <Link href="/cart" onClick={handleCloseMenu} className="bg-amber-500 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                    <ShoppingCart size={20} />
                    <span>{totalItems}</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default function HomePage() {
  const [projects, setProjects] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("جاري جلب البيانات...");
        const { data: products, error } = await supabase
          .from("products")
          .select("*")
          .limit(6)
          .order("created_at", { ascending: false });
          
        if (error) {
          console.error("Supabase Error:", error);
          throw error;
        }
        if (products) {
          setProjects(products as Product[]);
        }
      } catch (error: any) {
        console.error("Error fetching products:", error);
        setError(error.message || "حدث خطأ غير معروف أثناء تحميل المنتجات.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&display=swap');
        body { font-family: 'Tajawal', sans-serif; background-color: #0f172a; color: #f8fafc; overflow-x: hidden; }
        .hero-bg { background: radial-gradient(circle at 50% 50%, #1e1b4b 0%, #0f172a 100%); position: relative; }
        .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; transform: translateY(20px); }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
        .glass-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); transition: all 0.4s ease; }
        .glass-card:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(251, 191, 36, 0.3); transform: translateY(-10px); box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.5); }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float 8s ease-in-out infinite; animation-delay: 2s; }
      `}</style>

      <Header />

      <section className="hero-bg min-h-screen flex items-center justify-center text-center relative overflow-hidden pt-20 px-4">
        <div className="absolute top-20 right-20 w-72 h-72 bg-amber-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="hidden md:flex justify-end h-full min-h-100 relative animate-float">
              <img src="/logo.png" alt="نجف كريستالي" className="max-h-137.5 object-contain drop-shadow-[0_0_30px_rgba(251,191,36,0.3)] filter opacity-80 hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="flex flex-col items-center text-center space-y-6 z-20">
              <span className="inline-block py-1 px-4 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold mb-4 fade-in-up">
                النجف الفاخر والتحف الأصيلة
              </span>
              
              <h1 className="text-5xl md:text-7xl font-black leading-tight text-white fade-in-up delay-100">
                جمال أصيل <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700">في كل زاوية</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl fade-in-up delay-200">
                نقدم لكم تشكيلة مختارة من أرقى أنواع النجف، الثريات، والتحف التي تضفي فخامة وأناقة على منازلكم.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-up delay-300 pt-4">
                <Link href="/products" className="group relative px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold rounded-full text-lg transition hover:scale-105 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                  تسوق الآن
                  <ChevronLeft className="inline mr-2 group-hover:-translate-x-1 transition" />
                </Link>
                <Link href="/products" className="px-8 py-3 border-2 border-white/10 text-white rounded-full text-lg font-bold hover:bg-white/5 transition backdrop-blur-sm">
                  تصفح الكتالوج
                </Link>
              </div>
            </div>

            <div className="hidden md:flex justify-start h-full min-h-100 relative animate-float-slow">
              <img src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=1000&auto=format&fit=crop" alt="تحفة فنية" className="max-h-137.5 object-contain drop-shadow-[0_0_30px_rgba(251,191,36,0.3)] filter opacity-80 hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto fade-in-up delay-300 relative z-20">
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="text-4xl font-black text-amber-400 mb-2">+500</div>
              <div className="text-sm text-gray-400">منتج حصري</div>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="text-4xl font-black text-amber-400 mb-2">24/7</div>
              <div className="text-sm text-gray-400">خدمة عملاء</div>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="text-4xl font-black text-amber-400 mb-2">EG</div>
              <div className="text-sm text-gray-400">صناعة محلية</div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم المنتجات الحديثة */}
      <section className="py-24 relative overflow-hidden bg-[#0b1120]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <span className="text-amber-400 font-bold tracking-wider text-sm uppercase fade-in-up">وصل حديثاً</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mt-2 fade-in-up delay-100">تشكيلة مميزة</h2>
            </div>
            <Link href="/products" className="text-white hover:text-amber-400 font-bold flex items-center gap-2 transition">
              عرض كل المنتجات <ChevronLeft size={20} />
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-gray-400">جاري تحميل الفخامة...</p>
            </div>
          ) : error ? (
            <div className="text-center py-32 bg-red-900/20 border border-red-500/50 rounded-2xl">
              <p className="text-red-400 font-bold text-lg mb-2">حدث خطأ أثناء تحميل المنتجات</p>
              <p className="text-gray-400 text-sm mb-4 bg-black/30 inline-block px-4 py-1 rounded">{error}</p>
              <p className="text-xs text-gray-500 mt-2">يرجى التحقق من الاتصال بالإنترنت وإعدادات Supabase.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {projects.map((product, index) => (
                <div key={product.id} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="group">
                    <Link href={`/products/${product.id}`}>
                      <div className="glass-card rounded-3xl overflow-hidden h-full flex flex-col">
                        <div className="relative overflow-hidden aspect-4/5">
                          <img 
                            src={product.image || product.images?.[0] || "/placeholder.png"} 
                            alt={product.title || product.name} 
                            className="w-full h-full object-cover transition duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                            <button className="bg-white text-black px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition duration-300">عرض التفاصيل</button>
                          </div>
                          {/* عرض شارة "خصم" إذا كان هناك سعر قديم */}
                          {product.discount_price && product.discount_price > product.price && (
                            <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                              خصم
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-white mb-2 truncate">{product.title || product.name}</h3>
                          
                          {/* منطق عرض السعر الجديد والقديم */}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">

  {/* السعر القديم (قبل الخصم) */}
  {product.discount_price && product.discount_price < product.price && (
    <span className="text-gray-400 line-through text-sm decoration-red-500 decoration-2">
      {product.price} ج.م
    </span>
  )}

  {/* السعر الجديد (بعد الخصم) */}
  <span className="text-amber-400 font-bold text-lg">
    {product.discount_price ?? product.price} ج.م
  </span>

</div>

                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#0f172a] border-y border-white/5">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500"><Truck size={32} /></div>
            <div>
              <h4 className="text-white font-bold text-lg">شحن سريع</h4>
              <p className="text-gray-400 text-sm">توصيل لجميع المحافظات</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500"><ShieldCheck size={32} /></div>
            <div>
              <h4 className="text-white font-bold text-lg">ضمان الجودة</h4>
              <p className="text-gray-400 text-sm">منتجات أصلية 100%</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500"><Phone size={32} /></div>
            <div>
              <h4 className="text-white font-bold text-lg">دعم فني</h4>
              <p className="text-gray-400 text-sm">خدمة عملاء متميزة</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#020617] pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px]"></div>
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <span className="text-2xl font-black text-amber-400 mb-6 block">بيت الجوري</span>
              <p className="text-gray-400 text-sm leading-relaxed">
                وجهتكم الأولى للذوق الرفيع والأناقة المصرية الأصيلة في مجال النجف والتحف المنزلية.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">روابط سريعة</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/" className="hover:text-amber-400 transition">الرئيسية</Link></li>
                <li><Link href="/products" className="hover:text-amber-400 transition">المنتجات</Link></li>
                <li><Link href="/about" className="hover:text-amber-400 transition">قصتنا</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">تواصل معنا</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2"><Phone size={16} className="text-amber-500" /> +20 01015183003</li>
                 <li className="flex items-center gap-2"><Phone size={16} className="text-amber-500" /> +20 01220139070</li>
                <li className="flex items-center gap-2"><Mail size={16} className="text-amber-500" /> info@baitaljouri.com</li>
                <li className="flex items-center gap-2">📍 بشالوش - ميت غمر - دقعلية </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">النشرة البريدية</h4>
              <div className="flex gap-2">
                <input type="email" placeholder="بريدك الإلكتروني" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white w-full focus:outline-none focus:border-amber-500" />
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition">اشترك</button>
              </div>
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