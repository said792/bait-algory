// components/Header.tsx
"use client";

import Link from "next/link";
import { ShoppingCart, LockKeyhole } from "lucide-react"; // ✅ التعديل: استخدمنا { }
import { useCart } from "@/store/cart";

export default function Header() {
  const { items } = useCart();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* الشعار */}
        <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight">
          بيت الجوري
        </Link>

        <div className="flex items-center gap-4">
          {/* زر دخول الأدمن */}
          <Link 
            href="/admin" 
            className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition"
          >
            <LockKeyhole size={16} />
            <span>الإدارة</span>
          </Link>

          {/* أيقونة السلة */}
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition group">
            <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-black" />
            
            {/* دائرة العدد */}
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}