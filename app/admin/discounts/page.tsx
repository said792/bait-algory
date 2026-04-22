// app/admin/discounts/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Percent, Save, Search, Package, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price?: number | null;
  image?: string;
  category?: string;
  categories?: { name: string }; // قد تأتي مع البيانات
}

export default function DiscountsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // الحالة المختارة للمنتجات (Set لمنع التكرار)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // نسبة الخصم المراد تطبيقها في هذا الجلسة
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  // جلب المنتجات عند تحميل الصفحة
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const result = await res.json();
        
        // التحقق من شكل البيانات القادمة
        let productsList = [];
        if (Array.isArray(result)) {
          productsList = result;
        } else if (result && result.data && Array.isArray(result.data)) {
          productsList = result.data;
        }

        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // معالجة اختيار المنتج (إضافة/إزالة ID)
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // اختيار الكل
  const toggleSelectAll = () => {
    const filteredIds = filteredProducts.map(p => p.id);
    if (filteredIds.length > 0 && selectedIds.size === filteredIds.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredIds));
    }
  };

  // فلترة المنتجات للبحث
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // دالة لحساب سعر العرض المقترح
  const getPreviewPrice = (originalPrice: number) => {
    if (discountPercentage <= 0) return null;
    const discountAmount = (originalPrice * discountPercentage) / 100;
    return Math.round(originalPrice - discountAmount);
  };

  // دالة تطبيق وحفظ الخصومات
  const handleApplyDiscounts = async () => {
    if (selectedIds.size === 0) {
      alert("يرجى اختيار منتج واحد على الأقل");
      return;
    }
    if (discountPercentage <= 0) {
      alert("يرجى إدخال نسبة خصم صحيحة");
      return;
    }

    if (!confirm(`هل أنت متأكد من تطبيق خصم ${discountPercentage}% على ${selectedIds.size} منتج؟`)) return;

    setSaving(true);
    
    // نقوم بإرسال طلب تحديث لكل منتج
    const updatePromises = Array.from(selectedIds).map(async (id) => {
      const product = products.find(p => p.id === id);
      if (!product) return;

      const newPrice = getPreviewPrice(product.price)!;

      const formData = new FormData();
      formData.append("price", product.price.toString());
      formData.append("discount_price", newPrice.toString()); // هذا هو المهم

      // نرسل البيانات لـ API التعديل
      return fetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });
    });

    try {
      await Promise.all(updatePromises);
      alert("تم تطبيق الخصومات بنجاح!");
      
      // إعادة تحميل المنتجات لتحديث الأسعار في الواجهة
      const res = await fetch("/api/products");
      const result = await res.json();
      let productsList = Array.isArray(result) ? result : (result.data || []);
      setProducts(productsList);
      
      setSelectedIds(new Set()); // إفراغ الاختيار
      setDiscountPercentage(0); // تصفير النسبة
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء التحديث، يرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fdfbf7] font-sans text-stone-800">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8 border-b border-stone-200 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="p-2 hover:bg-stone-100 rounded-full transition">
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-serif font-bold text-stone-900">إدارة العروض والخصومات</h1>
              <p className="text-stone-500 text-sm mt-1">طبق خصومات جماعية على المنتجات بسهولة</p>
            </div>
          </div>
        </header>

        {/* شريط التحكم العلو (Sticky) */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-8 sticky top-4 z-10">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            
            {/* إدخال نسبة الخصم */}
            <div className="flex items-center gap-4 w-full md:w-auto flex-1">
              <div className="relative w-full md:w-48">
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="نسبة %"
                  value={discountPercentage === 0 ? "" : discountPercentage}
                  onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-lg font-bold text-amber-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">
                  <Percent size={18} />
                </div>
              </div>
              <div className="text-sm text-stone-500 font-medium hidden md:block">
                قم بتحديد النسبة المئوية للعرض
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              <div className="text-sm font-bold text-stone-700 whitespace-nowrap bg-stone-100 px-3 py-2 rounded-lg">
                <span className="text-amber-600 text-lg">{selectedIds.size}</span> منتج محدد
              </div>
              
              <button
                onClick={toggleSelectAll}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors"
              >
                {filteredProducts.length > 0 && selectedIds.size === filteredProducts.length ? "إلغاء الكل" : "اختيار الكل"}
              </button>

              <button
                onClick={handleApplyDiscounts}
                disabled={selectedIds.size === 0 || saving || discountPercentage <= 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>حفظ التغييرات</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* البحث */}
        <div className="mb-6 relative max-w-md">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search size={20} className="text-stone-400" />
          </div>
          <input
            type="text"
            placeholder="ابحث عن منتج بالاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl pr-10 pl-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>

        {/* جدول المنتجات */}
        {loading ? (
          <div className="text-center py-20 text-stone-400 flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
            جاري تحميل المنتجات...
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300">
                <Package size={48} className="mx-auto text-stone-300 mb-4" />
                <p className="text-stone-500 font-bold">لا توجد منتجات</p>
              </div>
            ) : (
              filteredProducts.map((product) => {
                const isSelected = selectedIds.has(product.id);
                
                // 1. السعر المخزون في قاعدة البيانات
                const savedDiscountPrice = product.discount_price ? Number(product.discount_price) : null;
                
                // 2. سعر المعاينة الحالي بناءً على الإدخال
                const previewPrice = getPreviewPrice(product.price);

                // 3. منطق عرض السعر
                // إذا يوجد سعر مخزون من قبل، نعرضه.
                // إذا المنتج محدد الآن في القائمة ونكتبنا نسبة، نعرض سعر المعاينة.
                const hasExistingDiscount = savedDiscountPrice !== null;
                const finalPriceToShow = hasExistingDiscount ? savedDiscountPrice : (isSelected ? previewPrice : null);
                
                return (
                  <div 
                    key={product.id}
                    onClick={() => toggleSelect(product.id)}
                    className={`
                      relative group p-4 rounded-2xl border transition-all duration-200 cursor-pointer bg-white flex items-center gap-6
                      ${isSelected ? 'border-amber-500 ring-1 ring-amber-200 bg-amber-50/30 shadow-md' : 'border-stone-200 hover:border-amber-300 hover:shadow-sm'}
                    `}
                  >
                    {/* Checkbox */}
                    <div className={`
                      w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0
                      ${isSelected ? 'bg-amber-500 border-amber-500 text-white' : 'border-stone-300 text-transparent group-hover:border-amber-400'}
                    `}>
                      <CheckCircle2 size={16} />
                    </div>

                    {/* صورة المنتج */}
                    <div className="w-24 h-24 bg-stone-100 rounded-xl overflow-hidden shrink-0 border border-stone-200 relative">
                      <img src={product.image || "/placeholder.png"} alt={product.name} className="w-full h-full object-cover" />
                      {/* شارة إذا كان عليه خصم أصلاً */}
                      {hasExistingDiscount && (
                        <div className="absolute top-1 right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                          خصم نشط
                        </div>
                      )}
                    </div>

                    {/* تفاصيل المنتج */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-stone-900 truncate mb-1">{product.name}</h3>
                      <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                        {product.category || product.categories?.name || "عام"}
                      </span>
                    </div>

                    {/* عرض الأسعار (الجزء الهام) */}
                    <div className="flex items-center gap-10 shrink-0">
                      
                      {/* السعر الأصلي */}
                      <div className="text-right">
                        <span className="text-xs text-stone-400 block mb-1">السعر الأساسي</span>
                        <span className={`font-bold text-sm transition-all ${finalPriceToShow ? 'text-red-400 line-through' : 'text-stone-900'}`}>
                          {product.price.toLocaleString()} ج.م
                        </span>
                      </div>

                      {/* سعر العرض */}
                      <div className="text-right min-w-30">
                        <span className="text-xs text-amber-600 block mb-1 font-bold">
                          {hasExistingDiscount ? "سعر الخصم الحالي" : "سعر العرض المقترح"}
                        </span>
                        <span className="text-xl font-black">
                          {finalPriceToShow ? (
                            <span className={hasExistingDiscount ? "text-green-700" : "text-amber-700"}>
                              {finalPriceToShow.toLocaleString()} ج.م
                            </span>
                          ) : (
                            <span className="text-stone-300">-</span>
                          )}
                        </span>
                      </div>
                      
                      {/* أيقونة حالة الحفظ */}
                      {finalPriceToShow && hasExistingDiscount && (
                         <div className="text-green-600 bg-green-50 p-2 rounded-full" title="تم الحفظ في قاعدة البيانات">
                           <CheckCircle2 size={20} />
                         </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </main>
  );
}