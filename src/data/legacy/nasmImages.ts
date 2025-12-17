// تصاویر واقع‌گرایانه SVG از انسان در حال انجام تمرینات NASM
// هر تصویر شامل حالت شروع و پایان حرکت است

type NasmImage = { start: string; end: string };

export const nasmExerciseImages: Record<string, NasmImage> = {
    // مرحله 1: مهار/رهاسازی (Inhibit)
    "فوم رول سینه ای (Thoracic Foam Rolling)": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- فوم رول -->
            <rect x="20" y="50" width="100" height="15" rx="7" fill="#3b82f6" opacity="0.6"/>
            <!-- بدن انسان (نیمه بالا) -->
            <ellipse cx="70" cy="45" rx="25" ry="20" fill="#fbbf24" opacity="0.3"/>
            <circle cx="70" cy="40" r="8" fill="#fbbf24"/>
            <path d="M 50 50 Q 70 45, 90 50" stroke="#fbbf24" stroke-width="3" fill="none"/>
            <text x="70" y="90" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- فوم رول -->
            <rect x="20" y="50" width="100" height="15" rx="7" fill="#10b981" opacity="0.6"/>
            <!-- بدن انسان (نیمه بالا) -->
            <ellipse cx="70" cy="42" rx="25" ry="20" fill="#fbbf24" opacity="0.3"/>
            <circle cx="70" cy="38" r="8" fill="#fbbf24"/>
            <path d="M 50 48 Q 70 42, 90 48" stroke="#fbbf24" stroke-width="3" fill="none"/>
            <text x="70" y="90" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    "فوم رول گردن": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- سر و گردن -->
            <circle cx="70" cy="30" r="12" fill="#fbbf24"/>
            <rect x="65" y="30" width="10" height="20" rx="5" fill="#fbbf24"/>
            <!-- فوم رول -->
            <rect x="55" y="35" width="30" height="8" rx="4" fill="#3b82f6" opacity="0.6"/>
            <text x="70" y="90" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- سر و گردن -->
            <circle cx="70" cy="28" r="12" fill="#fbbf24"/>
            <rect x="65" y="28" width="10" height="20" rx="5" fill="#fbbf24"/>
            <!-- فوم رول -->
            <rect x="55" y="33" width="30" height="8" rx="4" fill="#10b981" opacity="0.6"/>
            <text x="70" y="90" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    "فوم رول شانه": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن -->
            <circle cx="70" cy="40" r="10" fill="#fbbf24"/>
            <!-- شانه چپ -->
            <circle cx="45" cy="35" r="8" fill="#fbbf24"/>
            <rect x="40" y="35" width="10" height="15" rx="5" fill="#3b82f6" opacity="0.6"/>
            <!-- شانه راست -->
            <circle cx="95" cy="35" r="8" fill="#fbbf24"/>
            <rect x="90" y="35" width="10" height="15" rx="5" fill="#3b82f6" opacity="0.6"/>
            <text x="70" y="90" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن -->
            <circle cx="70" cy="40" r="10" fill="#fbbf24"/>
            <!-- شانه چپ -->
            <circle cx="45" cy="33" r="8" fill="#fbbf24"/>
            <rect x="40" y="33" width="10" height="15" rx="5" fill="#10b981" opacity="0.6"/>
            <!-- شانه راست -->
            <circle cx="95" cy="33" r="8" fill="#fbbf24"/>
            <rect x="90" y="33" width="10" height="15" rx="5" fill="#10b981" opacity="0.6"/>
            <text x="70" y="90" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    "فوم رول خم کننده های ران": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن -->
            <rect x="55" y="20" width="30" height="50" rx="15" fill="#fbbf24" opacity="0.7"/>
            <!-- ران -->
            <rect x="50" y="50" width="20" height="40" rx="10" fill="#fbbf24"/>
            <!-- فوم رول -->
            <rect x="45" y="55" width="30" height="12" rx="6" fill="#3b82f6" opacity="0.6"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن -->
            <rect x="55" y="20" width="30" height="50" rx="15" fill="#fbbf24" opacity="0.7"/>
            <!-- ران -->
            <rect x="50" y="48" width="20" height="40" rx="10" fill="#fbbf24"/>
            <!-- فوم رول -->
            <rect x="45" y="53" width="30" height="12" rx="6" fill="#10b981" opacity="0.6"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    "فوم رول QL": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن -->
            <rect x="55" y="25" width="30" height="50" rx="15" fill="#fbbf24" opacity="0.7"/>
            <!-- فوم رول در ناحیه کمر -->
            <rect x="50" y="40" width="40" height="15" rx="7" fill="#3b82f6" opacity="0.6"/>
            <text x="70" y="90" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن -->
            <rect x="55" y="25" width="30" height="50" rx="15" fill="#fbbf24" opacity="0.7"/>
            <!-- فوم رول در ناحیه کمر -->
            <rect x="50" y="38" width="40" height="15" rx="7" fill="#10b981" opacity="0.6"/>
            <text x="70" y="90" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    "فوم رول همسترینگ": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- پا -->
            <rect x="60" y="30" width="20" height="60" rx="10" fill="#fbbf24"/>
            <!-- فوم رول -->
            <rect x="55" y="50" width="30" height="15" rx="7" fill="#3b82f6" opacity="0.6"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- پا -->
            <rect x="60" y="30" width="20" height="60" rx="10" fill="#fbbf24"/>
            <!-- فوم رول -->
            <rect x="55" y="48" width="30" height="15" rx="7" fill="#10b981" opacity="0.6"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    
    // مرحله 2: کشش (Lengthen)
    "کشش سینه در چارچوب در (Doorway Stretch)": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- در -->
            <rect x="20" y="10" width="100" height="80" rx="5" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2"/>
            <line x1="50" y1="15" x2="50" y2="85" stroke="#9ca3af" stroke-width="2"/>
            <line x1="90" y1="15" x2="90" y2="85" stroke="#9ca3af" stroke-width="2"/>
            <!-- انسان -->
            <circle cx="70" cy="40" r="8" fill="#fbbf24"/>
            <rect x="60" y="40" width="20" height="30" rx="10" fill="#fbbf24"/>
            <!-- دست‌ها -->
            <rect x="45" y="42" width="15" height="4" rx="2" fill="#fbbf24"/>
            <rect x="80" y="42" width="15" height="4" rx="2" fill="#fbbf24"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- در -->
            <rect x="20" y="10" width="100" height="80" rx="5" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2"/>
            <line x1="50" y1="15" x2="50" y2="85" stroke="#9ca3af" stroke-width="2"/>
            <line x1="90" y1="15" x2="90" y2="85" stroke="#9ca3af" stroke-width="2"/>
            <!-- انسان -->
            <circle cx="70" cy="38" r="8" fill="#fbbf24"/>
            <rect x="60" y="38" width="20" height="30" rx="10" fill="#fbbf24"/>
            <!-- دست‌ها (کشیده شده) -->
            <rect x="42" y="40" width="18" height="4" rx="2" fill="#10b981"/>
            <rect x="80" y="40" width="18" height="4" rx="2" fill="#10b981"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    "کشش سینه با کش (Band Chest Stretch)": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- انسان -->
            <circle cx="70" cy="40" r="8" fill="#fbbf24"/>
            <rect x="60" y="40" width="20" height="30" rx="10" fill="#fbbf24"/>
            <!-- دست‌ها -->
            <rect x="50" y="42" width="12" height="4" rx="2" fill="#fbbf24"/>
            <rect x="78" y="42" width="12" height="4" rx="2" fill="#fbbf24"/>
            <!-- کش -->
            <path d="M 50 44 Q 70 42, 90 44" stroke="#10b981" stroke-width="3" fill="none"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- انسان -->
            <circle cx="70" cy="38" r="8" fill="#fbbf24"/>
            <rect x="60" y="38" width="20" height="30" rx="10" fill="#fbbf24"/>
            <!-- دست‌ها (کشیده شده) -->
            <rect x="45" y="40" width="15" height="4" rx="2" fill="#10b981"/>
            <rect x="80" y="40" width="15" height="4" rx="2" fill="#10b981"/>
            <!-- کش (کشیده شده) -->
            <path d="M 45 42 Q 70 38, 95 42" stroke="#3b82f6" stroke-width="3" fill="none"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    "کشش خم کننده های ران (Hip Flexor Stretch)": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن -->
            <rect x="60" y="20" width="20" height="50" rx="10" fill="#fbbf24"/>
            <!-- پا چپ (پشت) -->
            <rect x="55" y="60" width="15" height="30" rx="7" fill="#fbbf24"/>
            <!-- پا راست (جلو) -->
            <rect x="70" y="50" width="15" height="35" rx="7" fill="#fbbf24"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن -->
            <rect x="60" y="20" width="20" height="50" rx="10" fill="#fbbf24"/>
            <!-- پا چپ (پشت) -->
            <rect x="55" y="58" width="15" height="30" rx="7" fill="#fbbf24"/>
            <!-- پا راست (جلو - کشیده شده) -->
            <rect x="70" y="45" width="15" height="40" rx="7" fill="#10b981"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    "کشش همسترینگ": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن -->
            <rect x="60" y="25" width="20" height="40" rx="10" fill="#fbbf24"/>
            <!-- پا -->
            <rect x="62" y="50" width="16" height="45" rx="8" fill="#fbbf24"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن -->
            <rect x="60" y="25" width="20" height="40" rx="10" fill="#fbbf24"/>
            <!-- پا (کشیده شده) -->
            <rect x="62" y="48" width="16" height="47" rx="8" fill="#10b981"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    
    // مرحله 3: فعال‌سازی (Activate)
    "چانه به داخل (Chin Tuck)": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- سر -->
            <circle cx="70" cy="35" r="12" fill="#fbbf24"/>
            <!-- گردن -->
            <rect x="65" y="35" width="10" height="20" rx="5" fill="#fbbf24"/>
            <!-- بدن -->
            <rect x="60" y="50" width="20" height="30" rx="10" fill="#fbbf24"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- سر (چانه به داخل) -->
            <circle cx="70" cy="33" r="12" fill="#fbbf24"/>
            <!-- گردن -->
            <rect x="65" y="33" width="10" height="20" rx="5" fill="#10b981"/>
            <!-- بدن -->
            <rect x="60" y="50" width="20" height="30" rx="10" fill="#fbbf24"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    "تقویت میان‌کتفی (Scapular Retraction)": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن -->
            <circle cx="70" cy="45" r="10" fill="#fbbf24"/>
            <!-- شانه‌ها -->
            <circle cx="50" cy="40" r="7" fill="#fbbf24"/>
            <circle cx="90" cy="40" r="7" fill="#fbbf24"/>
            <!-- دست‌ها -->
            <rect x="45" y="42" width="10" height="15" rx="5" fill="#fbbf24"/>
            <rect x="85" y="42" width="10" height="15" rx="5" fill="#fbbf24"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن -->
            <circle cx="70" cy="45" r="10" fill="#fbbf24"/>
            <!-- شانه‌ها (جمع شده) -->
            <circle cx="48" cy="40" r="7" fill="#10b981"/>
            <circle cx="92" cy="40" r="7" fill="#10b981"/>
            <!-- دست‌ها -->
            <rect x="43" y="42" width="10" height="15" rx="5" fill="#10b981"/>
            <rect x="87" y="42" width="10" height="15" rx="5" fill="#10b981"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    "تقویت عضلات شکم (Core Strengthening)": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن -->
            <rect x="55" y="30" width="30" height="50" rx="15" fill="#fbbf24"/>
            <!-- پاها -->
            <rect x="60" y="70" width="12" height="25" rx="6" fill="#fbbf24"/>
            <rect x="68" y="70" width="12" height="25" rx="6" fill="#fbbf24"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن (منقبض شده) -->
            <rect x="55" y="28" width="30" height="45" rx="15" fill="#10b981"/>
            <!-- پاها -->
            <rect x="60" y="68" width="12" height="25" rx="6" fill="#fbbf24"/>
            <rect x="68" y="68" width="12" height="25" rx="6" fill="#fbbf24"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    "ددباگ (Dead Bug)": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن (روی زمین) -->
            <rect x="55" y="50" width="30" height="20" rx="10" fill="#fbbf24"/>
            <!-- دست‌ها (بالا) -->
            <rect x="60" y="30" width="8" height="20" rx="4" fill="#fbbf24"/>
            <rect x="72" y="30" width="8" height="20" rx="4" fill="#fbbf24"/>
            <!-- پاها -->
            <rect x="62" y="65" width="8" height="25" rx="4" fill="#fbbf24"/>
            <rect x="70" y="65" width="8" height="25" rx="4" fill="#fbbf24"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن (روی زمین) -->
            <rect x="55" y="50" width="30" height="20" rx="10" fill="#fbbf24"/>
            <!-- دست‌ها (پایین) -->
            <rect x="60" y="45" width="8" height="10" rx="4" fill="#10b981"/>
            <rect x="72" y="45" width="8" height="10" rx="4" fill="#10b981"/>
            <!-- پاها (بالا) -->
            <rect x="62" y="30" width="8" height="30" rx="4" fill="#10b981"/>
            <rect x="70" y="30" width="8" height="30" rx="4" fill="#10b981"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    
    // مرحله 4: یکپارچه‌سازی (Integrate)
    "حرکت YTWL روی زمین": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن (روی زمین) -->
            <rect x="55" y="50" width="30" height="20" rx="10" fill="#fbbf24"/>
            <!-- دست‌ها (حالت Y) -->
            <path d="M 60 45 L 70 30 L 80 45" stroke="#fbbf24" stroke-width="3" fill="none"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن (روی زمین) -->
            <rect x="55" y="50" width="30" height="20" rx="10" fill="#fbbf24"/>
            <!-- دست‌ها (حالت W) -->
            <path d="M 60 45 L 65 40 L 70 45 L 75 40 L 80 45" stroke="#10b981" stroke-width="3" fill="none"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    "وال انجل (Wall Angel)": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- دیوار -->
            <rect x="15" y="10" width="5" height="80" fill="#9ca3af"/>
            <!-- انسان -->
            <rect x="30" y="25" width="20" height="50" rx="10" fill="#fbbf24"/>
            <!-- دست‌ها -->
            <rect x="25" y="35" width="12" height="4" rx="2" fill="#fbbf24"/>
            <rect x="53" y="35" width="12" height="4" rx="2" fill="#fbbf24"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- دیوار -->
            <rect x="15" y="10" width="5" height="80" fill="#9ca3af"/>
            <!-- انسان -->
            <rect x="30" y="25" width="20" height="50" rx="10" fill="#fbbf24"/>
            <!-- دست‌ها (بالا) -->
            <rect x="22" y="28" width="12" height="4" rx="2" fill="#10b981"/>
            <rect x="50" y="28" width="12" height="4" rx="2" fill="#10b981"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    "پلانک با تیلت لگن (Plank with Pelvic Tilt)": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن (پلانک) -->
            <rect x="50" y="40" width="40" height="15" rx="7" fill="#fbbf24"/>
            <!-- دست‌ها -->
            <rect x="52" y="35" width="8" height="10" rx="4" fill="#fbbf24"/>
            <rect x="80" y="35" width="8" height="10" rx="4" fill="#fbbf24"/>
            <!-- پاها -->
            <rect x="58" y="52" width="8" height="30" rx="4" fill="#fbbf24"/>
            <rect x="74" y="52" width="8" height="30" rx="4" fill="#fbbf24"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن (پلانک با تیلت) -->
            <path d="M 50 45 Q 70 38, 90 45" stroke="#10b981" stroke-width="15" fill="none" stroke-linecap="round"/>
            <!-- دست‌ها -->
            <rect x="52" y="33" width="8" height="10" rx="4" fill="#10b981"/>
            <rect x="80" y="33" width="8" height="10" rx="4" fill="#10b981"/>
            <!-- پاها -->
            <rect x="58" y="50" width="8" height="30" rx="4" fill="#fbbf24"/>
            <rect x="74" y="50" width="8" height="30" rx="4" fill="#fbbf24"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    },
    "حرکت گربه-گاو (Cat-Cow)": {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن (حالت گاو) -->
            <path d="M 50 50 Q 70 40, 90 50" stroke="#fbbf24" stroke-width="12" fill="none" stroke-linecap="round"/>
            <!-- دست‌ها -->
            <rect x="48" y="45" width="8" height="12" rx="4" fill="#fbbf24"/>
            <rect x="84" y="45" width="8" height="12" rx="4" fill="#fbbf24"/>
            <!-- پاها -->
            <rect x="54" y="52" width="8" height="25" rx="4" fill="#fbbf24"/>
            <rect x="78" y="52" width="8" height="25" rx="4" fill="#fbbf24"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <!-- بدن (حالت گربه) -->
            <path d="M 50 50 Q 70 60, 90 50" stroke="#10b981" stroke-width="12" fill="none" stroke-linecap="round"/>
            <!-- دست‌ها -->
            <rect x="48" y="55" width="8" height="12" rx="4" fill="#10b981"/>
            <rect x="84" y="55" width="8" height="12" rx="4" fill="#10b981"/>
            <!-- پاها -->
            <rect x="54" y="58" width="8" height="25" rx="4" fill="#fbbf24"/>
            <rect x="78" y="58" width="8" height="25" rx="4" fill="#fbbf24"/>
            <text x="70" y="95" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    }
};

// تابع برای دریافت تصویر پیش‌فرض در صورت عدم وجود
export const getExerciseImage = (exerciseName: string): NasmImage => {
    const images = nasmExerciseImages[exerciseName];
    if (images) return images;
    
    // تصویر پیش‌فرض
    return {
        start: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <rect x="50" y="30" width="40" height="40" rx="20" fill="#94a3b8" opacity="0.3"/>
            <circle cx="70" cy="50" r="12" fill="#94a3b8"/>
            <text x="70" y="90" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">شروع</text>
        </svg>`,
        end: `<svg width="140" height="100" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="140" height="100" fill="#f8fafc"/>
            <rect x="50" y="30" width="40" height="40" rx="20" fill="#64748b" opacity="0.3"/>
            <circle cx="70" cy="50" r="12" fill="#64748b"/>
            <text x="70" y="90" text-anchor="middle" font-size="10" fill="#64748b" font-family="Arial">پایان</text>
        </svg>`
    };
};

