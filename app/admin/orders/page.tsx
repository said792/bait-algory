// app/admin/orders/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { 
  ArrowRight, 
  Package, 
  CreditCard, 
  Clock, 
  MoreHorizontal,
  FileText
} from "lucide-react";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  
  // جلب الطلبات مرتبة حسب الأحدث
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  // ✅ التصحيح: استخدام Number() لضمان أن الجمع هو حسابي وليس نَصي
  const totalRevenue = orders?.reduce((acc, order) => acc + Number(order.total || 0), 0) || 0;
  
  const pendingOrders = orders?.filter(o => o.status === 'new' || o.status === 'processing').length || 0;

  return (
    <main className="min-h-screen bg-[#fdfbf7] font-sans text-stone-800">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-stone-200 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-wide">
              إدارة الطلبات
            </h1>
            <p className="text-stone-500 mt-1">متابعة مبيعات التحف والديكورات وحالة الشحن</p>
          </div>
          
          <Link href="/admin" className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-stone-100">
            <ArrowRight size={20} />
            <span>عودة للوحة التحكم</span>
          </Link>
        </header>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <p className="text-stone-500 text-sm font-medium">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-stone-900">{orders?.length || 0}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-stone-500 text-sm font-medium">الإيرادات الإجمالية</p>
              <p className="text-2xl font-bold text-stone-900">{totalRevenue.toLocaleString()} ج.م</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-stone-500 text-sm font-medium">بانتظار الإجراء</p>
              <p className="text-2xl font-bold text-stone-900">{pendingOrders}</p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-100 bg-stone-50 flex justify-between items-center">
            <h3 className="font-serif font-bold text-lg text-stone-800">سجل الطلبات</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="بحث برقم الطلب..." 
                className="text-sm border border-stone-200 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="p-4 font-bold text-xs uppercase text-stone-500 tracking-wider">رقم الطلب</th>
                  <th className="p-4 font-bold text-xs uppercase text-stone-500 tracking-wider">العميل</th>
                  <th className="p-4 font-bold text-xs uppercase text-stone-500 tracking-wider">الإجمالي</th>
                  <th className="p-4 font-bold text-xs uppercase text-stone-500 tracking-wider">الحالة</th>
                  <th className="p-4 font-bold text-xs uppercase text-stone-500 tracking-wider">التاريخ</th>
                  <th className="p-4 font-bold text-xs uppercase text-stone-500 tracking-wider">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders && orders.length > 0 ? (
                  orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-stone-50 transition group">
                      <td className="p-4 font-mono text-xs text-stone-500 bg-stone-50/50 group-hover:text-amber-600 transition-colors">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-stone-900 text-sm">{order.customer_name || "زائر"}</div>
                      </td>
                      <td className="p-4 font-bold text-amber-700 text-sm">{Number(order.total).toLocaleString()} ج.م</td>
                      <td className="p-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="p-4 text-xs text-stone-400 font-medium">
                        {new Date(order.created_at).toLocaleDateString("ar-EG", {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </td>
                      <td className="p-4">
                        <Link 
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-amber-700 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <FileText size={14} />
                          <span>عرض</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center text-stone-400">
                        <Package size={48} className="mb-4 text-stone-200" />
                        <p className="font-medium text-lg">لا توجد طلبات حتى الآن</p>
                        <p className="text-sm">عندما يقوم العملاء بشراء التحف، ستظهر هنا.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}

// مكون مساعد لشكل الحالة
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-blue-100 text-blue-700 border border-blue-200",
    processing: "bg-amber-100 text-amber-700 border border-amber-200",
    delivered: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    cancelled: "bg-red-100 text-red-700 border border-red-200",
  };

  const labels: Record<string, string> = {
    new: "جديد",
    processing: "قيد التحضير",
    delivered: "تم التوصيل",
    cancelled: "ملغي",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {labels[status] || status}
    </span>
  );
}