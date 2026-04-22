"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Phone, Package, Search, CheckCircle, Clock, Truck, XCircle } from "lucide-react";

export default function OrdersPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    setSearched(true);
    setOrders([]); // تصفير النتائج القديمة

    try {
      // البحث في قاعدة البيانات عن الطلبات المرتبطة بهذا الرقم
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_phone", phone)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // دالة لتحديد حالة الطلب ولونها
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { text: "قيد المراجعة", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock };
      case "processing":
        return { text: "جاري التجهيز", color: "text-blue-500", bg: "bg-blue-500/10", icon: Package };
      case "shipped":
        return { text: "تم الشحن", color: "text-purple-500", bg: "bg-purple-500/10", icon: Truck };
      case "completed":
        return { text: "تم التوصيل", color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle };
      default:
        return { text: status, color: "text-gray-500", bg: "bg-gray-500/10", icon: Package };
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* رأس الصفحة */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">
            تتبع <span className="text-amber-500">طلباتي</span>
          </h1>
          <p className="text-gray-400">أدخل رقم الهاتف المستخدم أثناء الطلب لعرض سجل مشترياتك</p>
        </div>

        {/* نموذج البحث */}
        <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 mb-10 shadow-2xl">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative grow">
              <Phone className="absolute right-4 top-4 text-gray-500" size={20} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
                className="w-full bg-[#0b1120] border border-white/10 rounded-2xl px-4 py-4 pr-12 text-white placeholder-gray-600 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all duration-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
              ) : (
                <>
                  <Search size={20} />
                  <span>تتبع الطلبات</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* عرض النتائج */}
        {!searched ? (
          <div className="text-center py-10 text-gray-500">
            الرجاء إدخال رقم الهاتف للبحث
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <div className="animate-pulse text-amber-500">جاري البحث في سجلاتنا...</div>
          </div>
        ) : orders.length === 0 ? (
          // حالة: لا توجد طلبات
          <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center border-dashed">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 text-red-500 mb-6">
              <XCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">لا توجد طلبات مرتبطة بهذا الرقم</h3>
            <p className="text-gray-400 mb-8">تأكد من إدخال الرقم الصحيح أو تواصل معنا عبر الواتساب</p>
            <a 
              href="https://wa.me/20100000000" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition"
            >
              تواصل مع الدعم
            </a>
          </div>
        ) : (
          // حالة: يوجد طلبات
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-400 mb-4">نتائج البحث ({orders.length})</h2>
            {orders.map((order) => {
              const status = getStatusInfo(order.status);
              const StatusIcon = status.icon;

              return (
                <div key={order.id} className="bg-[#1e293b]/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-lg hover:border-amber-500/30 transition-all duration-300">
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/10 pb-4 gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-gray-500 font-mono">#{order.id.toString().slice(-6)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${status.bg} ${status.color}`}>
                          <StatusIcon size={12} />
                          {status.text}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{order.created_at}</h3>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-400">إجمالي الفاتورة</p>
                      <p className="text-2xl font-black text-amber-400">{order.total} ج.م</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">اسم العميل</span>
                      <span className="text-white font-medium">{order.customer_name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">رقم الهاتف</span>
                      <span className="text-white font-medium">{order.customer_phone}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">العنوان</span>
                      <span className="text-white font-medium max-w-50 truncate text-right">{order.customer_address}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <button className="text-sm text-amber-500 hover:text-amber-400 font-medium transition">
                      عرض تفاصيل الطلب
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}