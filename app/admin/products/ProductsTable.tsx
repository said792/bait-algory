"use client";

import { useState } from "react";
import { Pencil, Trash2, Package, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// ✅ التصحيح: استيراد supabase جاهز بدلاً من createClient
import { supabase } from "@/lib/supabase/client";

export function ProductsTable({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) return;

    // استخدام supabase مباشرة
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert("فشل الحذف: " + error.message);
    } else {
      // تحديث القائمة المحلية لإزالة المنتج فوراً
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* رأس الجدول */}
      <table className="w-full text-right">
        <thead className="bg-stone-50/80 border-b border-stone-200">
          <tr>
            <th className="p-4 font-bold text-xs uppercase text-stone-500 tracking-wider">المنتج</th>
            <th className="p-4 font-bold text-xs uppercase text-stone-500 tracking-wider">الفئة</th>
            <th className="p-4 font-bold text-xs uppercase text-stone-500 tracking-wider">السعر</th>
            <th className="p-4 font-bold text-xs uppercase text-stone-500 tracking-wider">المخزون</th>
            <th className="p-4 font-bold text-xs uppercase text-stone-500 tracking-wider">الحالة</th>
            <th className="p-4 font-bold text-xs uppercase text-stone-500 tracking-wider text-center">الإجراءات</th>
          </tr>
        </thead>
        
        <tbody className="divide-y divide-stone-100">
          {products.length > 0 ? (
            products.map((product: any) => (
              <tr key={product.id} className="hover:bg-stone-50 transition-colors group">
                {/* عمود المنتج (اسم + صورة مصغرة) */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden relative shrink-0">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <Package size={20} />
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-stone-800 line-clamp-1">
                      {product.name || product.title}
                    </span>
                  </div>
                </td>

                {/* عمود الفئة */}
                <td className="p-4">
                  <div className="text-sm text-stone-600">
                    <span className="font-medium text-stone-900">{product.categories?.name}</span>
                    {product.subcategories?.name && (
                      <span className="text-stone-400 mr-1">/ {product.subcategories.name}</span>
                    )}
                  </div>
                </td>

                {/* عمود السعر */}
                <td className="p-4">
                  <span className="font-bold text-amber-700">{product.price} ج.م</span>
                </td>

                {/* عمود الكمية */}
                <td className="p-4 text-sm text-stone-600 font-medium">
                  {product.quantity}
                </td>

                {/* عمود الحالة */}
                <td className="p-4">
                  {product.in_stock || product.quantity > 0 ? (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      متوفر
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full text-xs font-bold border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      نفذت الكمية
                    </span>
                  )}
                </td>

                {/* أزرار التحكم */}
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* زر التعديل */}
                    <Link 
                      href={`/admin/products/${product.id}/edit`} 
                      className="p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                      title="تعديل"
                    >
                      <Pencil size={18} />
                    </Link>
                    
                    {/* زر الحذف */}
                    <button 
                      onClick={() => handleDelete(product.id)} 
                      className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                      title="حذف"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
             <tr>
              <td colSpan={6} className="p-12 text-center text-stone-400">
                لا توجد منتجات للعرض
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}