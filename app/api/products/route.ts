// app/api/products/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// ✅ دالة الـ GET المضافة الآن (جلب كل المنتجات)
export async function GET() {
  const supabase = await createClient();
  
  try {
    // جلب المنتجات مع اسم الفئة
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories (name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data || []);
    
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ دالة الـ POST الموجودة عندك (إضافة منتج)
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  
  try {
    // 1. قراءة الـ FormData
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const discount_price = formData.get("discount_price") as string; // أضفنا هذا إن لم يكن موجوداً
    const quantity = formData.get("quantity") as string;
    const category_id = formData.get("category_id") as string;
    const subcategory_id = formData.get("subcategory_id") as string;

    // 2. رفع الصورة لـ Supabase Storage
    let imagePath = "";
    if (file && file.size > 0) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      // رفع الصورة للـ bucket اللي اسمه products
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload Error:", uploadError);
        return NextResponse.json({ error: "فشل رفع الصورة" }, { status: 500 });
      }

      // جلب الرابط العام (Public URL)
      const { data: publicUrlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);
      
      imagePath = publicUrlData.publicUrl;
    }

    // 3. حفظ البيانات في قاعدة البيانات
    // ملاحظة: تأكد أن جدول products لديه عمود discount_price
    const { data: product, error: dbError } = await supabase
      .from("products")
      .insert({
        name,
        description,
        price: parseFloat(price),
        discount_price: discount_price ? parseFloat(discount_price) : null,
        quantity: parseInt(quantity),
        category_id,
        subcategory_id, // أضفنا هذا
        image: imagePath,
        in_stock: parseInt(quantity) > 0, 
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB Error:", dbError);
      return NextResponse.json({ error: "فشل الحفظ في قاعدة البيانات" }, { status: 500 });
    }

    return NextResponse.json({ product }, { status: 201 });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "خطأ في السيرفر" }, { status: 500 });
  }
}