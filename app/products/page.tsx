"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import ProductCard from "@/app/products/product-card";
import Link from "next/link";
import {
  ChevronLeft,
  Filter,
  X,
  CheckCircle,
  List,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string>("all");
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data: products, error } = await supabase
          .from("products")
          .select(
            `
            *,
            categories (
              id,
              name
            )
          `
          )
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (products) {
          setAllProducts(products);

          const categoriesMap = new Map<string, string>();

          products.forEach((p: any) => {
            if (p.categories?.id && p.categories?.name) {
              categoriesMap.set(p.categories.id, p.categories.name);
            }
          });

          setCategories(
            Array.from(categoriesMap.entries()).map(([id, name]) => ({
              id,
              name,
            }))
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategoryId === "all"
      ? allProducts
      : allProducts.filter(
          (p) => p.categories?.id === selectedCategoryId
        );

  return (
    <div className="min-h-screen bg-[#0f172a] pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition mb-4"
            >
              <ChevronLeft size={20} />
              العودة للرئيسية
            </Link>

            <h1 className="text-4xl md:text-5xl font-black text-white">
              تشكيلة{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">
                المنتجات
              </span>
            </h1>

            <p className="text-gray-400">
              تصفح مجموعتنا الكاملة من المنتجات
            </p>
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl"
          >
            <Filter size={18} />
            تصفية
          </button>
        </div>

        {loading ? (
          <div className="text-center py-32 text-gray-400">
            جاري التحميل...
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 text-white">
            لا توجد منتجات
          </div>
        )}
      </div>

      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#1e293b] z-50 transition-transform ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between p-6 border-b border-white/10">
          <h2 className="text-white flex items-center gap-2">
            <List /> الأقسام
          </h2>
          <button onClick={() => setIsFilterOpen(false)}>
            <X />
          </button>
        </div>

        <div className="p-4 space-y-2">
          <button
            onClick={() => setSelectedCategoryId("all")}
            className="w-full p-3 text-white bg-[#0b1120] rounded-xl"
          >
            جميع المنتجات
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className="w-full p-3 text-white bg-[#0b1120] rounded-xl"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}