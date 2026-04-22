"use client";

import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/store/cart"; 
import { Product } from "@/store/cart"; // التأكد من استيراد نوع المنتج من المتجر

interface ProductCardProps {
  product: Product;
}

// ✅ تأكد هنا من استخدام export default وليس export فقط
export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart(); 
  const displayImage = product.images && product.images.length > 0 ? product.images[0] : product.image;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product); 
  };

  return (
    <Link href={`/products/${product.id}`} className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 h-full flex flex-col block">
      
      {/* صورة المنتج */}
      <div className="relative overflow-hidden aspect-4/5 bg-[#0b1120]">
        <img 
          src={displayImage || "/placeholder.png"} 
          alt={product.title || product.name} 
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition duration-300" />
        
        {/* الأزرار العائمة */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition duration-300 translate-y-4 group-hover:translate-y-0 z-20">
          
          <button 
            onClick={handleAddToCart}
            className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition shadow-lg transform hover:scale-110"
            title="أضف للسلة"
          >
            <ShoppingCart size={20} />
          </button>
          
          <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-white/20 transition shadow-lg transform hover:scale-110">
            <Eye size={20} />
          </button>
        </div>

        {/* شارة الخصم */}
        {product.discount_price && product.discount_price > 0 && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10">
            خصم
          </div>
        )}
      </div>

      {/* معلومات المنتج */}
      <div className="p-5 flex flex-col grow">
        {product.category && (
          <span className="text-xs font-bold text-amber-500/80 mb-2 tracking-wider uppercase">
            {product.category}
          </span>
        )}
        
        <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-amber-400 transition">
          {product.title || product.name}
        </h3>
        
        {/* منطق عرض السعر */}
        <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-white/5">
          
          {/* هل يوجد سعر خصم (discount_price)؟ */}
          {product.discount_price && product.discount_price > 0 ? (
            // نعم
            <>
              <span className="text-xs text-gray-400 line-through font-medium">
                {product.price.toLocaleString()} ج.م
              </span>
              <span className="text-xl font-black text-amber-500">
                {product.discount_price.toLocaleString()} <span className="text-sm font-normal text-white/50">ج.م</span>
              </span>
            </>
          ) : (
            // لا
            <span className="text-xl font-black text-amber-400">
              {product.price.toLocaleString()} <span className="text-sm font-normal text-white/50">ج.م</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}