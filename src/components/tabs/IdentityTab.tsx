import React from 'react';
import { User, Phone, Mail, MapPin, GraduationCap, Heart } from 'lucide-react';
import type { UseUserFormReturn } from '../../hooks/useUserForm';

interface IdentityTabProps {
  form: UseUserFormReturn;
}

export const IdentityTab: React.FC<IdentityTabProps> = ({ form }) => {
  const { formData, errors, updateField } = form;

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            نام و نام خانوادگی *
          </label>
          <div className="relative">
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={`input-glass pr-10 ${errors.name ? 'border-red-500' : ''}`}
              placeholder="نام کامل را وارد کنید"
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            شماره تلفن *
          </label>
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className={`input-glass pr-10 ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            ایمیل
          </label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={`input-glass pr-10 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="email@example.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            جنسیت
          </label>
          <select
            value={formData.gender}
            onChange={(e) => updateField('gender', e.target.value)}
            className="input-glass"
          >
            <option value="male">مرد</option>
            <option value="female">زن</option>
          </select>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            تحصیلات
          </label>
          <div className="relative">
            <GraduationCap className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <select
              value={formData.education}
              onChange={(e) => updateField('education', e.target.value)}
              className="input-glass pr-10"
            >
              <option value="">انتخاب کنید</option>
              <option value="elementary">ابتدایی</option>
              <option value="middle">متوسطه</option>
              <option value="high">دیپلم</option>
              <option value="associate">کاردانی</option>
              <option value="bachelor">کارشناسی</option>
              <option value="master">کارشناسی ارشد</option>
              <option value="phd">دکتری</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            وضعیت تأهل
          </label>
          <div className="relative">
            <Heart className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <select
              value={formData.maritalStatus}
              onChange={(e) => updateField('maritalStatus', e.target.value)}
              className="input-glass pr-10"
            >
              <option value="single">مجرد</option>
              <option value="married">متأهل</option>
              <option value="divorced">طلاق‌گرفته</option>
              <option value="widowed">بیوه</option>
            </select>
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
          آدرس
        </label>
        <div className="relative">
          <MapPin className="absolute right-3 top-3 w-5 h-5 text-[var(--text-secondary)]" />
          <textarea
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            className="input-glass pr-10 min-h-[80px] resize-none"
            placeholder="آدرس کامل را وارد کنید"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

