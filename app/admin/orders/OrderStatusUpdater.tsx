// app/admin/orders/OrderStatusUpdater.tsx
"use client";

import { useState, useTransition } from "react";
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Home, 
  XCircle, 
  Loader2 
} from "lucide-react";

export function OrderStatusUpdater({ orderId, currentStatus }: any) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const updateStatus = (newStatus: string) => {
    startTransition(async () => {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        // يمكن استبدال التنبيه بنظام توست لاحقاً، لكن سنحافظ عليه الآن
        alert("تم تحديث حالة الطلب بنجاح");
      } else {
        alert("حدث خطأ أثناء الاتصال بالسيرفر");
      }
    });
  };

  // إعدادات الخيارات مع الألوان والأيقونات المناسبة لكل حالة
  const options = [
    { 
      value: "new", 
      label: "طلب جديد", 
      description: "تم استلام الطلب ولم يتم المعالجة بعد",
      icon: <Package size={20} />, 
      activeClasses: "border-sky-500 bg-sky-50/50 ring-1 ring-sky-200 text-sky-700",
      inactiveClasses: "border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-500"
    },
    { 
      value: "processing", 
      label: "جاري التحضير", 
      description: "الطلب قيد التجهيز والشحن",
      icon: <Truck size={20} />, 
      activeClasses: "border-amber-500 bg-amber-50/50 ring-1 ring-amber-200 text-amber-700",
      inactiveClasses: "border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-500"
    },
    { 
      value: "delivered", 
      label: "تم التوصيل", 
      description: "وصل الطلب للعميل بنجاح",
      icon: <Home size={20} />, 
      activeClasses: "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-200 text-emerald-700",
      inactiveClasses: "border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-500"
    },
    { 
      value: "cancelled", 
      label: "ملغي", 
      description: "تم إلغاء هذا الطلب",
      icon: <XCircle size={20} />, 
      activeClasses: "border-rose-500 bg-rose-50/50 ring-1 ring-rose-200 text-rose-700",
      inactiveClasses: "border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-500"
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
        <h3 className="font-serif font-bold text-lg text-stone-800">تحديث حالة الطلب</h3>
        {isPending && <Loader2 className="animate-spin text-amber-500" size={20} />}
      </div>

      <div className="space-y-3">
        {options.map((opt) => {
          const isActive = status === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => !isPending && updateStatus(opt.value)}
              disabled={isPending}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 relative group
                ${isActive ? opt.activeClasses : opt.inactiveClasses}
                ${isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {/* أيقونة الحالة */}
              <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-white' : 'bg-stone-100 group-hover:bg-white'}`}>
                <span className={isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}>
                  {opt.icon}
                </span>
              </div>

              {/* النصوص */}
              <div className="text-right flex-1">
                <h4 className={`font-bold text-sm transition-colors ${isActive ? 'text-stone-900' : 'text-stone-600'}`}>
                  {opt.label}
                </h4>
                <p className={`text-xs mt-0.5 ${isActive ? 'opacity-80' : 'opacity-60'}`}>
                  {opt.description}
                </p>
              </div>

              {/* أيقونة علامة الصح للنشط */}
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                ${isActive ? 'bg-current text-white scale-100' : 'bg-stone-200 text-transparent scale-50'}
              `}>
                <CheckCircle size={14} fill="currentColor" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}