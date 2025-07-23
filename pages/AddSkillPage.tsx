
import React, { useState } from 'react';
import { Skill } from '../types';
import { PlusIcon } from '../components/Icons';

interface AddSkillPageProps {
  onAddSkill: (skill: Skill) => void;
}

const AddSkillPage: React.FC<AddSkillPageProps> = ({ onAddSkill }) => {
  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim() || !description.trim()) {
      alert("يرجى ملء جميع الحقول.");
      return;
    }
    
    setIsSubmitting(true);
    
    const newSkill: Skill = {
      id: String(Date.now()), // Use a more robust ID in a real app
      name: skillName,
      description: description,
    };

    // Simulate API call
    setTimeout(() => {
        onAddSkill(newSkill);
        // The navigation back to profile is handled in App.tsx
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">إضافة خبرة جديدة</h1>
        <p className="text-center text-gray-500 mb-8">شارك معرفتك مع الآخرين وساهم في إثراء مجتمع خِبرة.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="skillName" className="block text-sm font-bold text-gray-700 mb-2">
              اسم المهارة
            </label>
            <input
              id="skillName"
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="مثال: تصميم الجرافيك، كتابة المحتوى، تطوير الويب"
              className="w-full px-4 py-3 bg-slate-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
              وصف المهارة
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="صف خبرتك في هذه المهارة. ما الذي يمكنك تقديمه للمتعلمين؟"
              rows={5}
              className="w-full px-4 py-3 bg-slate-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              required
            ></textarea>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري الإضافة...</span>
                </>
              ) : (
                <>
                  <PlusIcon className="w-6 h-6"/>
                  <span>أضف المهارة إلى ملفي</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillPage;
