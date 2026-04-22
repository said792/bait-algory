import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "الرجاء تعبئة جميع الحقول المطلوبة" }, { status: 400 });
    }

    // ✅ قالب الإيميل الفاخر (Dark Luxury)
    const html = `
      <div dir="rtl" style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        background-color: #0f172a; 
        color: #f8fafc; 
        padding: 40px 20px; 
        line-height: 1.6;
      ">
        <div style="
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #1e293b; 
          border: 1px solid #334155; 
          border-radius: 16px; 
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        ">
          
          <!-- Header Section -->
          <div style="
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
            padding: 40px 30px; 
            text-align: center;
          ">
            <h1 style="margin: 0; color: #fff; font-size: 32px; font-weight: bold; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              بيت الجوري
            </h1>
            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px; text-transform: uppercase; letter-spacing: 2px;">
              نجف فاخر وتحف أصيلة
            </p>
          </div>

          <!-- Content Section -->
          <div style="padding: 40px 30px;">
            <h2 style="margin-top: 0; color: #fbbf24; font-size: 24px; margin-bottom: 30px; border-bottom: 2px solid #334155; padding-bottom: 15px;">
              رسالة جديدة من الموقع
            </h2>
            
            <div style="margin-bottom: 30px;">
              <p style="color: #94a3b8; font-size: 14px; margin-bottom: 8px;">العميل</p>
              <p style="color: #fff; font-size: 20px; font-weight: bold; margin: 0;">${name}</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
              <div>
                <p style="color: #94a3b8; font-size: 14px; margin-bottom: 8px;">رقم الهاتف</p>
                <p style="color: #fff; font-size: 18px; margin: 0;">${phone}</p>
              </div>
              <div>
                <p style="color: #94a3b8; font-size: 14px; margin-bottom: 8px;">البريد الإلكتروني</p>
                <p style="color: #fff; font-size: 18px; margin: 0;">${email}</p>
              </div>
            </div>

            <div style="
              background-color: rgba(0,0,0,0.3); 
              border-right: 4px solid #f59e0b; 
              padding: 25px; 
              border-radius: 0 12px 12px 0; 
              margin-top: 30px; 
            ">
              <p style="color: #94a3b8; font-size: 14px; margin: 0 0 10px 0;">الرسالة:</p>
              <p style="margin: 0; color: #fff; font-size: 16px; white-space: pre-wrap;">${message}</p>
            </div>
          </div>

          <!-- Footer Section -->
          <div style="
            background-color: #020617; 
            padding: 25px; 
            text-align: center; 
            border-top: 1px solid #334155;
          ">
            <p style="margin: 0; color: #64748b; font-size: 12px;">
              © ${new Date().getFullYear()} بيت الجوري. جميع الحقوق محفوظة.
            </p>
            <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 11px;">
              تم إرسال هذه الرسالة من نموذج الاتصال في موقعنا الرسمي.
            </p>
          </div>

        </div>
      </div>
    `;

    // نسخة نصية احتياطية
    const text = `
      رسالة جديدة من الموقع
      ----------------------
      الاسم: ${name}
      البريد: ${email}
      الهاتف: ${phone}
      الرسالة: ${message}
    `;

    // ✅ إرسال الإيميل
    const { data, error } = await resend.emails.send({
      from: 'Bait Aljouri <onboarding@resend.dev>', // يمكنك تغيير الدومين بعد التحقق
      // ⭐ هذا هو المكان الذي يحدد من سيصل له الإيميل
      to: 'saidsadik879@gmail.com', 
      subject: `رسالة جديدة: ${name}`,
      html: html,
      text: text,
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json({ error: "حدث خطأ أثناء إرسال الرسالة" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}