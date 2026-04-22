// app/api/checkout/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const body = await req.json();
    const { customer_name, customer_phone, customer_address, total, items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
    }

    // 1. إنشاء الطلب الأساسي
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_phone,
        customer_address,
        total: parseFloat(total),
        status: "new",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order Error:", orderError);
      return NextResponse.json({ error: "فشل إنشاء الطلب" }, { status: 500 });
    }

    // 2. إضافة بنود الطلب
    const orderItemsToInsert = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error("Order Items Error:", itemsError);
      return NextResponse.json({ error: "فشل حفظ منتجات الطلب" }, { status: 500 });
    }

    // ✅ 3. منطق خصم الكمية من المخزون (Update Stock)
    for (const item of items) {
      // أولاً نجيب الكمية الحالية للمنتج
      const { data: product } = await supabase
        .from("products")
        .select("quantity")
        .eq("id", item.id)
        .single();

      if (product) {
        const currentQty = product.quantity || 0;
        const orderedQty = item.quantity;
        const newQty = Math.max(0, currentQty - orderedQty); // نمنع الكمية السالبة لو حبيت

        // تحديث الكمية الجديدة
        const { error: updateError } = await supabase
          .from("products")
          .update({ quantity: newQty })
          .eq("id", item.id);

        if (updateError) {
          console.error(`Failed to update stock for ${item.id}:`, updateError);
          // مش نعمل Return Error عشان ما نوقف كل الطلب، بس بنطبع في الـ Console
        }
      }
    }

    // ملحوظة: التريجر اللي عملناه قبل كده (trigger_update_stock)
    // هيشتغل تلقائياً هنا عشان سوينا Update
    // هيفحص الكمية لو وصلت 0 ويخلي in_stock = false

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "خطأ في السيرفر" }, { status: 500 });
  }
}