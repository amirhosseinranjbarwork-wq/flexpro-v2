import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useApp } from '../context/AppContext';
import type { User } from '../types/index';
import { useSupplements } from '../hooks/useExercises';

interface SupplementsPanelProps {
  activeUser: User;
  onUpdateUser: (user: User) => void;
}

const SupplementsPanel: React.FC<SupplementsPanelProps> = ({ activeUser, onUpdateUser }) => {
  const { theme, hasPermission } = useApp();
  const canEdit = hasPermission('editProgram', activeUser.id);
  const [formData, setFormData] = useState({ name: '', dose: '', time: '', note: '' });

  // بارگذاری داده‌های مکمل‌ها از Supabase
  const { data: supplementsFromDB = [] } = useSupplements();

  // لیست مکمل‌ها (fallback برای کمپتیبیلیتی)
  const supplementsData = useMemo(() => {
    if (supplementsFromDB && supplementsFromDB.length > 0) {
      return supplementsFromDB.map((s: any) => s.name);
    }
    
    return [
    // پروتئین‌ها
    "پروتئین وی (Whey Protein)",
    "پروتئین وی ایزوله (Whey Isolate)",
    "پروتئین وی کنسانتره (Whey Concentrate)",
    "پروتئین وی هیدرولیزه (Whey Hydrolysate)",
    "پروتئین کازئین (Casein Protein)",
    "پروتئین کازئین میسلار (Micellar Casein)",
    "پروتئین تخم مرغ (Egg Protein)",
    "پروتئین گوشت (Beef Protein)",
    "پروتئین سویا (Soy Protein)",
    "پروتئین نخود (Pea Protein)",
    "پروتئین برنج (Rice Protein)",
    "پروتئین کنف (Hemp Protein)",
    "پروتئین گیاهی ترکیبی (Plant Blend)",
    "گینر (Mass Gainer)",
    "گینر کم‌قند (Low-Sugar Mass Gainer)",
    "گینر پرکربوهیدرات (High-Carb Mass Gainer)",

    // کراتین
    "کراتین مونوهیدرات (Creatine Monohydrate)",
    "کراتین اتیل استر (Creatine Ethyl Ester)",
    "کراتین هیدروکلراید (Creatine HCl)",
    "کراتین بافر شده (Buffered Creatine)",
    "کراتین مایکرو (Micronized Creatine)",
    "کراتین مایع (Liquid Creatine)",

    // آمینو اسیدها
    "BCAA (اسیدهای آمینه شاخه‌دار)",
    "BCAA 2:1:1",
    "BCAA 4:1:1",
    "BCAA 8:1:1",
    "EAA (اسیدهای آمینه ضروری)",
    "گلوتامین (Glutamine)",
    "گلوتامین پپتید (Glutamine Peptide)",
    "آرژنین (L-Arginine)",
    "سیترولین (Citrulline)",
    "سیترولین مالات (Citrulline Malate)",
    "تائورین (Taurine)",
    "گلیسین (Glycine)",
    "آلانین (Alanine)",
    "بتا آلانین (Beta-Alanine)",
    "HMB (هیدروکسی متیل بوتیرات)",
    "لوسین (Leucine)",
    "ایزولوسین (Isoleucine)",
    "والین (Valine)",

    // پری و پست ورک‌اوت
    "پمپ/پری ورک اوت (Pre-Workout)",
    "پری ورک‌اوت بدون کافئین (Stim-Free Pre-Workout)",
    "پست ورک‌اوت (Post-Workout)",
    "اینتراک (Intra-Workout)",

    // چربی‌سوزها
    "چربی‌سوز (Fat Burner)",
    "چربی‌سوز طبیعی (Natural Fat Burner)",
    "چربی‌سوز بدون کافئین (Caffeine-Free Fat Burner)",
    "L-کارنیتین (L-Carnitine)",
    "L-کارنیتین ترت (L-Carnitine L-Tartrate)",
    "CLA (کنژوگه لینولئیک اسید)",
    "کافئین (Caffeine)",
    "کافئین بدون آب (Anhydrous Caffeine)",
    "گرین تی (Green Tea Extract)",
    "گرین کافی (Green Coffee)",
    "پیپرین (Piperine)",
    "کولین (Choline)",

    // ریکاوری و مفاصل
    "گلوکوزامین (Glucosamine)",
    "کندروئیتین (Chondroitin)",
    "MSM (متیل سولفونیل متان)",
    "کولاژن (Collagen)",
    "کولاژن هیدرولیزه (Hydrolyzed Collagen)",
    "کولاژن مرغ (Chicken Collagen)",
    "کولاژن ماهی (Fish Collagen)",
    "کورکومین (Curcumin)",
    "بروم لین (Bromelain)",
    "پاپائین (Papain)",

    // ویتامین‌ها و مواد معدنی
    "ویتامین A",
    "ویتامین B کمپلکس",
    "ویتامین B1 (تیامین)",
    "ویتامین B2 (ریبوفلاوین)",
    "ویتامین B3 (نیاسین)",
    "ویتامین B5 (پانتوتنیک اسید)",
    "ویتامین B6 (پیریدوکسین)",
    "ویتامین B7 (بیوتین)",
    "ویتامین B9 (فولیک اسید)",
    "ویتامین B12 (سیانوکوبالامین)",
    "ویتامین C (اسکوربیک اسید)",
    "ویتامین D",
    "ویتامین D3 (کولکلسیفرول)",
    "ویتامین E (توکوفرول)",
    "ویتامین K",
    "ویتامین K2 (مناکینون)",
    "کلسیم (Calcium)",
    "منیزیم (Magnesium)",
    "روی (Zinc)",
    "آهن (Iron)",
    "ید (Iodine)",
    "سلنیوم (Selenium)",
    "مس (Copper)",
    "منگنز (Manganese)",
    "کروم (Chromium)",
    "مولیبدن (Molybdenum)",

    // هورمون‌ها و تنظیم‌کننده‌ها
    "ZMA (روی، منیزیم، ویتامین B6)",
    "DHEA",
    "ترستوسترون بوستر (Testosterone Booster)",
    "PCT (Post Cycle Therapy)",
    "آرام‌بخش خواب (Sleep Aid)",
    "مک (Melatonin)",
    "والرین (Valerian Root)",
    "5-HTP",
    "L-تریپتوفان (L-Tryptophan)",
    "گابا (GABA)",
    "آشواگاندا (Ashwagandha)",
    "روتین سانتیلا (Rhodiola Rosea)",
    "جینسنگ (Ginseng)",
    "ماکا (Maca)",
    "DMAE",

    // آنتی‌اکسیدان‌ها و پشتیبانی ایمنی
    "آنتی‌اکسیدان کمپلکس",
    "کوآنزیم Q10 (CoQ10)",
    "آلفا لیپوئیک اسید (ALA)",
    "NAC (N-Acetyl Cysteine)",
    "گلوتیون (Glutathione)",
    "ویتامین C با بایوفلاونوئید",
    "اکیناسه (Echinacea)",
    "زینک لوکونات (Zinc Lozenges)",
    "پروپولیس (Propolis)",
    "عسل مانوکا (Manuka Honey)",

    // دیگر موارد
    "پروبیوتیک (Probiotic)",
    "فیبر (Fiber)",
    "فیبر محلول (Soluble Fiber)",
    "فیبر نامحلول (Insoluble Fiber)",
    "دیژستیو انزیم (Digestive Enzyme)",
    "بتاکاروتن (Beta-Carotene)",
    "لیکوپن (Lycopene)",
    "لوتئین (Lutein)",
    "زاکسانتین (Zeaxanthin)",
    "آستاکسانتین (Astaxanthin)",
    "رزبری کتون (Raspberry Ketone)",
    "گارسینیا کامبوجیا (Garcinia Cambogia)",
    "چای سبز (Green Tea)",
    "چای سیاه (Black Tea)",
    "چای سفید (White Tea)",
    "چای اولانگ (Oolong Tea)",
    "چای روئیبوش (Rooibos Tea)"
  ] }, []);

  const handleAdd = () => {
    if (!canEdit) {
      toast.error('دسترسی مربی لازم است');
      return;
    }
    if (!formData.name) {
      toast.error('نام مکمل را انتخاب کنید');
      return;
    }
    const newUser = { ...activeUser };
    if (!newUser.plans.supps) newUser.plans.supps = [];
    newUser.plans.supps.push({ ...formData });
    onUpdateUser(newUser);
    setFormData({ name: '', dose: '', time: '', note: '' });
  };

  const handleDelete = (index) => {
    if (!canEdit) {
      toast.error('دسترسی مربی لازم است');
      return;
    }
    const newUser = { ...activeUser };
    newUser.plans.supps.splice(index, 1);
    onUpdateUser(newUser);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* فرم افزودن */}
      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="font-bold text-lg text-[var(--text-primary)] border-b border-[var(--glass-border)] pb-4 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
            تجویز مکمل و دارو
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
                <label htmlFor="supplement-name" className="text-xs text-slate-400 mb-1 block font-semibold">نام مکمل *</label>
                <div className="flex gap-2">
                    <select 
                        id="supplement-name"
                        className="input-glass font-bold flex-1" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        aria-required="true"
                        aria-label="انتخاب نام مکمل"
                    >
                        <option value="">انتخاب کنید...</option>
                        {supplementsData.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button
                      onClick={async () => {
                        const { value: custom } = await Swal.fire({
                          title: 'نام مکمل جدید',
                          input: 'text',
                          inputPlaceholder: 'نام مکمل را وارد کنید...',
                          showCancelButton: true,
                          confirmButtonText: 'افزودن',
                          cancelButtonText: 'لغو',
                          background: theme === 'dark' ? '#1e293b' : '#fff',
                          color: theme === 'dark' ? '#fff' : '#000',
                          inputValidator: (value) => {
                            if (!value) {
                              return 'نام مکمل الزامی است';
                            }
                          }
                        });
                        if (custom) setFormData({ ...formData, name: custom });
                      }}
                      className="btn-glass bg-white/10 hover:bg-white/20 text-white px-3"
                      title="افزودن مکمل سفارشی"
                      aria-label="افزودن مکمل سفارشی"
                      type="button"
                    >
                      +
                    </button>
                </div>
            </div>
            <div>
                <label htmlFor="supplement-time" className="text-xs text-slate-400 mb-1 block font-semibold">زمان مصرف</label>
                <select 
                    id="supplement-time"
                    className="input-glass" 
                    value={formData.time} 
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    aria-label="انتخاب زمان مصرف مکمل"
                >
                    <option value="">انتخاب...</option>
                    <option>ناشتا</option><option>همراه صبحانه</option><option>قبل تمرین</option>
                    <option>حین تمرین</option><option>بعد تمرین</option><option>قبل خواب</option>
                </select>
            </div>
            <div>
                <label htmlFor="supplement-dose" className="text-xs text-slate-400 mb-1 block font-semibold">دوز مصرفی</label>
                <input 
                    id="supplement-dose"
                    type="text"
                    className="input-glass" 
                    placeholder="مثال: ۱ اسکوپ / ۵ گرم"
                    value={formData.dose}
                    onChange={e => setFormData({...formData, dose: e.target.value})}
                    aria-label="دوز مصرفی مکمل"
                    autoComplete="off"
                />
            </div>
        </div>
        <div>
            <label htmlFor="supplement-note" className="text-xs text-slate-400 mb-1 block font-semibold">توضیحات تکمیلی</label>
            <input 
                id="supplement-note"
                type="text"
                className="input-glass mb-4 w-full" 
                placeholder="توضیحات تکمیلی (نحوه ترکیب و...)"
                value={formData.note}
                onChange={e => setFormData({...formData, note: e.target.value})}
                aria-label="توضیحات تکمیلی مکمل"
                autoComplete="off"
            />
        </div>
        <button
          onClick={handleAdd}
          disabled={!canEdit}
          className={`w-full btn-glass bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20 font-bold py-3 ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="افزودن مکمل به برنامه"
          aria-disabled={!canEdit}
          type="button"
        >
            + ثبت در نسخه
        </button>
      </div>

      {/* لیست مکمل‌ها */}
      <div className="glass-panel rounded-3xl overflow-hidden min-h-[300px]">
        <table className="w-full text-right text-sm">
            <thead className="bg-[var(--text-primary)]/5 text-[var(--text-secondary)] text-xs uppercase font-semibold">
                <tr>
                    <th className="p-5">نام مکمل</th>
                    <th className="p-5">دوز</th>
                    <th className="p-5">زمان</th>
                    <th className="p-5">توضیحات</th>
                    <th className="p-5 w-10"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
                {activeUser.plans.supps && activeUser.plans.supps.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[var(--text-primary)]/5 transition-colors">
                        <td className="p-5 font-bold text-[var(--text-primary)]">{item.name}</td>
                        <td className="p-5 text-[var(--text-secondary)]">{item.dose}</td>
                        <td className="p-5 text-purple-400 dark:text-purple-300">{item.time}</td>
                        <td className="p-5 text-xs text-[var(--text-secondary)]">{item.note}</td>
                        <td className="p-5 text-center">
                            <button
                              onClick={() => handleDelete(idx)}
                              disabled={!canEdit}
                              className={`text-red-400 hover:text-red-500 transition ${!canEdit ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                              ✕
                            </button>
                        </td>
                    </tr>
                ))}
                {(!activeUser.plans.supps || activeUser.plans.supps.length === 0) && (
                    <tr><td colSpan={5} className="p-10 text-center text-[var(--text-secondary)] opacity-60">هنوز مکملی تجویز نشده است.</td></tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplementsPanel;