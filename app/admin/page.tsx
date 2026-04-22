import Link from "next/link";
import { createClient } from "@/lib/supabase/server"; // تأكد من أن هذا المسار صحيح
import { 
  Package, 
  ShoppingCart, 
  FolderTree, 
  ArrowLeft, 
  MoreHorizontal, 
  TrendingUp,
  CheckCircle,
  Clock
} from "lucide-react";

export default async function AdminDashboard() {
  // ✅ التصحيح 1: تعريف Supabase وانتظاره قبل الاستخدام
  const supabase = await createClient();

  // جلب الإحصائيات
  const [
    { count: productsCount },
    { count: ordersCount },
    { count: categoriesCount },
    { data: recentOrders }
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5)
  ]);
  
  // ✅ التصحيح 2: تعريف الدوال هنا داخل المكون الرئيسي
  const getStatusIcon = (status: string) => {
    if (status === 'new' || status === 'pending') return <Clock className="w-4 h-4 text-blue-400" />;
    if (status === 'processing' || status === 'shipped') return <ShoppingCart className="w-4 h-4 text-amber-400" />;
    return <CheckCircle className="w-4 h-4 text-green-400" />;
  };
  
  const getStatusText = (status: string) => {
    if (status === 'new' || status === 'pending') return 'جديد';
    if (status === 'processing') return 'جاري التجهيز';
    if (status === 'shipped') return 'تم الشحن';
    if (status === 'completed') return 'مكتمل';
    return status;
  };

  return (
    <main className="min-h-screen bg-[#0f172a] font-sans text-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-wide">
              لوحة <span className="text-amber-500">التحكم</span>
            </h1>
            <p className="text-gray-400 mt-1">مرحباً بك في إدارة بيت الجوري</p>
          </div>
          
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/5 border border-white/10">
            <ArrowLeft size={20} />
            <span>العودة للموقع</span>
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/products">
            <StatCard 
              title="إجمالي المنتجات" 
              value={productsCount || 0} 
              description="اضغط للإدارة"
              icon={<Package size={24} />} 
              color="bg-amber-500/10 text-amber-500 border-amber-500/20" 
              trend="متوفر"
            />
          </Link>
          <Link href="/admin/orders">
            <StatCard 
              title="الطلبات الجديدة" 
              value={ordersCount || 0} 
              description="اضغط للمتابعة"
              icon={<ShoppingCart size={24} />} 
              color="bg-blue-500/10 text-blue-500 border-blue-500/20" 
              trend="نشط"
            />
          </Link>
          <Link href="/admin/categories">
            <StatCard 
              title="الأقسام والفئات" 
              value={categoriesCount || 0} 
              description="إدارة التصنيفات"
              icon={<FolderTree size={24} />} 
              color="bg-purple-500/10 text-purple-500 border-purple-500/20" 
              trend="منظم"
            />
          </Link>
        </div>

        {/* Welcome Banner Section */}
        <section className="relative bg-linear-to-br from-[#1e1b4b] to-[#0f172a] rounded-3xl p-8 md:p-12 text-white shadow-2xl overflow-hidden border border-white/10">
          <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute left-0 bottom-0 text-amber-500/5 transform -rotate-12">
            <FolderTree size={300} />
          </div>

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              المتجر يعمل بكفاءة
            </span>
            
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
              أهلاً بك في لوحة التحكم
            </h2>
            
            <p className="text-gray-400 leading-relaxed mb-8">
              هنا يمكنك الإشراف على كنوز المتجر. تابع مخزون النجف الكريستالي، أدر طلبات التحف العتيقة، وتفقد أدوات المنزل العصرية.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/products" className="px-6 py-3 bg-linear-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white rounded-xl font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2">
                <Package size={20} />
                <span>إدارة المنتجات</span>
              </Link>
              <Link href="/admin/orders" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl font-bold transition-all duration-300 flex items-center gap-2">
                <ShoppingCart size={20} />
                <span>عرض الطلبات</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Activity / Quick Links Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Links */}
          <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3">
              روابط سريعة
            </h3>
            <div className="space-y-3">
              <QuickLink 
                title="إضافة منتج جديد" 
                desc="رفع صور ووصف المنتج" 
                icon={<Package size={20} />} 
                href="/admin/products/new" 
              />
              <QuickLink 
                title="تحديث المخزون" 
                desc="تعديل كميات الطلبيات" 
                icon={<ShoppingCart size={20} />} 
                href="/admin/inventory" 
              />
              <QuickLink 
                title="الأقسام والفئات" 
                desc="إدارة فئات النجف والإكسسوارات" 
                icon={<FolderTree size={20} />} 
                href="/admin/categories" 
              />
            </div>
          </div>

          {/* Quick Overview Table */}
          <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-2xl border border-white/10 p-6 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">آخر الطلبات</h3>
              <Link href="/admin/orders" className="text-sm text-amber-500 hover:text-amber-400 font-medium">عرض الكل</Link>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-70 pr-2">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  // ✅ التصحيح 2: تمرير دالة getStatusIcon كـ prop
                  <ActivityItem 
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    name={`طلب: ${order.customer_name}`} 
                    time={new Date(order.created_at).toLocaleDateString('ar-EG')} 
                    status={order.status || 'new'} 
                    amount={`${order.total} ج.م`}
                    getStatusIcon={getStatusIcon}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  لا توجد طلبات حديثة
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

// --- Sub Components ---

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  color: string;
  trend: string;
}

function StatCard({ title, value, description, icon, color, trend }: StatCardProps) {
  return (
    <div className="group bg-[#1e293b]/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden h-full cursor-pointer">
      <div className={`absolute left-0 top-0 w-1.5 h-full ${color.split(' ')[0].replace('bg-', 'bg-').replace('/10', '/500')}`} />
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} transition-colors group-hover:text-white`}>
          {icon}
        </div>
        <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full flex items-center gap-1 border border-amber-500/20">
          <TrendingUp size={12} /> {trend}
        </span>
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-4xl font-black text-white mt-1 mb-1 font-sans">{value}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function QuickLink({ title, desc, icon, href }: { title: string; desc: string; icon: React.ReactNode; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
      <div className="w-12 h-12 rounded-full bg-[#0b1120] flex items-center justify-center text-gray-400 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0 border border-white/10">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-white text-sm group-hover:text-amber-400">{title}</h4>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
      <MoreHorizontal size={18} className="text-gray-600 group-hover:text-white" />
    </Link>
  );
}

// ✅ التصحيح 2: استقبال getStatusIcon كـ prop
function ActivityItem({ href, name, time, status, amount, getStatusIcon }: any) {
  return (
    <Link href={href} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group">
      <div className="flex items-center gap-3">
        <div className="bg-[#0b1120] p-2 rounded-full border border-white/10">
          {getStatusIcon(status)}
        </div>
        <div>
          <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">{name}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
        {amount}
      </span>
    </Link>
  );
}