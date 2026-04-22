"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingCart, Menu, ChevronLeft, Phone, Mail, MapPin, Send, LockKeyhole, PackageSearch, CheckCircle, AlertCircle } from "lucide-react";
import { useCart } from "@/store/cart";

// --- مكون الهيدر (مكرر للتناسق) ---
function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { items } = useCart();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // ... (كود الهيدر كما هو بدون تغيير، استخدم الكود السابق هنا ليكون الإجابة أقصر، لكن سأضع الهيدر بالكامل هنا لضمان عمل الملف)
  
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
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-sm hidden md:block">
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

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-4 right-4 bg-[#1e293b]/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl z-50 flex flex-col p-6 gap-4 animate-in-up">
             <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold text-lg p-2 border-b border-gray-700">الرئيسية</Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold text-lg p-2 border-b border-gray-700">المنتجات</Link>
             <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold text-lg p-2 border-b border-gray-700">من نحن</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-amber-400 font-bold text-lg p-2 border-b border-gray-700">اتصل بنا</Link>
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

export default function ContactPage() {
  // State للتعامل مع حالة الإرسال (Loading, Success, Error)
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" }); // تفريغ الفورم
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      setFormStatus("error");
    }
  };

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
            تواصل <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-amber-600">معنا</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            نحن هنا لخدمتك والإجابة على استفساراتك. لا تتردد في التواصل معنا في أي وقت.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#0f172a]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* نموذج الاتصال (يسار) */}
            <div className="lg:col-span-2">
              <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
                <h2 className="text-3xl font-black text-white mb-8">أرسل رسالة</h2>
                
                {/* رسالة النجاح */}
                {formStatus === "success" && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 flex items-center gap-3">
                    <CheckCircle size={20} />
                    <div>
                      <p className="font-bold">تم إرسال الرسالة بنجاح!</p>
                      <p className="text-sm text-green-300">سنقوم بالرد عليك في أقرب وقت.</p>
                    </div>
                  </div>
                )}

                {/* رسالة الخطأ */}
                {formStatus === "error" && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3">
                    <AlertCircle size={20} />
                    <div>
                      <p className="font-bold">حدث خطأ</p>
                      <p className="text-sm text-red-300">يرجى المحاولة مرة أخرى لاحقاً.</p>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2 ml-1">الاسم</label>
                      <input 
                        name="name"
                        type="text" 
                        value={formData.name}
                        onChange={handleChange}
                        disabled={formStatus === "loading" || formStatus === "success"}
                        className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-amber-500/50 focus:outline-none transition" placeholder="الاسم الكامل" 
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2 ml-1">البريد الإلكتروني</label>
                      <input 
                        name="email"
                        type="email" 
                        value={formData.email}
                        onChange={handleChange}
                        disabled={formStatus === "loading" || formStatus === "success"}
                        className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-amber-500/50 focus:outline-none transition" placeholder="email@example.com" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2 ml-1">رقم الهاتف</label>
                    <input 
                      name="phone"
                      type="tel" 
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={formStatus === "loading" || formStatus === "success"}
                      className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-amber-500/50 focus:outline-none transition" placeholder="01xxxxxxxxx" 
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2 ml-1">الرسالة</label>
                    <textarea 
                      name="message"
                      rows={5} 
                      value={formData.message}
                      onChange={handleChange}
                      disabled={formStatus === "loading" || formStatus === "success"}
                      className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-amber-500/50 focus:outline-none transition resize-none" placeholder="اكتب رسالتك هنا..."></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={formStatus === "loading" || formStatus === "success"}
                    className="group w-full flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus === "loading" ? (
                      <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
                    ) : (
                      <>
                        <Send size={20} />
                        {formStatus === "success" ? "تم الإرسال" : "إرسال الرسالة"}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* معلومات الاتصال (يمين) */}
            <div className="space-y-6">
              <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/10 p-6 rounded-3xl hover:border-amber-500/30 transition">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">رقم الهاتف</h4>
                    <p className="text-gray-400">+20 01015183003</p>
                    <p className="text-gray-400">+20 01220139070</p>
                    <p className="text-gray-500 text-sm">متاح من 9 ص - 10 م</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/10 p-6 rounded-3xl hover:border-amber-500/30 transition">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">البريد الإلكتروني</h4>
                    <p className="text-gray-400">info@baitaljouri.com</p>
                    <p className="text-gray-500 text-sm">نرد خلال 24 ساعة</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/10 p-6 rounded-3xl hover:border-amber-500/30 transition">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">العنوان</h4>
                    <p className="text-gray-400">الدقهلية ,ميت غمر, بشالوش</p>
                    <p className="text-gray-500 text-sm">امام صيدلية المسلمانى طريق ميت غمر ديرب نجم</p>
                  </div>
                </div>
              </div>
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
                وجهتكم الأولى للذوق الرفيع والأناقة المصرية الأصيلة في مجال النجف والتحف المنزلية.
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
                <li>info@baitaljouri.com</li>
                <li>📍 القاهرة، بشالوش</li>
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