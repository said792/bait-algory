"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { ArrowLeft, Save, Package, RefreshCw, Search } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  
  // ✅ إضافة State لحفظ القيم التي يتم كتابتها في الحقول
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*") 
      .order("created_at", { ascending: false });

    console.log("📦 البيانات:", data);

    if (error) {
      console.error("❌ خطأ:", error);
      alert("حدث خطأ أثناء جلب المنتجات");
    } else if (data) {
      setProducts(data);
      setFilteredProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = products.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(lowerTerm)) ||
        (p.title && p.title.toLowerCase().includes(lowerTerm)) ||
        (p.category && p.category.toLowerCase().includes(lowerTerm))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const getQuantity = (product: any) => {
    return product.quantity || product.stock || product.in_stock || 0;
  };

  // دالة تحديث القيمة في الـ State عند الكتابة
  const handleInputChange = (id: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleUpdateStock = async (id: string, currentQuantity: number) => {
    // ✅ الحصول على القيمة من الـ State، إذا لم تكن موجودة نستخدم الكمية الحالية
    const inputValue = inputValues[id] || String(currentQuantity);
    const newQuantity = parseInt(inputValue);

    if (isNaN(newQuantity) || newQuantity < 0) {
      alert("يرجى إدخال رقم صحيح للمخزون");
      return;
    }

    if (newQuantity === currentQuantity && inputValues[id]) {
      alert("لم تقم بتغيير الرصيد");
      return;
    }

    if (!confirm(`هل تريد تغيير المخزون إلى ${newQuantity}؟`)) return;

    setUpdating(id);

    const { error } = await supabase
      .from("products")
      .update({ quantity: newQuantity })
      .eq("id", id);

    if (error) {
      alert("فشل التحديث: " + error.message);
      console.error("Update Error:", error);
    } else {
      // تحديث البيانات المحلية
      setProducts(products.map((p) => (p.id === id ? { ...p, quantity: newQuantity } : p)));
      // إزالة القيمة من الـ Temp State بعد الحفظ
      setInputValues(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      alert("تم تحديث المخزون بنجاح ✅");
    }

    setUpdating(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition">
              <ArrowLeft className="text-gray-400" size={24} />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                إدارة <span className="text-amber-500">المخزون</span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">تحديث أرصدة المنتجات بسرعة</p>
            </div>
          </div>
          
          <button 
            onClick={fetchProducts}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-xl transition border border-amber-500/20"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            تحديث القائمة
          </button>
        </div>

        {/* شريط البحث */}
        <div className="relative mb-8">
          <Search className="absolute right-4 top-4 text-gray-500" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن منتج بالاسم أو الفئة..."
            className="w-full bg-[#1e293b]/50 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-4 pr-12 text-white placeholder-gray-600 outline-none focus:border-amber-500/50 transition"
          />
        </div>

        {loading && products.length === 0 ? (
          <div className="text-center py-20 text-amber-500 text-xl animate-pulse">جاري تحميل المخزون...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#1e293b]/30 rounded-3xl border border-dashed border-white/10">
            <Package className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white">لا توجد منتجات</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm ? "لم يتم العثور على نتائج." : "جدول المنتجات فارغ حالياً."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const currentQty = getQuantity(product);
              // ✅ الحصول على التصنيف بدقة أكثر
              const categoryDisplay = product.category || product.category_id || "غير مصنف";
              const inputValue = inputValues[product.id] || String(currentQty);
              
              return (
                <div key={product.id} className="bg-[#1e293b]/50 backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition">
                  
                  {/* معلومات المنتج */}
                  <div className="flex items-center gap-4 w-full md:w-auto flex-1">
                    <div className="w-16 h-16 bg-[#0b1120] rounded-xl border border-white/10 overflow-hidden flex-shrink-0">
                      {product.image || product.images?.[0] ? (
                        <img src={product.image || product.images[0]} alt={product.name || product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Package size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white truncate max-w-[200px] md:max-w-xs">
                        {product.name || product.title || "بدون اسم"}
                      </h3>
                      {/* ✅ تصحيح عرض التصنيف */}
                      <p className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full w-fit mt-1">
                        {typeof categoryDisplay === 'number' ? `تصنيف #${categoryDisplay}` : categoryDisplay}
                      </p>
                    </div>
                  </div>

                  {/* المخزون الحالي */}
                  <div className="text-center px-4">
                    <p className="text-xs text-gray-500 mb-1">المخزون الحالي</p>
                    <span className={`text-xl font-black ${currentQty > 5 ? "text-green-400" : "text-red-400"}`}>
                      {currentQty}
                    </span>
                  </div>

                  {/* فورم التحديث (Controlled Input) */}
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                      <input
                        type="number"
                        min="0"
                        // ✅ استخدام value و onChange للتحكم الكامل في القيمة
                        value={inputValue}
                        onChange={(e) => handleInputChange(product.id, e.target.value)}
                        className="bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white w-full md:w-32 outline-none focus:border-amber-500/50 transition text-center font-bold"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateStock(product.id, currentQty);
                          }
                        }}
                      />
                    </div>
                    
                    <button
                      onClick={() => handleUpdateStock(product.id, currentQty)}
                      disabled={updating === product.id}
                      className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2 disabled:opacity-70"
                    >
                      {updating === product.id ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      حفظ
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}