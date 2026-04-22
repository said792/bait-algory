// app/api/products/[id]/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  try {
    const formData = await req.formData();
    
    // 1. قراءة البيانات من الـ FormData
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const discount_price = formData.get("discount_price") as string | null;
    const quantity = formData.get("quantity") as string;
    const category_id = formData.get("category_id") as string;
    const subcategory_id = formData.get("subcategory_id") as string;
    const file = formData.get("file") as File | null;

    // 2. كائن البيانات للتحديث (سنملأه بالحقول فقط إذا أُرسلت)
    const updateData: any = {};

    if (name) updateData.name = name;
    if (description !== null) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (quantity) updateData.quantity = parseInt(quantity);
    if (category_id) updateData.category_id = category_id;
    if (subcategory_id) updateData.subcategory_id = subcategory_id;

    // التعامل مع سعر الخصم
    // إذا أُرسل الحقل (حتى لو فارغ)، سنقوم بتحديثه
    if (discount_price !== null) {
      if (discount_price === "") {
        // إذا أرسلته فارغاً، يعني أريد حذف الخصم
        updateData.discount_price = null;
      } else {
        // إذا أرسلت قيمة، أحدثها
        updateData.discount_price = parseFloat(discount_price);
      }
    }

    // 3. التعامل مع الصورة (إذا تم رفع واحدة جديدة)
    if (file && file.size > 0) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (uploadError) {
        return NextResponse.json({ error: "فشل رفع الصورة" }, { status: 500 });
      }
      
      const { data: publicUrlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);
      
      updateData.image = publicUrlData.publicUrl;
    }

    // 4. تنفيذ التحديث في قاعدة البيانات
    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update Error:", error);
      return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
    }

    // 5. ✅ مسح الـ Cache (هذا الحل للمشكلة)
    revalidatePath("/api/products"); // إجبار السيرفر لجلب بيانات جديدة
    revalidatePath("/products"); // مسح كاش صفحة المنتجات

    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "خطأ في السيرفر" }, { status: 500 });
  }
}