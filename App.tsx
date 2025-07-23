
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, useNavigate, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MessagingPage from './pages/MessagingPage';
import SearchResultsPage from './pages/SearchResultsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AddSkillPage from './pages/AddSkillPage';
import { User, Skill } from './types';
import { LogoIcon, SearchIcon, HomeIcon, MessageIcon, ProfileIcon, PlusIcon, LogoutIcon, TwitterIcon, LinkedInIcon, InstagramIcon } from './components/Icons';
import Chatbot from './components/Chatbot';

const App: React.FC = () => (
    <HashRouter>
        <AppContent />
    </HashRouter>
);

const AppContent: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        navigate('/profile');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        navigate('/');
    };
    
    const handleAddSkill = (newSkill: Skill) => {
        if (currentUser) {
            setCurrentUser(prevUser => prevUser ? {
                ...prevUser,
                skills: [...prevUser.skills, newSkill]
            } : null);
            navigate('/profile');
        }
    };
    
  return (
      <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col relative">
        <Header currentUser={currentUser} onLogout={handleLogout} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search/:query" element={<SearchResultsPage />} />
            <Route path="/expert/:id" element={<ProfilePage user={DUMMY_EXPERT} isCurrentUser={false} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage onSignup={handleLogin} />} />

            {/* Protected Routes */}
            <Route path="/profile" element={currentUser ? <ProfilePage user={currentUser} isCurrentUser={true} /> : <Navigate to="/login" />} />
            <Route path="/messages" element={currentUser ? <MessagingPage /> : <Navigate to="/login" />} />
            <Route path="/add-skill" element={currentUser ? <AddSkillPage onAddSkill={handleAddSkill} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
  );
};

interface HeaderProps {
    currentUser: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const navigate = useNavigate();
    
    const navigateToSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if(searchQuery.trim()){
            navigate(`/search/${encodeURIComponent(searchQuery)}`);
        }
    };

  return (
    <>
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200/80">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-indigo-900">
          <LogoIcon className="w-9 h-9 text-teal-500" />
          <span className="hidden sm:block">خِبرة</span>
        </Link>
       
        <div className="hidden md:flex flex-1 justify-center px-8">
             <form onSubmit={navigateToSearch} className="relative w-full max-w-md">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن مهارة أو خبير..."
                    className="w-full bg-slate-100 border-2 border-transparent hover:border-gray-300 focus:border-indigo-500 focus:ring-0 rounded-full py-2 pr-12 pl-4 transition-all duration-300"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500">
                    <SearchIcon />
                </button>
            </form>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {currentUser ? (
              <>
                <NavLink to="/add-skill" className="flex items-center gap-2 bg-teal-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-teal-600 transition-colors">
                    <PlusIcon />
                    <span>إضافة خبرة</span>
                </NavLink>
                <NavLink to="/profile" className="p-2 text-gray-600 hover:text-indigo-800 transition-colors font-semibold">ملفي الشخصي</NavLink>
                <NavLink to="/messages" className="p-2 text-gray-600 hover:text-indigo-800 transition-colors font-semibold">الرسائل</NavLink>
                <button onClick={onLogout} className="p-2 text-gray-600 hover:text-red-600 transition-colors font-semibold flex items-center gap-1.5"><LogoutIcon/> تسجيل الخروج</button>
              </>
          ) : (
              <>
                <NavLink to="/login" className="p-2 text-gray-600 hover:text-indigo-800 transition-colors font-semibold">تسجيل الدخول</NavLink>
                <NavLink to="/signup" className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full hover:bg-indigo-800 transition-colors">إنشاء حساب</NavLink>
              </>
          )}
        </nav>

        <div className="md:hidden">
            <Link to={currentUser ? "/profile" : "/login"} className="p-2 text-gray-500 hover:text-indigo-700">
                <ProfileIcon />
            </Link>
        </div>
      </div>
    </header>
     {/* Mobile Bottom Nav */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200/80 flex justify-around p-2 z-50">
        <NavLink to="/" end className={({isActive}) => `flex flex-col items-center gap-1 text-xs transition-colors ${isActive ? 'text-indigo-700' : 'text-gray-500 hover:text-indigo-600'}`}> <HomeIcon /> الرئيسية </NavLink>
        <NavLink to="/search/التسويق" className={({isActive}) => `flex flex-col items-center gap-1 text-xs transition-colors ${isActive ? 'text-indigo-700' : 'text-gray-500 hover:text-indigo-600'}`}> <SearchIcon /> بحث </NavLink>
        <NavLink to="/messages" className={({isActive}) => `flex flex-col items-center gap-1 text-xs transition-colors ${isActive ? 'text-indigo-700' : 'text-gray-500 hover:text-indigo-600'}`}> <MessageIcon /> الرسائل </NavLink>
        <NavLink to="/profile" className={({isActive}) => `flex flex-col items-center gap-1 text-xs transition-colors ${isActive ? 'text-indigo-700' : 'text-gray-500 hover:text-indigo-600'}`}> <ProfileIcon /> ملفي </NavLink>
    </nav>
    </>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-indigo-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
            <div className="col-span-2 lg:col-span-1 mb-6 md:mb-0">
                 <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-white">
                    <LogoIcon className="w-9 h-9 text-teal-400" />
                    <span>خِبرة</span>
                </Link>
                <p className="mt-4 text-gray-400 text-sm">منصة لتبادل المهارات تماشيًا مع رؤية 2030.</p>
            </div>
            <div>
                <h3 className="font-bold text-white tracking-wider uppercase">المنصة</h3>
                <nav className="mt-4 space-y-2">
                    <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">عن خِبرة</a>
                    <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">وظائف</a>
                    <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">المدونة</a>
                </nav>
            </div>
             <div>
                <h3 className="font-bold text-white tracking-wider uppercase">المساعدة</h3>
                <nav className="mt-4 space-y-2">
                    <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">مركز المساعدة</a>
                    <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">تواصل معنا</a>
                    <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">شروط الاستخدام</a>
                </nav>
            </div>
             <div>
                <h3 className="font-bold text-white tracking-wider uppercase">قانوني</h3>
                <nav className="mt-4 space-y-2">
                    <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">سياسة الخصوصية</a>
                    <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">سياسة ملفات الارتباط</a>
                </nav>
            </div>
             <div>
                <h3 className="font-bold text-white tracking-wider uppercase">تابعنا</h3>
                <div className="flex mt-4 space-x-4">
                    <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-teal-400 transition-colors"><TwitterIcon className="w-6 h-6" /></a>
                    <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-teal-400 transition-colors"><LinkedInIcon className="w-6 h-6" /></a>
                    <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-teal-400 transition-colors"><InstagramIcon className="w-6 h-6" /></a>
                </div>
            </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} منصة خِبرة. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

// A dummy expert for demonstration purposes on expert profile pages
const DUMMY_EXPERT: User = {
    name: 'أحمد الغامدي',
    avatar: 'https://picsum.photos/seed/ahmed/100/100',
    bio: 'مصمم جرافيك وشغوف بالفن الرقمي. أمتلك خبرة واسعة في برامج Adobe وأحب تعليم أساسيات التصميم للمبتدئين.',
    skills: [
      { id: '3', name: 'تصميم الجرافيك', description: 'إنشاء هويات بصرية وشعارات احترافية للشركات الناشئة.' },
      { id: '4', name: 'الرسم الرقمي الاحترافي', description: 'الرسم الرقمي باستخدام Procreate و Photoshop لإنشاء لوحات فنية مميزة.' }
    ]
};


export default App;
