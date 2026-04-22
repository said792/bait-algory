// app/admin/products/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowRight, 
  UploadCloud, 
  Image as ImageIcon, 
  Hash, 
  Tag, 
  Layers,
  Loader2
} from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "", // ✅ حقل جديد للخصم
    quantity: "1",
    category_id: "",
    subcategory_id: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // جلب المنتج والفئات عند التحميل
  useEffect(() => {
    const loadData = async () => {
      // 1. جلب الفئات
      const resCat = await fetch("/api/categories");
      const cats = await resCat.json();
      setCategories(cats);

      // 2. جلب بيانات المنتج
      const resProd = await fetch(`/api/products/details?id=${id}`);
      const productData = await resProd.json();

      if (productData) {
        setFormData({
          name: productData.name || "",
          description: productData.description || "",
          price: productData.price || "",
          discount_price: productData.discount_price || "", // ✅ تحميل سعر الخصم
          quantity: productData.quantity?.toString() || "1",
          category_id: productData.category_id || "",
          subcategory_id: productData.subcategory_id || "",
        });
        setPreview(productData.image || null);
        setFetchingProduct(false);
      }
    };

    loadData();
  }, [id]);

  // فلترة الفئات الفرعية
  useEffect(() => {
    const selectedCategory = categories.find((cat) => cat.id === formData.category_id);
    setSubcategories(selectedCategory?.subcategories || []);
  }, [formData.category_id, categories]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = new FormData();
    dataToSend.append("file", file || "");
    dataToSend.append("name", formData.name);
    dataToSend.append("description", formData.description);
    dataToSend.append("price", formData.price);
    dataToSend.append("discount_price", formData.discount_price); // ✅ إرسال سعر الخصم
    dataToSend.append("quantity", formData.quantity);
    dataToSend.append("category_id", formData.category_id);
    dataToSend.append("subcategory_id", formData.subcategory_id);

    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: dataToSend,
    });

    if (res.ok) {
      alert("تم تعديل المنتج بنجاح!");
      router.push("/admin/products");
    } else {
      alert("حدث خطأ أثناء التعديل، يرجى المحاولة مرة أخرى.");
    }
    setLoading(false);
  };

  // واجهة التحميل
  if (fetchingProduct) {
    return (
      <main className="min-h-screen bg-[#fdfbf7] font-sans text-stone-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-amber-500 mx-auto mb-4" size={48} />
          <p className="text-stone-600 font-medium">جاري تحميل بيانات المنتج...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdfbf7] font-sans text-stone-800 pb-12">
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-8">
        
        {/* Header */}
        <header className="flex items-center gap-4 mb-8 border-b border-stone-200 pb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-stone-100"
          >
            <ArrowRight size={18} />
            <span>عودة</span>
          </button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">تعديل المنتج</h1>
            <p className="text-stone-500 text-sm mt-1">تحديث بيانات وتفاصيل القطعة</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* قسم الصورة */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm relative group">
            <label className="block text-lg font-bold font-serif text-stone-800 mb-4 items-center gap-2">
              <ImageIcon size={20} className="text-amber-600" />
              صورة المنتج الحالية
            </label>
            
            <div className="relative">
              <input 
                type="file" 
                id="file-upload"
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                accept="image/*" 
              />
              <div className={`border-2 rounded-xl p-10 text-center transition-all duration-200 flex flex-col items-center justify-center
                ${preview ? 'border-stone-200 bg-white' : 'border-dashed border-stone-300 group-hover:border-amber-400 group-hover:bg-amber-50/30'}
              `}>
                {preview ? (
                  <div className="relative w-full max-w-md aspect-video">
                    <img 
                      src={preview} 
                      alt="Current Product" 
                      className="w-full h-full object-contain rounded-lg shadow-sm" 
                    />
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-all rounded-lg flex items-center justify-center">
                      <p className="text-white opacity-0 group-hover:opacity-100 bg-black/50 px-4 py-2 rounded-full text-sm font-medium">
                        <UploadCloud size={16} className="inline-block ml-2" />
                        تغيير الصورة
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-stone-400">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                      <UploadCloud size={32} className="text-stone-500" />
                    </div>
                    <p className="font-bold text-stone-600">اضغط لرفع صورة</p>
                    <p className="text-xs mt-1">لا توجد صورة حالياً</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* تفاصيل المنتج */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* المعلومات الأساسية */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <h3 className="font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">المعلومات الأساسية</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1.5">اسم المنتج</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1.5">الوصف التفصيلي</label>
                    <textarea
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* الأسعار والفئات */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <h3 className="font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">التسعير والمخزون</h3>
                <div className="space-y-4">
                  
                  {/* السعر الأصلي */}
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">السعر الأصلي (ج.م)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Hash size={16} className="text-stone-400" />
                      </div>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-10 pl-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-bold text-lg"
                      />
                    </div>
                  </div>

                  {/* ✅ سعر الخصم (الجديد) */}
                  <div>
                    <label className="block text-xs font-bold text-amber-600 uppercase mb-1.5">سعر العرض/الخصم (اختياري)</label>
                    <p className="text-[10px] text-stone-400 mb-1">إذا تم ملء هذا الحقل، سيظهر السعر الجديد وسيتم شطب القديم</p>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Tag size={16} className="text-amber-400" />
                      </div>
                      <input
                        type="number"
                        placeholder="اتركه فارغاً إذا لا يوجد خصم"
                        value={formData.discount_price}
                        onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                        className="w-full bg-amber-50 border border-amber-200 rounded-xl pr-10 pl-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-bold text-lg text-amber-800"
                      />
                    </div>
                  </div>

                  {/* الكمية */}
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">الكمية المتاحة</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Layers size={16} className="text-stone-400" />
                      </div>
                      <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-10 pl-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <h3 className="font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">التصنيف</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">الفئة الرئيسية</label>
                    <select 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      required
                    >
                      <option value="">اختر الفئة...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">الفئة الفرعية</label>
                    <select 
                      className={`w-full rounded-xl px-4 py-3 outline-none transition-colors appearance-none cursor-pointer
                        ${formData.category_id 
                          ? 'bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-amber-500' 
                          : 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                        }
                      `}
                      value={formData.subcategory_id}
                      onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
                      disabled={!formData.category_id}
                    >
                      <option value="">
                        {formData.category_id ? 'اختر الفرعية...' : 'أولاً اختر رئيسية'}
                      </option>
                      {subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* زر الحفظ */}
          <div className="flex items-center justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold shadow-lg shadow-stone-900/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Tag size={20} />
                  <span>حفظ التعديلات</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}