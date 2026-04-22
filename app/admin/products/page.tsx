// app/admin/products/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { 
  Plus, 
  ArrowRight, 
  Package, 
  Layers,
  LayoutGrid
} from "lucide-react";
import { ProductsTable } from "./ProductsTable";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  // جلب المنتجات (Server Side)
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      categories (name),
      subcategories (name)
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#fdfbf7] font-sans text-stone-800 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-stone-200 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-wide">
              إدارة المنتجات
            </h1>
            <p className="text-stone-500 mt-1">التحكم في مخزون النجف والتحف والأدوات المنزلية</p>
          </div>
          
          <div className="flex gap-3">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-4 py-2.5 text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 hover:text-amber-700 transition-all font-medium"
            >
              <ArrowRight size={18} />
              <span>عودة للوحة التحكم</span>
            </Link>
            <Link 
              href="/admin/products/new" 
              className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-xl hover:bg-stone-800 shadow-lg shadow-stone-900/20 transition-all font-medium hover:-translate-y-0.5"
            >
              <Plus size={18} />
              <span>إضافة منتج جديد</span>
            </Link>
          </div>
        </header>

        {/* Stats Summary (توضيح سريع للمخزون) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Layers size={24} />
            </div>
            <div>
              <p className="text-stone-500 text-sm font-medium">إجمالي المنتجات</p>
              <p className="text-2xl font-bold text-stone-900">{products?.length || 0}</p>
            </div>
          </div>
          
          {/* يمكنك إضافة كروت أخرى هنا مثل "نفد من المخزون" إذا توفرت الداتا */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-stone-100 text-stone-500 rounded-lg">
              <LayoutGrid size={24} />
            </div>
            <div>
              <p className="text-stone-500 text-sm font-medium">الفئات الرئيسية</p>
              <p className="text-2xl font-bold text-stone-900">
                {new Set(products?.map(p => p.categories?.name)).size || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {products && products.length > 0 ? (
          <ProductsTable initialProducts={products} />
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-16 text-center flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-6">
              <Package size={48} className="text-stone-300" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-800 mb-2">المتجر فارغ حالياً</h3>
            <p className="text-stone-500 mb-8 max-w-md">
              لم تقم بإضافة أي منتجات للعرض بعد. ابدأ الآن برفع أول قطعة أثرية أو تحفة في المخزون.
            </p>
            <Link 
              href="/admin/products/new" 
              className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-200 transition-all transform hover:-translate-y-1 flex items-center gap-2"
            >
              <Plus size={20} />
              <span>أضف أول منتج</span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}