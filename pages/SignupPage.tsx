
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { LogoIcon } from '../components/Icons';

interface SignupPageProps {
  onSignup: (user: User) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for account creation
    setTimeout(() => {
      const newUser: User = {
        name: name,
        avatar: `https://picsum.photos/seed/${name.replace(/\s/g, '')}/100/100`,
        bio: 'مستخدم جديد في منصة خِبرة. متحمس لتعلم ومشاركة المهارات!',
        skills: [] // Starts with no skills
      };
      onSignup(newUser);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-280px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div>
          <LogoIcon className="mx-auto h-16 w-auto text-teal-500" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            انضم إلى مجتمع خِبرة
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              قم بتسجيل الدخول
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-3">
            <div>
              <label htmlFor="name" className="sr-only">الاسم الكامل</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="الاسم الكامل"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">البريد الإلكتروني</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-400"
            >
              {isLoading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
