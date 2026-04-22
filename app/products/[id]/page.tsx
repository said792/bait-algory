// app/products/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton"; // ✅ استدعينا المكون الجديد
import Link from "next/link";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ استخراج الـ id
  const { id } = await params;

  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6 md:p-12">
      <Link href="/products" className="text-blue-600 hover:underline mb-4 block">
        &larr; عودة للمنتجات
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-400">
              لا توجد صورة
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          
          <div className="text-3xl font-bold text-primary mb-6">
            {product.price} جنيه
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-wrap">
            {product.description || "لا يوجد وصف متاح لهذا المنتج."}
          </p>

          <div className="mb-6 flex items-center gap-2">
             {product.in_stock ? (
              <span className="text-green-600 font-bold">✅ متوفر في المخزن</span>
             ) : (
              <span className="text-red-500 font-bold">❌ غير متوفر</span>
             )}
          </div>

          {/* ✅ استخدام المكون المنفصل */}
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}