// app/api/categories/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  // ✅ التعديل: إضافة subcategories(*) عشان نيجيب الفئات الفرعية المرتبطة
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*, subcategories(*)"); 

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(categories || []);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "اسم الفئة مطلوب" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({ name })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}