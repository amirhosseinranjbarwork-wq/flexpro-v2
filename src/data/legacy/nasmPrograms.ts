// برنامه‌های تمرینی NASM بر اساس Corrective Exercise Continuum
// شامل 4 مرحله: Inhibit, Lengthen, Activate, Integrate

type PhaseKey = 'inhibit' | 'lengthen' | 'activate' | 'integrate';

export type NasmProgram = Record<PhaseKey, string[]>;

export const nasmPrograms: Record<string, NasmProgram> = {
    "کایفوز و سر به جلو (Kyphosis/Forward Head)": {
        inhibit: [
            "فوم رول سینه ای (Thoracic Foam Rolling)",
            "فوم رول گردن",
            "فوم رول شانه"
        ],
        lengthen: [
            "کشش سینه در چارچوب در (Doorway Stretch)",
            "کشش سینه با کش (Band Chest Stretch)",
            "کشش SCM/Levator Scapulae",
            "کشش گردن جانبی"
        ],
        activate: [
            "چانه به داخل (Chin Tuck)",
            "تقویت میان‌کتفی (Scapular Retraction)",
            "تقویت میان‌کتفی با کش",
            "تقویت عضلات عمقی گردن"
        ],
        integrate: [
            "حرکت YTWL روی زمین",
            "حرکت YTWL با کش",
            "وال انجل (Wall Angel)",
            "وال انجل با کش"
        ]
    },
    "لوردوز و گودی کمر (Lordosis)": {
        inhibit: [
            "فوم رول خم کننده های ران",
            "فوم رول QL",
            "فوم رول همسترینگ"
        ],
        lengthen: [
            "کشش خم کننده های ران (Hip Flexor Stretch)",
            "کشش خم کننده های ران با کش",
            "کشش QL",
            "کشش همسترینگ",
            "کشش همسترینگ با کش"
        ],
        activate: [
            "تقویت عضلات شکم (Core Strengthening)",
            "تقویت عضلات شکم با کش",
            "تقویت عضلات باسن",
            "تقویت عضلات باسن با کش",
            "ددباگ (Dead Bug)"
        ],
        integrate: [
            "پلانک با تیلت لگن (Plank with Pelvic Tilt)",
            "حرکت گربه-گاو (Cat-Cow)",
            "نیلینگ هیپ فلکسور"
        ]
    },
    "اسکولیوز (Scoliosis)": {
        inhibit: [
            "فوم رول یکطرفه قفسه سینه",
            "فوم رول یکطرفه کمر",
            "فوم رول IT Band"
        ],
        lengthen: [
            "کشش یکطرفه (Unilateral Stretching)",
            "کشش یکطرفه با کش",
            "کشش قفسه سینه یکطرفه",
            "کشش نزدیک‌کننده (Adductor Stretch)"
        ],
        activate: [
            "تقویت عضلات کمر یکطرفه",
            "تقویت عضلات کمر یکطرفه با کش",
            "تقویت عضلات دورکننده/نزدیک‌کننده لگن",
            "تقویت عضلات دورکننده/نزدیک‌کننده لگن با کش"
        ],
        integrate: [
            "تمرینات تعادلی (Balance Exercises)",
            "تمرینات تعادلی با توپ",
            "پلانک جانبی (Side Plank)",
            "تنفس لترال اصلاحی"
        ]
    },
    "زانوی پرانتزی/ضربدری (Knee Valgus/Varus)": {
        inhibit: [
            "فوم رول IT Band",
            "فوم رول نزدیک‌کننده ران",
            "فوم رول باسن"
        ],
        lengthen: [
            "کشش IT Band",
            "کشش IT Band با فوم رول",
            "کشش نزدیک‌کننده (Adductor Stretch)",
            "کشش باسن"
        ],
        activate: [
            "کلامشل (Clamshell)",
            "کلامشل با کش",
            "تقویت دورکننده ران (Hip Abduction)",
            "تقویت دورکننده ران با کش",
            "تقویت گلوت مید",
            "تقویت عضلات داخلی ران"
        ],
        integrate: [
            "استپ داون (Step Down)",
            "استپ داون با کش",
            "X-band Walks",
            "X-band Walks با کش"
        ]
    },
    "پای صاف (Flat Feet)": {
        inhibit: [
            "فوم رول ساق پا",
            "فوم رول پلانتار فاشیا",
            "رهاسازی نقطه‌ای کف پا"
        ],
        lengthen: [
            "کشش پلانتار فاشیا",
            "کشش پلانتار فاشیا با توپ",
            "کشش ساق پا",
            "کشش ساق پا با دیوار"
        ],
        activate: [
            "کشش و تقویت کف پا",
            "کشش و تقویت کف پا با توپ",
            "Short Foot Exercise",
            "تقویت عضلات داخلی پا",
            "تقویت عضلات ساق پا"
        ],
        integrate: [
            "تمرینات تعادل قوس",
            "تمرینات تعادل قوس با توپ",
            "Calf Raise با تمرکز قوس"
        ]
    },
    "شانه گرد (Rounded Shoulders)": {
        inhibit: [
            "فوم رول قفسه سینه",
            "فوم رول شانه",
            "فوم رول گردن"
        ],
        lengthen: [
            "کشش قفسه سینه",
            "کشش قفسه سینه با کش",
            "کشش گردن",
            "کشش گردن با کش"
        ],
        activate: [
            "تقویت عضلات پشت شانه",
            "تقویت عضلات پشت شانه با کش",
            "تقویت عضلات عمقی گردن",
            "تقویت عضلات عمقی گردن با کش"
        ],
        integrate: [
            "حرکت YTWL روی زمین",
            "حرکت YTWL با کش",
            "وال انجل (Wall Angel)",
            "وال انجل با کش"
        ]
    },
    "شانه یخ‌زده (Frozen Shoulder)": {
        inhibit: [
            "فوم رول شانه",
            "فوم رول کپسول شانه",
            "رهاسازی نقطه‌ای شانه"
        ],
        lengthen: [
            "کشش شانه",
            "کشش شانه با کش",
            "کشش کپسول شانه",
            "کشش کپسول شانه با کش"
        ],
        activate: [
            "تقویت عضلات شانه",
            "تقویت عضلات شانه با کش",
            "تقویت عضلات روتاتور کاف",
            "تقویت عضلات روتاتور کاف با کش"
        ],
        integrate: [
            "حرکت YTWL روی زمین",
            "حرکت YTWL با کش",
            "وال انجل (Wall Angel)",
            "وال انجل با کش"
        ]
    },
    "سندرم تونل کارپال (Carpal Tunnel)": {
        inhibit: [
            "فوم رول مچ دست",
            "رهاسازی نقطه‌ای مچ دست",
            "رهاسازی نقطه‌ای انگشتان"
        ],
        lengthen: [
            "کشش مچ دست",
            "کشش مچ دست با کش",
            "کشش انگشتان",
            "کشش انگشتان با کش"
        ],
        activate: [
            "تقویت عضلات مچ دست",
            "تقویت عضلات مچ دست با کش",
            "تقویت عضلات انگشتان",
            "تقویت عضلات انگشتان با کش"
        ],
        integrate: [
            "تمرینات عملکردی مچ دست",
            "تمرینات عملکردی انگشتان",
            "تمرینات تعادلی دست"
        ]
    },
    "درد پایین کمر (Lower Back Pain)": {
        inhibit: [
            "فوم رول کمر",
            "فوم رول همسترینگ",
            "فوم رول باسن",
            "رهاسازی نقطه‌ای باسن"
        ],
        lengthen: [
            "کشش کمر",
            "کشش کمر با کش",
            "کشش همسترینگ",
            "کشش همسترینگ با کش",
            "کشش باسن",
            "کشش باسن با کش"
        ],
        activate: [
            "تقویت عضلات کمر",
            "تقویت عضلات کمر با کش",
            "تقویت عضلات شکم",
            "تقویت عضلات شکم با کش",
            "تقویت عضلات باسن",
            "تقویت عضلات باسن با کش"
        ],
        integrate: [
            "ددباگ (Dead Bug)",
            "ددباگ با کش",
            "حرکت گربه-گاو (Cat-Cow)",
            "پلانک با تیلت لگن (Plank with Pelvic Tilt)"
        ]
    }
};

// پارامترهای پیش‌فرض برای هر مرحله NASM
type PhaseDefaults = { sets: number; reps: string; rest: string; restUnit?: string; intensity?: string };

export const nasmPhaseDefaults: Record<PhaseKey, PhaseDefaults> = {
    inhibit: {
        sets: 1,
        reps: "30-60 ثانیه",
        rest: "30",
        restUnit: "s",
        intensity: "سبک تا متوسط"
    },
    lengthen: {
        sets: 1,
        reps: "30-60 ثانیه",
        rest: "30",
        restUnit: "s",
        intensity: "سبک تا متوسط"
    },
    activate: {
        sets: 2,
        reps: "10-15",
        rest: "30",
        restUnit: "s",
        intensity: "متوسط"
    },
    integrate: {
        sets: 2,
        reps: "10-15",
        rest: "60",
        restUnit: "s",
        intensity: "متوسط تا شدید"
    }
};

// تنظیمات شدت تمرین
export const intensityLevels: Record<string, Record<PhaseKey, { sets: number; reps: string; rest: string }>> = {
    low: {
        inhibit: { sets: 1, reps: "30 ثانیه", rest: "30" },
        lengthen: { sets: 1, reps: "30 ثانیه", rest: "30" },
        activate: { sets: 2, reps: "10", rest: "30" },
        integrate: { sets: 2, reps: "10", rest: "60" }
    },
    medium: {
        inhibit: { sets: 1, reps: "45 ثانیه", rest: "30" },
        lengthen: { sets: 1, reps: "45 ثانیه", rest: "30" },
        activate: { sets: 2, reps: "12", rest: "30" },
        integrate: { sets: 2, reps: "12", rest: "60" }
    },
    high: {
        inhibit: { sets: 1, reps: "60 ثانیه", rest: "30" },
        lengthen: { sets: 1, reps: "60 ثانیه", rest: "30" },
        activate: { sets: 3, reps: "15", rest: "30" },
        integrate: { sets: 3, reps: "15", rest: "60" }
    }
};

