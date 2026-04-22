// app/admin/orders/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { OrderStatusUpdater } from "../OrderStatusUpdater";
import { ArrowRight, User, MapPin, Phone, Calendar, Receipt, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // استخدم Next/Image إن أمكن، أو img عادي

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // جلب الطلب والبنود بتاعته
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (name, image)
      )
    `)
    .eq("id", id)
    .single();

  if (error || !order) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fdfbf7] font-sans text-stone-800 pb-12">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link 
                href="/admin/orders" 
                className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition-colors font-medium text-sm bg-white px-4 py-2 rounded-full border border-stone-200 shadow-sm"
              >
                <ArrowRight size={18} />
                <span>عودة للطلبات</span>
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
              تفاصيل الطلب
            </h1>
            <p className="text-stone-500 mt-1 text-sm font-mono tracking-wider">#{order.id.slice(0, 8)}</p>
          </div>
          
          <div className="flex items-center gap-2">
             <span className="px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-stone-500 flex items-center gap-2">
               <Calendar size={14} />
               {new Date(order.created_at).toLocaleDateString("ar-EG")}
             </span>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Content: Customer Info & Items (Left Column) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Customer Info Card */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
                <div className="p-1.5 bg-white text-amber-600 rounded-lg border border-stone-200 shadow-sm">
                  <User size={18} />
                </div>
                <h2 className="font-bold text-stone-800">بيانات العميل والتوصيل</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-stone-400 bg-stone-50 p-1.5 rounded-full"><Phone size={16} /></div>
                      <div>
                        <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">رقم الهاتف</p>
                        <p className="text-stone-800 font-medium">{order.customer_phone || "غير متوفر"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-stone-400 bg-stone-50 p-1.5 rounded-full"><User size={16} /></div>
                      <div>
                        <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">الاسم</p>
                        <p className="text-stone-800 font-medium">{order.customer_name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-stone-50/50 p-4 rounded-xl border border-stone-100">
                    <div className="mt-1 text-stone-400 bg-white p-1.5 rounded-full shadow-sm"><MapPin size={16} /></div>
                    <div className="flex-1">
                      <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">عنوان الشحن</p>
                      <p className="text-stone-800 font-medium leading-relaxed">
                        {order.customer_address || "لم يتم تحديد العنوان"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Card (Invoice Style) */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white text-amber-600 rounded-lg border border-stone-200 shadow-sm">
                    <Receipt size={18} />
                  </div>
                  <h2 className="font-bold text-stone-800">المنتجات المطلوبة</h2>
                </div>
                <span className="text-xs font-medium text-stone-400">عدد القطع: {order.order_items.length}</span>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {order.order_items.map((item: any, index: number) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100 hover:border-amber-200 transition-colors">
                      <div className="w-20 h-20 bg-white rounded-lg border border-stone-200 shadow-sm shrink-0 relative overflow-hidden">
                        {item.products?.image ? (
                          <img 
                            src={item.products.image} 
                            alt={item.products.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300">
                            <Package size={32} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-stone-900 text-base font-serif leading-tight">
                          {item.products?.name || "منتج محذوف"}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-sm">
                          <span className="text-stone-500">الكمية:</span>
                          <span className="font-medium text-stone-800 bg-white px-2 py-0.5 rounded border border-stone-200 text-xs">
                            {item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="text-left flex flex-col justify-center">
                        <p className="text-sm text-stone-400 mb-1">{item.price} × {item.quantity}</p>
                        <p className="text-lg font-bold text-amber-700">
                          {(item.price * item.quantity).toLocaleString()} ج.م
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Status & Summary (Right Column) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Status Component */}
            <div className="sticky top-6">
              <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
              
              {/* Total Summary Card */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mt-6">
                <div className="p-5 border-b border-stone-100 bg-stone-50">
                   <h2 className="font-bold text-stone-800 text-center">ملخص الدفع</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-500">المجموع الفرعي</span>
                    <span className="font-medium text-stone-700">
                      {order.total.toLocaleString()} ج.م
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-500">الشحن</span>
                    <span className="font-medium text-green-600">مجاني</span>
                  </div>
                  <div className="border-t border-stone-100 my-2 pt-4 flex justify-between items-end">
                    <span className="font-bold text-stone-800 text-lg">الإجمالي النهائي</span>
                    <span className="font-serif font-bold text-2xl text-amber-700">
                      {order.total.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

        </div>
      </div>
    </main>
  );
}