// app/cart/page.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();

  const totalAmount = items.reduce((total, item) => {
    const effectivePrice =
      item.discount_price && item.discount_price < item.price
        ? Number(item.discount_price)
        : Number(item.price);

    return total + effectivePrice * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#0f172a] pt-28 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 text-amber-500 mb-6">
            <ShoppingBag size={40} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            سلة المشتريات فارغة
          </h1>
          <p className="text-gray-400 mb-8">
            لم تقم بإضافة أي منتجات بعد. ابدأ الآن وتسوق من تشكيلتنا الفاخرة.
          </p>
          <Link href="/products">
            <Button className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white border-none py-6 px-8 rounded-xl">
              تصفح المنتجات
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition group"
          >
            <ArrowLeft className="text-gray-400 group-hover:text-white" size={24} />
          </Link>

          <div>
            <h1 className="text-3xl font-black text-white">سلة المشتريات</h1>
            <p className="text-gray-400 text-sm">
              لديك {items.length} منتجات في السلة
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const effectivePrice =
                item.discount_price && item.discount_price < item.price
                  ? Number(item.discount_price)
                  : Number(item.price);

              return (
                <div
                  key={item.id}
                  className="group bg-[#1e293b]/50 backdrop-blur-md border border-white/10 rounded-3xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6"
                >
                  <div className="w-full md:w-28 h-40 md:h-28 bg-[#0b1120] rounded-2xl overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 w-full text-center md:text-right">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {item.name}
                    </h3>

                    <div className="flex flex-col gap-1">
                      {item.discount_price &&
                      item.discount_price < item.price ? (
                        <>
                          <span className="text-sm text-gray-500 line-through">
                            {item.price} ج.م
                          </span>
                          <span className="text-amber-500 font-bold text-lg">
                            {effectivePrice} ج.م
                          </span>
                        </>
                      ) : (
                        <span className="text-amber-400 font-bold text-lg">
                          {item.price} ج.م
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-[#0b1120] p-2 rounded-xl">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="w-10 h-10 flex items-center justify-center rounded-lg"
                    >
                      <Minus size={18} />
                    </button>

                    <span className="w-8 text-center font-bold text-white">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-10 h-10 flex items-center justify-center rounded-lg"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1e293b]/50 border border-white/10 rounded-3xl p-6 sticky top-28">
              <h2 className="text-2xl font-black text-white mb-6">
                ملخص الطلب
              </h2>

              <div className="flex justify-between mb-8">
                <span className="text-gray-300">الإجمالي</span>
                <span className="text-amber-400 text-3xl font-black">
                  {totalAmount.toLocaleString()} ج.م
                </span>
              </div>

              <Link href="/checkout" className="block w-full">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold text-lg py-6 rounded-xl">
                  إتمام الطلب
                  <ChevronRight className="mr-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}