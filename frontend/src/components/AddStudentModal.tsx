import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '../i18n';
import { Student } from '../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (studentData: Partial<Student>) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<Student>>({
    fullName: '',
    dateOfBirth: '',
    grade: 1,
    classGroup: '',
    gender: 'M',
    status: 'Active',
    languageOfInstruction: 'Arabic',
    clinicalNotes: '',
    parentalConsentGiven: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.dateOfBirth) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }
    onSubmit(formData);
    setFormData({
      fullName: '',
      dateOfBirth: '',
      grade: 1,
      classGroup: '',
      gender: 'M',
      status: 'Active',
      languageOfInstruction: 'Arabic',
      clinicalNotes: '',
      parentalConsentGiven: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-soft-lg w-full max-w-lg overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="px-6 py-5 border-b border-sahartoon-neutral/20 flex justify-between items-center bg-sahartoon-beige/30">
          <h3 className="text-lg font-bold text-sahartoon-dark">➕ {t('dashboard.addNewStudent')}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-sahartoon-dark hover:bg-white/50 rounded-lg p-1 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-sahartoon-dark mb-2">
              {t('dashboard.fullName')} <span className="text-sahartoon-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder={t('dashboard.fullName')}
              className="w-full px-4 py-2.5 bg-sahartoon-beige border border-sahartoon-neutral/30 rounded-lg text-sahartoon-dark placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sahartoon-burgundy/20 focus:border-sahartoon-burgundy transition-all duration-200"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-semibold text-sahartoon-dark mb-2">
              {t('dashboard.dateOfBirth')} <span className="text-sahartoon-danger">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full px-4 py-2.5 bg-sahartoon-beige border border-sahartoon-neutral/30 rounded-lg text-sahartoon-dark focus:outline-none focus:ring-2 focus:ring-sahartoon-burgundy/20 focus:border-sahartoon-burgundy transition-all duration-200"
            />
          </div>

          {/* Grid: Grade and Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-sahartoon-dark mb-2">
                {t('dashboard.grade')}
              </label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 bg-sahartoon-beige border border-sahartoon-neutral/30 rounded-lg text-sahartoon-dark focus:outline-none focus:ring-2 focus:ring-sahartoon-burgundy/20 focus:border-sahartoon-burgundy transition-all duration-200"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-sahartoon-dark mb-2">
                {t('dashboard.gender')}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-4 py-2.5 bg-sahartoon-beige border border-sahartoon-neutral/30 rounded-lg text-sahartoon-dark focus:outline-none focus:ring-2 focus:ring-sahartoon-burgundy/20 focus:border-sahartoon-burgundy transition-all duration-200"
              >
                <option value="M">{t('dashboard.male')}</option>
                <option value="F">{t('dashboard.female')}</option>
                <option value="Other">{t('dashboard.other')}</option>
              </select>
            </div>
          </div>

          {/* Class Group */}
          <div>
            <label className="block text-sm font-semibold text-sahartoon-dark mb-2">
              {t('dashboard.classGroup')}
            </label>
            <input
              type="text"
              value={formData.classGroup}
              onChange={(e) => setFormData({ ...formData, classGroup: e.target.value })}
              placeholder="Ex: 3A"
              className="w-full px-4 py-2.5 bg-sahartoon-beige border border-sahartoon-neutral/30 rounded-lg text-sahartoon-dark placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sahartoon-burgundy/20 focus:border-sahartoon-burgundy transition-all duration-200"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-sahartoon-dark mb-2">
              {t('dashboard.language')}
            </label>
            <select
              value={formData.languageOfInstruction}
              onChange={(e) => setFormData({ ...formData, languageOfInstruction: e.target.value })}
              className="w-full px-4 py-2.5 bg-sahartoon-beige border border-sahartoon-neutral/30 rounded-lg text-sahartoon-dark focus:outline-none focus:ring-2 focus:ring-sahartoon-burgundy/20 focus:border-sahartoon-burgundy transition-all duration-200"
            >
                <option value="Arabic">العربية (Arabe)</option>
                <option value="French">Français</option>
                <option value="Tamazight">Tamazight</option>
              </select>
            </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-sahartoon-dark mb-2">
              {t('dashboard.status')}
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2.5 bg-sahartoon-beige border border-sahartoon-neutral/30 rounded-lg text-sahartoon-dark focus:outline-none focus:ring-2 focus:ring-sahartoon-burgundy/20 focus:border-sahartoon-burgundy transition-all duration-200"
            >
              <option value="Active">Actif</option>
              <option value="Monitoring">En surveillance</option>
              <option value="Referred">Référé</option>
            </select>
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block text-sm font-semibold text-sahartoon-dark mb-2">
              Notes cliniques
            </label>
            <textarea
              value={formData.clinicalNotes}
              onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
              placeholder="Remarques optionnelles..."
              rows={3}
              className="w-full px-4 py-2.5 bg-sahartoon-beige border border-sahartoon-neutral/30 rounded-lg text-sahartoon-dark placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sahartoon-burgundy/20 focus:border-sahartoon-burgundy transition-all duration-200 resize-none"
            />
          </div>

          {/* Parental Consent */}
          <div className="flex items-center gap-3 p-3 bg-sahartoon-beige/50 rounded-lg border border-sahartoon-neutral/20">
            <input
              type="checkbox"
              id="consent"
              checked={formData.parentalConsentGiven}
              onChange={(e) => setFormData({ ...formData, parentalConsentGiven: e.target.checked })}
              className="w-4 h-4 rounded border-sahartoon-neutral accent-sahartoon-burgundy cursor-pointer"
            />
            <label htmlFor="consent" className="text-sm font-medium text-sahartoon-dark cursor-pointer">
              {t('dashboard.parentalConsentGiven')}
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-sahartoon-neutral/20">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-medium text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all duration-200"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg font-medium text-sm text-white bg-sahartoon-burgundy hover:bg-sahartoon-burgundy/90 shadow-soft-md hover:shadow-soft-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              ✓ {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
