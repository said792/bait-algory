import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // ✅ إضافة dir="rtl" للتأكد من التوجيه الصحيح
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      {/* Sidebar (سيكون في اليمين تلقائياً مع RTL) */}
      <aside className="w-64 bg-slate-900 text-white hidden md:block flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-800 text-center">
          <h2 className="text-xl font-bold">لوحة التحكم</h2>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="الرئيسية" />
          <NavItem href="/admin/products" icon={<Package size={20} />} label="المنتجات" />
          <NavItem href="/admin/categories" icon={<Users size={20} />} label="الفئات" />
          <NavItem href="/admin/orders" icon={<ShoppingCart size={20} />} label="الطلبات" />
         <NavItem href="/admin/inventory" icon={<ShoppingCart size={20} />} label="الرصيد" />
         <NavItem href="/admin/discounts" icon={<ShoppingCart size={20} />} label="تسجيل خصومات" />
          <NavItem href="/admin/settings" icon={<Settings size={20} />} label="الإعدادات" />
        </nav>

        {/* خروج */}
        <div className="p-4 border-t border-slate-800">
           <Link href="/" className="flex items-center gap-3 text-slate-400 hover:text-white transition">
              <LogOut size={18} />
              <span>خروج من الإدارة</span>
           </Link>
        </div>
      </aside>

      {/* Main Content (سيكون في الشمال) */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: any) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white font-medium">
      {icon}
      <span>{label}</span>
    </Link>
  );
}