"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ArrowRight, 
  LayoutGrid,
  FolderTree,
  Pencil,
  Check,
  X
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  subcategories?: Subcategory[];
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State لإضافة الفئات
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [selectedCatId, setSelectedCatId] = useState<string>("");

  // State للتعديل (Main Categories)
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState("");

  // State للتعديل (Subcategories)
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editSubName, setEditSubName] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // جلب الفئات مع الفرعيات المرتبطة
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*, subcategories(*)")
        .order("created_at", { ascending: false });
      
      if (categoriesData) {
        setCategories(categoriesData as Category[]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- دوال الفئات الرئيسية ---

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const { error } = await supabase.from("categories").insert({ name: newCategoryName });
    if (!error) {
      setNewCategoryName("");
      fetchCategories();
    } else {
      alert("فشل الإضافة");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة وجميع فئاتها الفرعية؟")) return;
    
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) alert("فشل الحذف");
    else fetchCategories();
  };

  const startEditCat = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditCatName(cat.name);
  };

  const saveEditCat = async () => {
    if (!editCatName.trim()) return;
    const { error } = await supabase.from("categories").update({ name: editCatName }).eq("id", editingCatId);
    if (!error) {
      setEditingCatId(null);
      fetchCategories();
    } else {
      alert("فشل التعديل");
    }
  };

  // --- دوال الفئات الفرعية ---

  const handleAddSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !selectedCatId) return;

    const { error } = await supabase.from("subcategories").insert({
      name: newSubName,
      category_id: selectedCatId,
    });

    if (error) {
      alert("فشل الإضافة: " + error.message);
    } else {
      setNewSubName("");
      fetchCategories();
    }
  };

  const handleDeleteSub = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة الفرعية؟")) return;
    
    const { error } = await supabase.from("subcategories").delete().eq("id", id);
    if (error) alert("فشل الحذف");
    else fetchCategories();
  };

  const startEditSub = (sub: Subcategory) => {
    setEditingSubId(sub.id);
    setEditSubName(sub.name);
  };

  const saveEditSub = async () => {
    if (!editSubName.trim()) return;
    const { error } = await supabase.from("subcategories").update({ name: editSubName }).eq("id", editingSubId);
    if (!error) {
      setEditingSubId(null);
      fetchCategories();
    } else {
      alert("فشل التعديل");
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-gray-100 font-sans pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-8 mb-8 border-b border-white/10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-wide">
              إدارة <span className="text-amber-500">الفئات</span>
            </h1>
            <p className="text-gray-400 mt-2">تنظيم أقسام النجف والتحف والأدوات المنزلية</p>
          </div>
          
          <a href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/5 border border-white/10">
            <ArrowRight size={20} />
            <span>عودة للوحة التحكم</span>
          </a>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Add Main Category */}
            <div className="bg-[#1e293b]/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center gap-2 mb-4 text-white">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                  <LayoutGrid size={20} />
                </div>
                <h3 className="font-bold text-lg">إضافة فئة رئيسية</h3>
              </div>
              
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="مثال: نجف كريستالي"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-all"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2">
                  <Plus size={18} />
                  إضافة فئة
                </button>
              </form>
            </div>

            {/* Add Subcategory */}
            <div className="bg-[#1e293b]/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center gap-2 mb-4 text-white">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                  <FolderTree size={20} />
                </div>
                <h3 className="font-bold text-lg">إضافة فئة فرعية</h3>
              </div>
              
              <form onSubmit={handleAddSub} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">الفئة الأم</label>
                  <select
                    className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
                    value={selectedCatId}
                    onChange={(e) => setSelectedCatId(e.target.value)}
                    required
                  >
                    <option value="">-- اختر الفئة --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">اسم الفئة الفرعية</label>
                  <input
                    type="text"
                    placeholder="مثال: نجف غرفة نوم"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    className="w-full bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-all"
                    required
                  />
                </div>

                <button type="submit" className="w-full bg-linear-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2">
                  <Plus size={18} />
                  إضافة فرعية
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-8">
            <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">
              <div className="p-5 border-b border-white/10 bg-[#0b1120]/50 flex justify-between items-center">
                <h3 className="font-bold text-lg text-white">سجل الفئات</h3>
                <span className="text-sm text-gray-400 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  العدد: {categories.length}
                </span>
              </div>
              
              {loading ? (
                <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mb-3"></div>
                  <span>جاري تحميل البيانات...</span>
                </div>
              ) : categories.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <FolderTree size={48} className="mx-auto mb-3 text-gray-600" />
                  <p>لا توجد فئات مضافة بعد.</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {categories.map((cat) => (
                    <div key={cat.id} className="group border border-white/5 rounded-xl p-4 hover:border-white/20 transition-all bg-[#0b1120]/30">
                      {/* Main Category Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <LayoutGrid size={20} />
                          </div>
                          <div className="flex-1">
                            {/* Edit Mode for Main Category */}
                            {editingCatId === cat.id ? (
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={editCatName}
                                  onChange={(e) => setEditCatName(e.target.value)}
                                  className="bg-[#0f172a] border border-white/20 rounded-lg px-2 py-1 text-white w-full text-sm focus:outline-none"
                                  autoFocus
                                />
                                <button onClick={saveEditCat} className="text-green-400 hover:text-green-300 p-1"><Check size={18}/></button>
                                <button onClick={() => setEditingCatId(null)} className="text-red-400 hover:text-red-300 p-1"><X size={18}/></button>
                              </div>
                            ) : (
                              <h3 className="font-bold text-lg text-white font-serif">{cat.name}</h3>
                            )}
                            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full w-fit mt-1 block">
                              {cat.subcategories?.length || 0} فئات فرعية
                            </span>
                          </div>
                        </div>
                        
                        {/* Action Buttons for Main Category */}
                        <div className="flex items-center gap-2">
                          {editingCatId !== cat.id && (
                             <button 
                              onClick={() => startEditCat(cat)} 
                              className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 p-2 rounded-lg transition-all"
                              title="تعديل"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteCategory(cat.id)} 
                            className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                            title="حذف الفئة"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Subcategories List */}
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pr-4 mt-2 space-y-2 border-r-2 border-dashed border-white/10 relative">
                          <div className="absolute -right-[5px] top-2 w-2 h-2 rounded-full bg-gray-600"></div>
                          
                          {cat.subcategories.map((sub) => (
                            <div key={sub.id} className="flex items-center gap-2 text-sm text-gray-300 py-1.5 hover:bg-white/5 px-2 rounded-lg transition-colors group/sub">
                              <ChevronLeft size={14} className="text-amber-500/70" />
                              
                              {/* Edit Mode for Subcategory */}
                              {editingSubId === sub.id ? (
                                <div className="flex items-center gap-2 w-full">
                                  <input
                                    type="text"
                                    value={editSubName}
                                    onChange={(e) => setEditSubName(e.target.value)}
                                    className="bg-[#0f172a] border border-white/20 rounded-lg px-2 py-1 text-white w-full text-xs focus:outline-none"
                                    autoFocus
                                  />
                                  <button onClick={saveEditSub} className="text-green-400 hover:text-green-300 p-1"><Check size={14}/></button>
                                  <button onClick={() => setEditingSubId(null)} className="text-red-400 hover:text-red-300 p-1"><X size={14}/></button>
                                </div>
                              ) : (
                                <span className="w-full">{sub.name}</span>
                              )}
                              
                              {/* Subcategory Actions (Only if not editing) */}
                              {editingSubId !== sub.id && (
                                <div className="flex gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                  <button onClick={() => startEditSub(sub)} className="text-gray-500 hover:text-amber-400 p-1"><Pencil size={12} /></button>
                                  <button onClick={() => handleDeleteSub(sub.id)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 size={12} /></button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Empty subcategories state */}
                      {(!cat.subcategories || cat.subcategories.length === 0) && (
                         <p className="text-xs text-gray-600 mt-2 mr-4 italic">لا توجد فئات فرعية ضمن هذه الفئة.</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}