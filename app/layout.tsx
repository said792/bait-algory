import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
// لم نعد نستدعي Header هنا

const inter = Inter({ subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: "بيت الجوري | للنجف والتحف",
  description: "متجر النجف والأدوات المنزلية",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      {/* خلفية داكنة لتناسب الصفحة الرئيسية الجديدة */}
      <body className={`${inter.className} bg-[#0f172a] text-gray-100 antialiased`}>
        
        {/* المحتوى فقط (بدون هيدر) */}
        {children}

        {/* التنبيهات */}
        <Toaster position="top-center" richColors dir="rtl" />

      </body>
    </html>
  );
}