
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { getProfileSuggestions } from '../services/geminiService';
import { AiSparkleIcon, LoadingSpinner, TagIcon, PlusIcon } from '../components/Icons';
import { Link } from 'react-router-dom';

interface ProfilePageProps {
  user: User;
  isCurrentUser: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, isCurrentUser }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    if (isCurrentUser) {
      setLoadingSuggestions(true);
      const newSuggestions = await getProfileSuggestions(user.bio);
      setSuggestions(newSuggestions);
      setLoadingSuggestions(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrentUser, user.bio]);
  
  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-indigo-800 to-teal-600 p-8 md:p-12 relative">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-white relative z-10">
                <img className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-offset-4 ring-offset-indigo-800 ring-white" src={user.avatar} alt={`صورة ${user.name}`} />
                <div className="text-center md:text-right flex-1 pt-4">
                  <h1 className="text-4xl font-black tracking-tight">{user.name}</h1>
                  <p className="mt-4 text-lg text-indigo-200 leading-relaxed">{user.bio}</p>
                </div>
            </div>
        </div>
        
        <div className="p-8 md:p-10 space-y-10">
            {/* AI Suggestions */}
            {isCurrentUser && (
              <section>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-4">
                    <span className="p-2 bg-indigo-100 rounded-full"><AiSparkleIcon className="text-indigo-600 w-6 h-6" /></span>
                    <span>اقتراحات الذكاء الاصطناعي لتحسين ملفك</span>
                </h3>
                {loadingSuggestions ? (
                  <div className="flex justify-center items-center h-24">
                      <LoadingSpinner />
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="bg-indigo-50/70 p-4 rounded-xl flex items-start gap-3">
                         <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                         <p className="text-indigo-900">{suggestion}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* Skills Section */}
            <section>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="p-2 bg-teal-100 rounded-full"><TagIcon className="w-6 h-6 text-teal-600" /></span>
                        <span>المهارات والخبرات</span>
                    </h2>
                    {isCurrentUser && (
                        <Link to="/add-skill" className="flex items-center gap-2 bg-teal-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-teal-600 transition-colors shadow-md hover:shadow-lg">
                            <PlusIcon />
                            <span>إضافة مهارة جديدة</span>
                        </Link>
                    )}
                 </div>
                {user.skills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.skills.map(skill => (
                            <div key={skill.id} className="bg-white p-5 rounded-lg shadow-md border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                                <h4 className="text-lg font-bold text-indigo-900">{skill.name}</h4>
                                <p className="mt-1 text-gray-600">{skill.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 px-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">
                            {isCurrentUser ? "لم تقم بإضافة أي مهارات بعد. ابدأ بمشاركة خبراتك!" : "هذا الخبير لم يضف أي مهارات بعد."}
                        </p>
                    </div>
                )}
            </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
