"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { ShoppingCart, PackageX } from "lucide-react";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    if (!product.in_stock) {
      toast.error("عذراً، هذا المنتج غير متوفر حالياً ❌", {
        style: {
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #ef4444",
        },
      });
      return;
    }

    addToCart({
      ...product,
      price:
        product.discount_price &&
        product.discount_price < product.price
          ? Number(product.discount_price)
          : Number(product.price),
    });

    toast.success("تمت إضافة المنتج للسلة بنجاح ✅", {
      style: {
        background: "#1e293b",
        color: "#fff",
        border: "1px solid #f59e0b",
      },
      icon: "🛍️",
    });
  };

  return (
    <Button
      onClick={handleAdd}
      disabled={!product.in_stock}
      className={`
        group relative w-full md:w-auto overflow-hidden rounded-xl px-8 py-6 text-lg font-bold tracking-wide
        transition-all duration-300 ease-out
        ${
          product.in_stock
            ? "bg-linear-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(245,158,11,0.5)] text-white border-0"
            : "bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700"
        }
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {product.in_stock ? (
          <>
            <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
            أضف للسلة
          </>
        ) : (
          <>
            <PackageX className="w-5 h-5" />
            نفذت الكمية
          </>
        )}
      </span>

      {product.in_stock && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-all duration-700 ease-in-out pointer-events-none"></div>
      )}
    </Button>
  );
}