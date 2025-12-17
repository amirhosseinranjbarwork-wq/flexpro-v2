/**
 * Training Program Print Generator
 * Generates printable HTML for training programs
 */

import type { User, WorkoutItem } from '../types/index';

export function generateTrainingProgramHTML(user: User): string {
  const today = new Date().toLocaleDateString('fa-IR');
  
  if (!user.plans?.workouts) {
    return `<div style="padding: 20px; text-align: center;">هیچ برنامه‌ای ثبت نشده است</div>`;
  }

  let html = `
    <div style="font-family: 'Segoe UI', sans-serif; direction: rtl; padding: 20px; max-width: 900px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #3B82F6; padding-bottom: 20px;">
        <h1 style="margin: 0; color: #1F2937;">برنامه تمرینی</h1>
        <p style="margin: 5px 0; color: #6B7280;">${user.name || 'بدون نام'}</p>
        <p style="margin: 5px 0; color: #6B7280; font-size: 14px;">تاریخ: ${today}</p>
      </div>
  `;

  // Iterate through each day
  for (let day = 1; day <= 7; day++) {
    const workouts = user.plans.workouts[day] || [];
    
    if (workouts.length === 0) continue;

    html += `
      <div style="margin-bottom: 25px; page-break-inside: avoid;">
        <h2 style="color: #3B82F6; border-right: 4px solid #3B82F6; padding-right: 10px; margin-bottom: 15px;">
          جلسه ${day}
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <thead>
            <tr style="background-color: #F3F4F6;">
              <th style="border: 1px solid #D1D5DB; padding: 10px; text-align: right;">حرکت</th>
              <th style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">ست</th>
              <th style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">تکرار</th>
              <th style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">استراحت</th>
              <th style="border: 1px solid #D1D5DB; padding: 10px; text-align: right;">توضیحات</th>
            </tr>
          </thead>
          <tbody>
    `;

    workouts.forEach((item: WorkoutItem, index: number) => {
      const bgColor = index % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
      const rest = item.rest ? `${item.rest}${item.restUnit === 'm' ? 'د' : 'ث'}` : '-';
      const reps = item.reps || (item.duration ? `${item.duration} دقیقه` : '-');
      const sets = item.sets || '-';
      
      html += `
        <tr style="background-color: ${bgColor};">
          <td style="border: 1px solid #D1D5DB; padding: 10px; text-align: right; font-weight: bold;">
            ${item.name || '-'}
            ${item.name2 ? `<div style="font-size: 12px; color: #6B7280;">+ ${item.name2}</div>` : ''}
            ${item.name3 ? `<div style="font-size: 12px; color: #6B7280;">+ ${item.name3}</div>` : ''}
            ${item.name4 ? `<div style="font-size: 12px; color: #6B7280;">+ ${item.name4}</div>` : ''}
          </td>
          <td style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">${sets}</td>
          <td style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">${reps}</td>
          <td style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">${rest}</td>
          <td style="border: 1px solid #D1D5DB; padding: 10px; text-align: right; font-size: 12px; color: #6B7280;">
            ${item.note || '-'}
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;
  }

  html += `
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #D1D5DB; text-align: center; color: #6B7280; font-size: 12px;">
        <p>تاریخ تولید: ${new Date().toLocaleString('fa-IR')}</p>
      </div>
    </div>
  `;

  return html;
}

export function generateNutritionProgramHTML(user: User): string {
  const today = new Date().toLocaleDateString('fa-IR');
  
  if (!user.plans?.diet || user.plans.diet.length === 0) {
    return `<div style="padding: 20px; text-align: center;">هیچ برنامه غذایی ثبت نشده است</div>`;
  }

  let html = `
    <div style="font-family: 'Segoe UI', sans-serif; direction: rtl; padding: 20px; max-width: 900px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #10B981; padding-bottom: 20px;">
        <h1 style="margin: 0; color: #1F2937;">برنامه غذایی</h1>
        <p style="margin: 5px 0; color: #6B7280;">${user.name || 'بدون نام'}</p>
        <p style="margin: 5px 0; color: #6B7280; font-size: 14px;">تاریخ: ${today}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #F3F4F6;">
            <th style="border: 1px solid #D1D5DB; padding: 10px; text-align: right;">غذا</th>
            <th style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">مقدار</th>
            <th style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">کالری</th>
            <th style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">پروتئین</th>
            <th style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">کربوهیدرات</th>
            <th style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">چربی</th>
          </tr>
        </thead>
        <tbody>
  `;

  user.plans.diet.forEach((item: any, index: number) => {
    const bgColor = index % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
    html += `
      <tr style="background-color: ${bgColor};">
        <td style="border: 1px solid #D1D5DB; padding: 10px; text-align: right;">${item.name || '-'}</td>
        <td style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">${item.amount || '-'}</td>
        <td style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">${item.calories || '-'}</td>
        <td style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">${item.protein || '-'}</td>
        <td style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">${item.carbs || '-'}</td>
        <td style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">${item.fat || '-'}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #D1D5DB; text-align: center; color: #6B7280; font-size: 12px;">
        <p>تاریخ تولید: ${new Date().toLocaleString('fa-IR')}</p>
      </div>
    </div>
  `;

  return html;
}

export function generateSupplementProgramHTML(user: User): string {
  const today = new Date().toLocaleDateString('fa-IR');
  
  if (!user.plans?.supps || user.plans.supps.length === 0) {
    return `<div style="padding: 20px; text-align: center;">هیچ برنامه مکمل‌گیری ثبت نشده است</div>`;
  }

  let html = `
    <div style="font-family: 'Segoe UI', sans-serif; direction: rtl; padding: 20px; max-width: 900px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #F59E0B; padding-bottom: 20px;">
        <h1 style="margin: 0; color: #1F2937;">برنامه مکمل‌گیری</h1>
        <p style="margin: 5px 0; color: #6B7280;">${user.name || 'بدون نام'}</p>
        <p style="margin: 5px 0; color: #6B7280; font-size: 14px;">تاریخ: ${today}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #F3F4F6;">
            <th style="border: 1px solid #D1D5DB; padding: 10px; text-align: right;">مکمل</th>
            <th style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">مقدار</th>
            <th style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">فرکانس</th>
            <th style="border: 1px solid #D1D5DB; padding: 10px; text-align: right;">توضیحات</th>
          </tr>
        </thead>
        <tbody>
  `;

  user.plans.supps.forEach((item: any, index: number) => {
    const bgColor = index % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
    html += `
      <tr style="background-color: ${bgColor};">
        <td style="border: 1px solid #D1D5DB; padding: 10px; text-align: right;">${item.name || '-'}</td>
        <td style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">${item.dose || '-'}</td>
        <td style="border: 1px solid #D1D5DB; padding: 10px; text-align: center;">${item.frequency || '-'}</td>
        <td style="border: 1px solid #D1D5DB; padding: 10px; text-align: right;">${item.notes || '-'}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #D1D5DB; text-align: center; color: #6B7280; font-size: 12px;">
        <p>تاریخ تولید: ${new Date().toLocaleString('fa-IR')}</p>
      </div>
    </div>
  `;

  return html;
}
