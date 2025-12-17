import React, { useState, useEffect, useMemo, memo } from 'react';
import { ShoppingBag, GripVertical, Trash2, Search, Copy, Plus, Dumbbell, Moon, UtensilsCrossed } from 'lucide-react';
import type { DietItem } from '../types/index';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { User } from '../types/index';
import { useApp } from '../context/AppContext';
import EmptyState from './EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import { DragEndEvent } from '@dnd-kit/core';
import { useFoods } from '../hooks/useExercises';

interface SortableFoodRowProps {
  item: DietItem;
  idx: number;
  onDelete: (idx: number) => void;
  canEdit: boolean;
}

const SortableFoodRow: React.FC<SortableFoodRowProps> = memo(({ item, idx: _idx, onDelete, canEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `food-${String(_idx)}` });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-[var(--text-primary)]/8 group transition-all duration-500">
      <td className="p-2 text-center">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-[var(--text-primary)]/10 rounded transition-all duration-500">
          <GripVertical size={16} className="text-[var(--text-secondary)] transition-colors duration-500" />
        </button>
      </td>
      <td className="p-4">
        <span className={`text-xs px-2 py-1 rounded-lg font-bold ${
          item.meal === 'صبحانه' ? 'bg-yellow-500/20 text-yellow-600' :
          item.meal === 'ناهار' ? 'bg-amber-500/20 text-amber-600' :
          item.meal === 'شام' ? 'bg-purple-500/20 text-purple-600' :
          'bg-[var(--accent-color)]/20 text-[var(--accent-color)]'
        }`}>
          {item.meal}
        </span>
      </td>
      <td className="p-4 font-bold text-[var(--text-primary)]">{item.name}</td>
      <td className="p-4 text-center text-[var(--text-secondary)]">{item.amount} {item.unit}</td>
      <td className="p-4 text-center font-bold text-emerald-500">{item.c}</td>
      <td className="p-4 text-center text-xs text-[var(--text-secondary)]">
        <span className="text-[var(--accent-color)]">{item.p}p</span> / 
        <span className="text-yellow-500"> {item.ch}c</span> / 
        <span className="text-red-500"> {item.f}f</span>
      </td>
      <td className="p-4 text-center">
        <button
          onClick={() => onDelete(_idx)}
          disabled={!canEdit}
          className={`text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-500/10 rounded ${!canEdit ? 'opacity-40 !cursor-not-allowed hover:text-red-400' : ''}`}
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
});

interface DietPanelProps {
  activeUser: User;
  onUpdateUser: (_user: User) => void;
}

const DietPanel: React.FC<DietPanelProps> = ({ activeUser, onUpdateUser }) => {
  const { hasPermission } = useApp();
  const canEdit = hasPermission('editProgram', activeUser.id);
  const [dayType, setDayType] = useState('training'); // 'training' یا 'rest'
  const [meal, setMeal] = useState('صبحانه');
  const [category, setCategory] = useState('');
  const [foodName, setFoodName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('-');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [customFood, setCustomFood] = useState({ name: '', cal: '', protein: '', carb: '', fat: '', unit: 'گرم', base: 100 });

  // بارگذاری داده‌های غذایی از Supabase
  const { data: foodsData } = useFoods();

  // سازماندهی داده‌ها بر اساس ساختار قدیمی برای سازگاری
  const foodData = useMemo(() => {
    if (!foodsData) return null;

    const grouped: Record<string, Record<string, any>> = {};

    foodsData.forEach(food => {
      if (!grouped[food.category]) {
        grouped[food.category] = {};
      }
      grouped[food.category][food.name] = {
        unit: food.unit,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        fiber: food.fiber,
        sugar: food.sugar,
        sodium: food.sodium
      };
    });

    return grouped;
  }, [foodsData]);

  const foodsList = useMemo(() => {
    if (!category || !foodData || !foodData[category]) return [];
    return Object.keys(foodData[category]);
  }, [category, foodData]);

  // سنسورها برای drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    setFoodName('');
    setUnit('-');
    setSearchTerm('');
  }, [category, foodData]);

  // استفاده از useMemo برای محاسبه unit
  const unitMemo = useMemo(() => {
    if (category && foodName && foodData[category] && foodData[category][foodName]) {
      return foodData[category][foodName].u;
    }
    return '-';
  }, [category, foodName, foodData]);
  
  useEffect(() => {
    setUnit(unitMemo);
  }, [unitMemo]);

  // فیلتر غذاها با جستجو
  const filteredFoods = debouncedSearch 
    ? foodsList.filter(f => f.toLowerCase().includes(debouncedSearch.toLowerCase()))
    : foodsList;

  // دریافت کلید برنامه غذایی بر اساس نوع روز
  const getDietKey = () => dayType === 'training' ? 'diet' : 'dietRest';

  // هندلر جابجایی
  const handleDragEnd = (event: DragEndEvent) => {
    if (!canEdit) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id.split('-')[1]) || 0;
    const newIndex = parseInt(over.id.split('-')[1]) || 0;
    if (isNaN(oldIndex) || isNaN(newIndex)) return;

    const dietKey = getDietKey();
    const newUser = { ...activeUser };
    if (!newUser.plans[dietKey]) newUser.plans[dietKey] = [];
    if (oldIndex < 0 || oldIndex >= newUser.plans[dietKey].length) return;
    if (newIndex < 0 || newIndex >= newUser.plans[dietKey].length) return;
    newUser.plans[dietKey] = arrayMove(newUser.plans[dietKey], oldIndex, newIndex);
    onUpdateUser(newUser);
  };

  const handleDeleteFood = (idx) => {
    if (!canEdit) {
      toast.error('دسترسی مربی لازم است');
      return;
    }
    const dietKey = getDietKey();
    const u = { ...activeUser };
    if (!u.plans[dietKey]) return;
    u.plans[dietKey].splice(idx, 1);
    onUpdateUser(u);
  };

  const handleAddFood = () => {
    if (!canEdit) {
      toast.error('دسترسی مربی لازم است');
      return;
    }
    
    // Validation کامل
    if (!foodName || !foodName.trim()) {
      toast.error('لطفا غذا را انتخاب کنید');
      return;
    }
    
    if (!amount || !amount.trim()) {
      toast.error('لطفا مقدار را وارد کنید');
      return;
    }
    
    if (!foodData || !category || !foodData[category] || !foodData[category][foodName]) {
      toast.error('داده‌های غذایی در حال بارگذاری است یا غذا انتخاب نشده است');
      return;
    }

    const info = foodData[category][foodName];
    if (!info) {
      toast.error('اطلاعات غذا یافت نشد');
      return;
    }
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('مقدار باید عدد مثبت باشد');
      return;
    }
    
    if (amountNum > 10000) {
      toast.error('مقدار وارد شده خیلی بزرگ است (حداکثر 10000)');
      return;
    }
    
    if (!info.b || info.b === 0) {
      toast.error('اطلاعات غذا نامعتبر است (مقدار پایه صفر است)');
      return;
    }
    
    // جلوگیری از تقسیم بر صفر و مقادیر نامعتبر
    if (isNaN(info.c) || isNaN(info.p) || isNaN(info.ch) || isNaN(info.f)) {
      toast.error('اطلاعات غذایی نامعتبر است');
      return;
    }
    
    const ratio = amountNum / info.b;
    if (isNaN(ratio) || !isFinite(ratio)) {
      toast.error('خطا در محاسبه نسبت');
      return;
    }
    
    const newItem = {
      meal, 
      name: foodName.trim(), 
      amount: amountNum, 
      unit: info.u || 'گرم',
      c: Math.round(info.c * ratio), 
      p: Math.round(info.p * ratio),
      ch: Math.round(info.ch * ratio), 
      f: Math.round(info.f * ratio)
    };
    
    // Validation نهایی برای مقادیر محاسبه شده
    if (newItem.c < 0 || newItem.p < 0 || newItem.ch < 0 || newItem.f < 0) {
      toast.error('خطا در محاسبه ماکروها');
      return;
    }
    
    const dietKey = getDietKey();
    const newUser = { ...activeUser };
    if (!newUser.plans[dietKey]) newUser.plans[dietKey] = [];
    newUser.plans[dietKey].push(newItem);
    onUpdateUser(newUser);
    setAmount('');
    toast.success('اضافه شد');
  };

  const handleAddCustomFood = () => {
    if (!canEdit) {
      toast.error('دسترسی مربی لازم است');
      return;
    }
    
    // Validation کامل
    if (!customFood.name || !customFood.name.trim()) {
      toast.error('نام غذا الزامی است');
      return;
    }
    
    if (customFood.name.trim().length > 100) {
      toast.error('نام غذا نمی‌تواند بیشتر از 100 کاراکتر باشد');
      return;
    }
    
    if (!customFood.cal || !customFood.cal.trim()) {
      toast.error('کالری الزامی است');
      return;
    }
    
    const calNum = parseInt(customFood.cal);
    if (isNaN(calNum) || calNum < 0) {
      toast.error('کالری باید عدد معتبر باشد');
      return;
    }
    
    if (calNum > 10000) {
      toast.error('کالری وارد شده خیلی بزرگ است');
      return;
    }
    
    const baseNum = parseInt(String(customFood.base)) || 100;
    if (baseNum <= 0 || baseNum > 10000) {
      toast.error('مقدار پایه باید بین 1 تا 10000 باشد');
      return;
    }
    
    const proteinNum = parseInt(customFood.protein) || 0;
    const carbNum = parseInt(customFood.carb) || 0;
    const fatNum = parseInt(customFood.fat) || 0;
    
    if (proteinNum < 0 || carbNum < 0 || fatNum < 0) {
      toast.error('ماکروها نمی‌توانند منفی باشند');
      return;
    }
    
    // بررسی منطقی بودن کالری (حدود 4 کالری برای پروتئین و کربوهیدرات، 9 برای چربی)
    const calculatedCal = (proteinNum * 4) + (carbNum * 4) + (fatNum * 9);
    if (Math.abs(calculatedCal - calNum) > calNum * 0.2) {
      // اگر اختلاف بیشتر از 20% باشد، هشدار بده (اما اجازه بده)
      toast('هشدار: کالری محاسبه شده با ماکروها مطابقت ندارد', { icon: '⚠️' });
    }
    
    const newItem = {
      meal,
      name: customFood.name.trim(),
      amount: baseNum,
      unit: customFood.unit || 'گرم',
      c: calNum,
      p: proteinNum,
      ch: carbNum,
      f: fatNum
    };
    const dietKey = getDietKey();
    const newUser = { ...activeUser };
    if (!newUser.plans[dietKey]) newUser.plans[dietKey] = [];
    newUser.plans[dietKey].push(newItem);
    onUpdateUser(newUser);
    setCustomFood({ name: '', cal: '', protein: '', carb: '', fat: '', unit: 'گرم', base: 100 });
    toast.success('غذای سفارشی اضافه شد');
  };

  const generateShoppingList = () => {
      const items = {};
    const trainingDays = Number(activeUser.days ?? 3) || 3;
    const restDays = Math.max(0, 7 - trainingDays);

    // غذاهای روز تمرینی
      (activeUser.plans.diet || []).forEach(i => {
      const key = `${i.name} (${i.unit})`;
      items[key] = (items[key] || 0) + (i.amount * trainingDays);
    });

    // غذاهای روز استراحت
    (activeUser.plans.dietRest || []).forEach(i => {
      const key = `${i.name} (${i.unit})`;
      items[key] = (items[key] || 0) + (i.amount * restDays);
      });

      if (Object.keys(items).length === 0) {
        toast.error('آیتمی در رژیم برای ساخت لیست خرید وجود ندارد');
        return;
      }

    const lines = Object.keys(items).map(k => `• ${k}: ${Math.round(items[k])}`);

      Swal.fire({
      title: '🛒 لیست خرید هفتگی',
      html: `<div style="text-align:right;direction:rtl;font-size:13px;max-height:400px;overflow-y:auto">
        <p style="font-size:11px;color:#888;margin-bottom:10px;">محاسبه شده برای ${trainingDays} روز تمرینی و ${restDays} روز استراحت</p>
        ${lines.join('<br/>')}
      </div>`,
        icon: 'info',
        confirmButtonText: 'متوجه شدم'
      });
  };

  const copyMealToOtherDay = async () => {
    if (!canEdit) {
      toast.error('دسترسی مربی لازم است');
      return;
    }
    const { value: targetMeal } = await Swal.fire({
      title: 'کپی به کدام وعده؟',
      input: 'select',
      inputOptions: {
        'صبحانه': 'صبحانه',
        'میان وعده ۱': 'میان وعده ۱',
        'ناهار': 'ناهار',
        'میان وعده ۲': 'میان وعده ۲',
        'شام': 'شام',
        'میان وعده ۳': 'میان وعده ۳'
      },
      showCancelButton: true,
      confirmButtonText: 'کپی',
      cancelButtonText: 'لغو'
    });

    if (targetMeal) {
      const dietKey = getDietKey();
      const currentItems = (activeUser.plans[dietKey] || []).filter(i => i.meal === meal);
      if (currentItems.length === 0) {
        toast.error('این وعده خالی است');
        return;
      }
      const newItems = currentItems.map(i => ({ ...i, meal: targetMeal }));
      const newUser = { ...activeUser };
      newUser.plans[dietKey] = [...(newUser.plans[dietKey] || []), ...newItems];
      onUpdateUser(newUser);
      toast.success(`${currentItems.length} آیتم به ${targetMeal} کپی شد`);
    }
  };

  // کپی برنامه روز تمرینی به روز استراحت یا برعکس
  const copyToOtherDayType = async () => {
    if (!canEdit) {
      toast.error('دسترسی مربی لازم است');
      return;
    }
    const fromKey = getDietKey();
    const toKey = dayType === 'training' ? 'dietRest' : 'diet';
    const fromLabel = dayType === 'training' ? 'روز تمرینی' : 'روز استراحت';
    const toLabel = dayType === 'training' ? 'روز استراحت' : 'روز تمرینی';

    const result = await Swal.fire({
      title: `کپی به ${toLabel}؟`,
      text: `برنامه ${fromLabel} به ${toLabel} کپی می‌شود`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'کپی کن',
      cancelButtonText: 'لغو'
    });

    if (result.isConfirmed) {
      const newUser = { ...activeUser };
      newUser.plans[toKey] = [...(activeUser.plans[fromKey] || [])];
      onUpdateUser(newUser);
      toast.success(`برنامه به ${toLabel} کپی شد`);
    }
  };

  // محاسبه مجموع برای نوع روز فعلی
  const dietKey = getDietKey();
  const currentDietItems = activeUser.plans[dietKey] || [];
  
  const total = currentDietItems.reduce(
    (acc, i) => ({ c: acc.c + i.c, p: acc.p + i.p, ch: acc.ch + i.ch, f: acc.f + i.f }),
    { c: 0, p: 0, ch: 0, f: 0 }
  );

  // محاسبات علمی پیشرفته (با در نظر گرفتن نوع روز)
  const calcNutritionTargets = () => {
    const w = parseFloat(String(activeUser.weight ?? '')) || 0;
    const h = parseFloat(String(activeUser.height ?? '')) || 0;
    const a = parseFloat(String(activeUser.age ?? '')) || 0;
    if (!w || !h || !a) return { bmr: 0, tdee: 0, targetCalories: 0, protein: 0, carbs: 0, fat: 0 };
    
    const isMale = activeUser.gender !== 'female';
    const activityFactor = parseFloat(String(activeUser.activity ?? '')) || 1.55;
    const trainingDays = Number(activeUser.days ?? 3) || 3;
    const goal = activeUser.nutritionGoals || 'maintenance';
    const bodyFatInput = parseFloat(String(activeUser.bodyFat ?? '')) || 0;
    const isRestDay = dayType === 'rest';

    // BMR - فرمول‌های به‌روز و دقیق (2024)
    // Validation: اطمینان از مقادیر معتبر
    if (w <= 0 || h <= 0 || a <= 0 || w > 500 || h > 300 || a > 150) {
      return { bmr: 0, tdee: 0, targetCalories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    
    // 1. Mifflin-St Jeor (استاندارد طلایی 2024)
    const mifflin = 10 * w + 6.25 * h - 5 * a + (isMale ? 5 : -161);
    
    // 2. Harris-Benedict (اصلاح شده 1984)
    const harrisBenedict = isMale 
      ? 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)
      : 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    
    // Validation: اطمینان از مقادیر BMR معتبر
    if (isNaN(mifflin) || mifflin <= 0 || isNaN(harrisBenedict) || harrisBenedict <= 0) {
      return { bmr: 0, tdee: 0, targetCalories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    
    // 3. Katch-McArdle (برای افراد با درصد چربی مشخص)
    let katch = 0;
    if (bodyFatInput > 0 && bodyFatInput < 100 && !isNaN(bodyFatInput)) {
      const leanMass = w * (1 - bodyFatInput / 100);
      if (leanMass > 0 && !isNaN(leanMass)) {
        katch = 370 + (21.6 * leanMass);
        if (isNaN(katch) || katch <= 0) katch = 0;
      }
    }
    
    // 4. Cunningham (برای ورزشکاران)
    let cunningham = 0;
    if (bodyFatInput > 0 && bodyFatInput < 100 && !isNaN(bodyFatInput)) {
      const leanMass = w * (1 - bodyFatInput / 100);
      if (leanMass > 0 && !isNaN(leanMass)) {
        cunningham = 500 + (22 * leanMass);
        if (isNaN(cunningham) || cunningham <= 0) cunningham = 0;
      }
    }
    
    // میانگین‌گیری هوشمند
    const bmr = (katch > 0 && cunningham > 0)
      ? Math.max(0, Math.round((mifflin * 0.25 + harrisBenedict * 0.15 + katch * 0.40 + cunningham * 0.20)))
      : (katch > 0)
      ? Math.max(0, Math.round((mifflin * 0.35 + harrisBenedict * 0.25 + katch * 0.40)))
      : Math.max(0, Math.round((mifflin * 0.60 + harrisBenedict * 0.40)));
    
    // Validation: اطمینان از BMR معتبر
    if (bmr <= 0 || isNaN(bmr)) {
      return { bmr: 0, tdee: 0, targetCalories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    // تعدیل ضریب فعالیت بر اساس تعداد روزهای تمرین و نوع روز
    // Validation: اطمینان از activityFactor معتبر
    let validActivityFactor = activityFactor;
    if (isNaN(activityFactor) || activityFactor < 1.2 || activityFactor > 2.5) {
      validActivityFactor = 1.55; // مقدار پیش‌فرض
    }
    
    let baseActivityFactor = validActivityFactor;
    if (trainingDays >= 6) baseActivityFactor = Math.max(validActivityFactor, 1.725);
    else if (trainingDays >= 4) baseActivityFactor = Math.max(validActivityFactor, 1.55);
    else if (trainingDays >= 2) baseActivityFactor = Math.max(validActivityFactor, 1.375);
    else baseActivityFactor = Math.max(validActivityFactor, 1.2);
    
    // Validation: اطمینان از baseActivityFactor معتبر
    if (isNaN(baseActivityFactor) || baseActivityFactor < 1.2 || baseActivityFactor > 2.5) {
      baseActivityFactor = 1.55;
    }
    
    // TDEE پایه (بدون در نظر گرفتن هدف) - برای محاسبات استفاده می‌شود
    const _baseTDEE = Math.max(0, Math.round(bmr * baseActivityFactor));
    
    // تعدیل TDEE بر اساس هدف ورزشکار و نوع روز
    let adjustedFactor = baseActivityFactor;
    if (isRestDay) {
      // در روز استراحت، ضریب فعالیت کمتر است (حدود 20-30% کاهش)
      adjustedFactor = Math.max(1.2, baseActivityFactor * 0.75);
    } else {
      // در روز تمرینی، بر اساس هدف ورزشکار ضریب را تنظیم می‌کنیم
      switch (goal) {
        case 'weight-loss':
          // برای کاهش وزن، TDEE کمی کمتر (کاهش 5-10%)
          adjustedFactor = Math.max(1.2, baseActivityFactor * 0.92);
          break;
        case 'muscle-gain':
          // برای عضله‌سازی، TDEE بیشتر (افزایش 8-12%)
          adjustedFactor = Math.min(2.5, baseActivityFactor * 1.10);
          break;
        case 'weight-gain':
          // برای افزایش وزن، TDEE بیشتر (افزایش 10-15%)
          adjustedFactor = Math.min(2.5, baseActivityFactor * 1.12);
          break;
        case 'recomp':
          // برای ریکامپ، TDEE نزدیک به پایه (کاهش 2-5%)
          adjustedFactor = Math.max(1.2, baseActivityFactor * 0.97);
          break;
        default:
          // maintenance: TDEE پایه
          adjustedFactor = baseActivityFactor;
      }
    }
    
    // Validation: اطمینان از adjustedFactor معتبر
    if (isNaN(adjustedFactor) || adjustedFactor < 1.2 || adjustedFactor > 2.5) {
      adjustedFactor = baseActivityFactor;
    }

    const tdee = Math.max(0, Math.round(bmr * adjustedFactor));
    
    // Validation: اطمینان از TDEE معتبر
    if (tdee <= 0 || isNaN(tdee)) {
      return { bmr, tdee: 0, targetCalories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    // کالری هدف - در روز استراحت معمولاً کمتر
    let targetCalories = tdee;
    switch (goal) {
      case 'weight-loss': 
        targetCalories = Math.max(bmr, tdee - (isRestDay ? 400 : 500)); 
        break;
      case 'weight-gain': 
        targetCalories = tdee + (isRestDay ? 200 : 400); 
        break;
      case 'muscle-gain': 
        targetCalories = tdee + (isRestDay ? 100 : 300); 
        break;
      case 'recomp':
        targetCalories = isRestDay ? Math.max(bmr, tdee - 200) : tdee;
        break;
      default: 
        targetCalories = tdee;
    }

    // ماکروها - فرمول‌های به‌روز (تحقیقات 2024)
    // در روز استراحت: کربوهیدرات کمتر، چربی بیشتر برای ریکاوری
    let protein, carbs, fat;
    
    // Validation: اطمینان از مقادیر معتبر
    if (targetCalories <= 0 || w <= 0) {
      return { bmr, tdee, targetCalories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    
    // محاسبه توده بدون چربی برای تنظیمات دقیق‌تر
    const leanBodyMass = bodyFatInput > 0 ? w * (1 - bodyFatInput / 100) : w * 0.85;
    
    if (isRestDay) {
      // روز استراحت: پروتئین حفظ (2.0-2.2g/kg)، کربوهیدرات کم (15-20% کالری)، چربی بیشتر (35-40% کالری)
      protein = Math.max(0, Math.round(Math.max(w * 2.1, leanBodyMass * 2.6)));
      fat = Math.max(0, Math.round(targetCalories * 0.37 / 9)); // چربی بیشتر برای ریکاوری
      const remainingCalories = targetCalories - (protein * 4) - (fat * 9);
      carbs = Math.max(0, Math.round(remainingCalories / 4));
    } else {
      // روز تمرینی - فرمول‌های به‌روز (2024)
      switch (goal) {
        case 'weight-loss': {
          // پروتئین: 2.4-2.6g/kg (یا 3.1-3.3g/kg توده بدون چربی) برای حفظ عضله
          protein = Math.max(0, Math.round(Math.max(w * 2.5, leanBodyMass * 3.2)));
          // چربی: 25-30% کالری (حداقل 0.6g/kg)
          const minFat = Math.max(0, Math.round(w * 0.6));
          fat = Math.max(minFat, Math.round(targetCalories * 0.27 / 9));
          // کربوهیدرات: باقیمانده (کم برای کاهش وزن)
          const remainingCaloriesWL = targetCalories - (protein * 4) - (fat * 9);
          carbs = Math.max(0, Math.round(remainingCaloriesWL / 4));
          break;
        }
        case 'muscle-gain': {
          // پروتئین: 2.1-2.3g/kg (یا 2.6-2.8g/kg توده بدون چربی)
          protein = Math.max(0, Math.round(Math.max(w * 2.2, leanBodyMass * 2.7)));
          // چربی: 25-30% کالری (برای هورمون‌های آنابولیک)
          fat = Math.max(0, Math.round(targetCalories * 0.28 / 9));
          // کربوهیدرات: باقیمانده (بالا برای انرژی و ریکاوری)
          const remainingCaloriesMG = targetCalories - (protein * 4) - (fat * 9);
          carbs = Math.max(0, Math.round(remainingCaloriesMG / 4));
          break;
        }
        case 'weight-gain': {
          // پروتئین: 1.6-1.8g/kg (برای افزایش وزن سالم)
          protein = Math.max(0, Math.round(w * 1.7));
          // چربی: 30-35% کالری (کالری متراکم)
          fat = Math.max(0, Math.round(targetCalories * 0.32 / 9));
          // کربوهیدرات: باقیمانده (بالا برای افزایش وزن)
          const remainingCaloriesWG = targetCalories - (protein * 4) - (fat * 9);
          carbs = Math.max(0, Math.round(remainingCaloriesWG / 4));
          break;
        }
        case 'recomp': {
          // پروتئین: 2.7-3.0g/kg (یا 3.4-3.7g/kg توده بدون چربی) - خیلی بالا برای ریکامپ
          protein = Math.max(0, Math.round(Math.max(w * 2.8, leanBodyMass * 3.5)));
          // چربی: 30-35% کالری (برای سلامت هورمونی)
          fat = Math.max(0, Math.round(targetCalories * 0.32 / 9));
          // کربوهیدرات: باقیمانده (متوسط برای ریکامپ)
          const remainingCaloriesRC = targetCalories - (protein * 4) - (fat * 9);
          carbs = Math.max(0, Math.round(remainingCaloriesRC / 4));
          break;
        }
        default: { // maintenance
          // پروتئین: 1.9-2.0g/kg (برای حفظ عضله)
          protein = Math.max(0, Math.round(w * 1.95));
          // چربی: 28-32% کالری (تعادل)
          fat = Math.max(0, Math.round(targetCalories * 0.30 / 9));
          // کربوهیدرات: باقیمانده
          const remainingCaloriesDef = targetCalories - (protein * 4) - (fat * 9);
          carbs = Math.max(0, Math.round(remainingCaloriesDef / 4));
        }
      }
    }
    
    // Validation نهایی: اطمینان از اینکه مجموع کالری‌ها منطقی است
    const calculatedCalories = (protein * 4) + (carbs * 4) + (fat * 9);
    if (Math.abs(calculatedCalories - targetCalories) > targetCalories * 0.1) {
      // اگر اختلاف بیشتر از 10% باشد، ماکروها را تنظیم کن
      const adjustment = targetCalories / calculatedCalories;
      protein = Math.max(0, Math.round(protein * adjustment));
      carbs = Math.max(0, Math.round(carbs * adjustment));
      fat = Math.max(0, Math.round(fat * adjustment));
    }

    return { bmr, tdee, targetCalories, protein, carbs, fat };
  };

  const { bmr, tdee, targetCalories, protein: targetP, carbs: targetC, fat: targetF } = calcNutritionTargets();

  const dietItems = currentDietItems;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* انتخاب نوع روز */}
      <div className="glass-panel p-4 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setDayType('training')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                dayType === 'training' 
                  ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg shadow-emerald-500/30' 
                  : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-emerald-500/10'
              }`}
            >
              <Dumbbell size={18} />
              روز تمرینی
              {(activeUser.plans.diet || []).length > 0 && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{(activeUser.plans.diet || []).length}</span>
              )}
            </button>
            <button
              onClick={() => setDayType('rest')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                dayType === 'rest' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-500/30' 
                  : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-purple-500/10'
              }`}
            >
              <Moon size={18} />
              روز استراحت
              {(activeUser.plans.dietRest || []).length > 0 && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{(activeUser.plans.dietRest || []).length}</span>
              )}
            </button>
          </div>
          <button
            onClick={copyToOtherDayType}
            className="btn-glass bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-xs border border-[var(--accent-color)]/20"
          >
            <Copy size={14} />
            کپی به {dayType === 'training' ? 'روز استراحت' : 'روز تمرینی'}
          </button>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-3">
          {dayType === 'training' 
            ? '💪 روز تمرینی: کالری و کربوهیدرات بیشتر برای انرژی و ریکاوری' 
            : '😴 روز استراحت: کالری کمتر، کربوهیدرات پایین‌تر، چربی متوسط'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* کارت آمار پیشرفته */}
        <div className={`glass-panel p-6 rounded-3xl relative overflow-hidden text-white ${
          dayType === 'training' 
            ? 'bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-900 border-emerald-500/20' 
            : 'bg-gradient-to-br from-purple-900 via-slate-900 to-slate-900 border-purple-500/20'
        }`}>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                    <div>
                <div className={`text-xs uppercase font-bold mb-1 ${dayType === 'training' ? 'text-emerald-300' : 'text-purple-300'}`}>
                  🎯 کالری هدف ({dayType === 'training' ? 'روز تمرین' : 'روز استراحت'})
                </div>
                <div className="text-4xl font-black text-white">{targetCalories}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  BMR: {bmr} | TDEE: {tdee}
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs text-indigo-300 uppercase font-bold mb-1">دریافتی</div>
                <div className={`text-3xl font-bold ${total.c > targetCalories ? 'text-red-400' : 'text-emerald-400'}`}>{total.c}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {total.c > targetCalories ? `+${total.c - targetCalories} اضافه` : `${targetCalories - total.c} باقی‌مانده`}
                </div>
              </div>
            </div>
            
            {/* نوار پیشرفت کالری */}
            <div className="mb-4">
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    total.c > targetCalories 
                      ? 'bg-red-500' 
                      : dayType === 'training' ? 'bg-emerald-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${Math.min((total.c / targetCalories) * 100, 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1 text-center">
                {targetCalories > 0 ? Math.round((total.c / targetCalories) * 100) : 0}% از هدف
              </div>
            </div>

            {/* ماکروها با نوار پیشرفت */}
            <div className="space-y-3">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-[var(--accent-color)]/80">پروتئین</span>
                  <span className="text-sm font-bold text-[var(--accent-color)]">{total.p}g / {targetP || 0}g</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--accent-color)] rounded-full transition-all" style={{ width: `${targetP > 0 ? Math.min((total.p / targetP) * 100, 100) : 0}%` }} />
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-yellow-300">کربوهیدرات</span>
                  <span className="text-sm font-bold text-yellow-400">{total.ch}g / {targetC || 0}g</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: `${targetC > 0 ? Math.min((total.ch / targetC) * 100, 100) : 0}%` }} />
                    </div>
                    </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-red-300">چربی</span>
                  <span className="text-sm font-bold text-red-400">{total.f}g / {targetF || 0}g</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${targetF > 0 ? Math.min((total.f / targetF) * 100, 100) : 0}%` }} />
                </div>
              </div>
                </div>
            </div>
        </div>

        {/* فرم افزودن */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl">
             <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-4 mb-4">
                 <h3 className="font-bold text-lg text-[var(--text-primary)]">مدیریت رژیم</h3>
            <div className="flex gap-2">
              <button onClick={copyMealToOtherDay} className="btn-glass bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs border border-purple-500/20">
                <Copy size={14} /> کپی وعده
              </button>
              <button onClick={generateShoppingList} className="btn-glass bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs border border-emerald-500/20">
                <ShoppingBag size={14} /> لیست خرید
              </button>
            </div>
             </div>

          {/* انتخاب از بانک غذایی */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <select className="input-glass font-bold" value={meal} onChange={e => setMeal(e.target.value)}>
                    <option>صبحانه</option>
                    <option>میان وعده ۱</option>
                    <option>ناهار</option>
                    <option>میان وعده ۲</option>
                    <option>شام</option>
                    <option>میان وعده ۳</option>
                </select>
            <select className="input-glass" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">دسته...</option>
              {foodData ? Object.keys(foodData).map(c => <option key={c} value={c}>{c}</option>) : <option disabled>در حال بارگذاری...</option>}
            </select>
            <div className="md:col-span-2">
              {foodsList.length > 15 && (
                <div className="relative mb-2">
                  <input
                    type="text"
                    className="input-glass pl-8 text-sm"
                    placeholder="جستجوی غذا..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <Search size={14} className="absolute left-3 top-3.5 text-slate-400" />
                </div>
              )}
              <select className="input-glass font-bold" value={foodName} onChange={e => setFoodName(e.target.value)}>
                <option value="">غذا...</option>
                {filteredFoods.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <input type="number" className="input-glass text-center font-bold" placeholder="مقدار" value={amount} onChange={e => setAmount(e.target.value)} />
              <span className="absolute left-3 top-3 text-xs text-slate-400">{unit}</span>
            </div>
            <button
              onClick={handleAddFood}
              disabled={!canEdit}
              className={`btn-glass text-white px-4 sm:px-6 ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={!canEdit ? {} : { background: `linear-gradient(135deg, var(--accent-color), var(--accent-secondary))` }}
            >
              <Plus size={16} /> افزودن
            </button>
          </div>

          {/* افزودن غذای سفارشی */}
          <div className="border-t border-[var(--glass-border)] pt-4">
            <div className="text-xs text-[var(--text-secondary)] mb-3 font-bold">➕ افزودن غذای سفارشی</div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              <input className="input-glass text-sm" placeholder="نام غذا" value={customFood.name} onChange={e => setCustomFood({ ...customFood, name: e.target.value })} />
              <input className="input-glass text-sm text-center" type="number" placeholder="کالری" value={customFood.cal} onChange={e => setCustomFood({ ...customFood, cal: e.target.value })} />
              <input className="input-glass text-sm text-center" type="number" placeholder="پروتئین" value={customFood.protein} onChange={e => setCustomFood({ ...customFood, protein: e.target.value })} />
              <input className="input-glass text-sm text-center" type="number" placeholder="کربو" value={customFood.carb} onChange={e => setCustomFood({ ...customFood, carb: e.target.value })} />
              <input className="input-glass text-sm text-center" type="number" placeholder="چربی" value={customFood.fat} onChange={e => setCustomFood({ ...customFood, fat: e.target.value })} />
              <button
                onClick={handleAddCustomFood}
                disabled={!canEdit}
                className={`btn-glass text-white text-sm ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={!canEdit ? {} : { background: `linear-gradient(135deg, var(--accent-color), var(--accent-secondary))` }}
              >
                ثبت
              </button>
             </div>
             </div>
        </div>
      </div>

      {/* جدول غذاها */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className={`px-4 py-3 border-b border-[var(--glass-border)] flex justify-between items-center ${
          dayType === 'training' ? 'bg-emerald-500/10' : 'bg-purple-500/10'
        }`}>
          <span className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            {dayType === 'training' ? <Dumbbell size={16} className="text-emerald-500" /> : <Moon size={16} className="text-purple-500" />}
            برنامه غذایی {dayType === 'training' ? 'روز تمرینی' : 'روز استراحت'}
          </span>
          <span className="text-xs text-[var(--text-secondary)]">{dietItems.length} آیتم</span>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {dietItems.length > 0 ? (
          <div className="overflow-x-auto -mx-2 sm:-mx-4 md:mx-0 px-2 sm:px-4 md:px-0">
            <table className="w-full text-right text-xs sm:text-sm min-w-[600px] sm:min-w-[700px]">
            <thead className="bg-[var(--text-primary)]/5 text-[var(--text-secondary)] text-xs border-b border-[var(--glass-border)]">
              <tr>
                <th className="p-2 w-10"></th>
                <th className="p-4 w-28">وعده</th>
                <th className="p-4">غذا</th>
                <th className="p-4 text-center w-24">مقدار</th>
                <th className="p-4 text-center w-20">کالری</th>
                <th className="p-4 text-center w-32">ماکرو</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              <SortableContext items={dietItems.map((_, idx) => `food-${idx}`)} strategy={verticalListSortingStrategy}>
                {dietItems.map((item, idx) => (
                  <SortableFoodRow key={`food-${idx}`} item={item} idx={idx} onDelete={handleDeleteFood} canEdit={canEdit} />
                ))}
              </SortableContext>
            </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<UtensilsCrossed size={32} className="text-[var(--accent-color)]" />}
            title="رژیم ثبت نشده است"
            description={`هنوز غذایی برای ${dayType === 'training' ? 'روز تمرینی' : 'روز استراحت'} اضافه نشده است. می‌توانید از فرم بالا غذا اضافه کنید.`}
          />
        )}
        </DndContext>
      </div>
    </div>
  );
};

export default DietPanel;
