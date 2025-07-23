
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { LogoIcon } from '../components/Icons';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call and successful login
    setTimeout(() => {
      const loggedInUser: User = {
        name: 'سارة عبدالله',
        avatar: 'https://picsum.photos/seed/sara/100/100',
        bio: 'خبيرة تسويق رقمي بخبرة 5 سنوات في إدارة الحملات الإعلانية وتحليل البيانات. أسعى لمشاركة معرفتي ومساعدة الآخرين على النمو في هذا المجال المثير.',
        skills: [
          { id: '1', name: 'التسويق عبر وسائل التواصل الاجتماعي', description: 'خبير في بناء استراتيجيات تسويقية فعالة على منصات مثل انستغرام وتويتر.' },
          { id: '2', name: 'تحليل بيانات جوجل', description: 'أستخدم أدوات مثل Google Analytics لتحسين أداء المواقع والحملات.' }
        ]
      };
      onLogin(loggedInUser);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-280px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div>
          <LogoIcon className="mx-auto h-16 w-auto text-teal-500" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            أهلاً بعودتك في خِبرة
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أو{' '}
            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              أنشئ حساباً جديداً
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">البريد الإلكتروني</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">كلمة المرور</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
