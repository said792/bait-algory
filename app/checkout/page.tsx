"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { ChevronLeft, MapPin, Phone, Mail, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  // حالة بيانات الشحن
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // لو السلة فاضية
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#0f172a] pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 text-amber-500 mb-6">
            <ShoppingBag size={40} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">سلة المشتريات فارغة</h1>
          <Link 
            href="/products" 
            className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition"
          >
            تصفح المنتجات
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      customer_name: shippingInfo.name,
      customer_phone: shippingInfo.phone,
      customer_address: shippingInfo.address,
      total: getTotalPrice(),
      items: items,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        clearCart();
        router.push("/checkout/success");
      } else {
        alert("حدث خطأ أثناء معالجة الطلب، يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ في الاتصال.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0f172a] pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* عنوان الصفحة ورابط العودة */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/cart" className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition group">
            <ChevronLeft className="text-gray-400 group-hover:text-white" size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white">إتمام الطلب</h1>
            <p className="text-gray-400 text-sm">يرجى إكمال بيانات التوصيل بدقة</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* ---------------- نموذج البيانات (الجزء الأكبر) ---------------- */}
          <div className="lg:col-span-2">
            <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
              
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">بيانات الشحن والتواصل</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  
                  {/* حقل الاسم */}
                  <div className="w-full">
                    <label className="block text-gray-400 text-sm mb-2 ml-1">الاسم بالكامل</label>
                    <div className="relative group">
                      <MapPin className="absolute right-4 top-3.5 text-gray-500 group-focus-within:text-amber-500 transition" size={18} />
                      <input
                        type="text"
                        required
                        value={shippingInfo.name}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                        className="w-full bg-[#0b1120] border border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-white placeholder-gray-600 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all duration-300"
                        placeholder="مثال: محمد أحمد علي"
                      />
                    </div>
                  </div>

                  {/* حقل الهاتف */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 ml-1">رقم الهاتف</label>
                    <div className="relative group">
                      <Phone className="absolute right-4 top-3.5 text-gray-500 group-focus-within:text-amber-500 transition" size={18} />
                      <input
                        type="tel"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="w-full bg-[#0b1120] border border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-white placeholder-gray-600 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all duration-300"
                        placeholder="01xxxxxxxxx"
                      />
                    </div>
                  </div>

                  {/* حقل العنوان */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 ml-1">العنوان بالتفصيل</label>
                    <div className="relative group">
                      <Mail className="absolute right-4 top-3.5 text-gray-500 group-focus-within:text-amber-500 transition" size={18} />
                      <textarea
                        required
                        rows={3}
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className="w-full bg-[#0b1120] border border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-white placeholder-gray-600 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all duration-300 resize-none"
                        placeholder="اسم الشارع، رقم المبنى، المنطقة، المدينة..."
                      />
                    </div>
                  </div>

                </div>

                {/* زر الإرسال */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full relative overflow-hidden bg-linear-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white py-4 rounded-2xl font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(245,158,11,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
                      جاري معالجة الطلب...
                    </span>
                  ) : (
                    <>
                      <span>تأكيد الطلب</span>
                      <span className="text-amber-200/80 font-normal text-base">({getTotalPrice()} ج.م)</span>
                      <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"></div>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ---------------- ملخص الطلب (الجزء الجانبي) ---------------- */}
          <div className="lg:col-span-1">
            <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 sticky top-28 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-2">
                <ShoppingBag size={20} className="text-amber-500" />
                ملخص الطلب
              </h2>
              
              {/* قائمة المنتجات */}
              <div className="space-y-4 max-h-100 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 justify-between items-center p-3 bg-[#0b1120] rounded-xl border border-white/5">
                    <div className="flex gap-3">
                      <div className="w-14 h-14 bg-[#1e293b] rounded-lg border border-white/10 overflow-hidden relative shrink-0">
                          {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex flex-col justify-center">
                          <p className="font-semibold text-white text-sm line-clamp-1">{item.name}</p>
                          <p className="text-gray-500 text-xs">الكمية: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="font-bold text-amber-400 text-sm whitespace-nowrap">
                      {item.price * item.quantity} ج.م
                    </div>
                  </div>
                ))}
              </div>

              {/* التفاصيل المالية */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>عدد المنتجات</span>
                  <span className="text-white font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-300 font-medium">المجموع الكلي</span>
                  <span className="text-2xl font-black text-amber-400">{getTotalPrice()} ج.م</span>
                </div>
              </div>

              {/* طريقة الدفع */}
              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                  💵
                </div>
                <div className="text-sm">
                  <p className="text-amber-200 font-bold">الدفع عند الاستلام</p>
                  <p className="text-amber-400/70 text-xs">لن يتم خصم أي مبالغ الآن</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* سكرول بار مخصص */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        @keyframes shine {
          100% { transform: translateX(100%) skewX(12deg); }
        }
        .animate-shine {
          animation: shine 1s;
        }
      `}</style>
    </main>
  );
}