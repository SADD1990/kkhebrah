
import React, { useState, useEffect, useCallback } from 'react';
import SkillCard from '../components/SkillCard';
import { Recommendation } from '../types';
import { getRecommendations } from '../services/geminiService';
import { AiSparkleIcon, LoadingSpinner, SearchIcon } from '../components/Icons';

const HomePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInitialRecommendations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch recommendations for a popular default topic
            const data = await getRecommendations("ريادة الأعمال");
            setRecommendations(data);
        } catch (err) {
            setError("فشل تحميل التوصيات. يرجى المحاولة مرة أخرى.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialRecommendations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.hash = `#/search/${encodeURIComponent(searchQuery)}`;
        }
    };
    
    return (
        <div className="space-y-16 md:space-y-24 pb-16">
            {/* Hero Section */}
            <section className="relative text-center bg-indigo-900 text-white py-16 md:py-20 px-4 rounded-3xl overflow-hidden -mt-8">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 via-transparent to-indigo-900"></div>
                 <div className="absolute -top-10 -right-10 w-48 h-48 bg-teal-400/20 rounded-full filter blur-3xl"></div>
                 <div className="absolute -bottom-16 -left-10 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                        أطلق إمكانياتك مع <span className="text-teal-400">خِبرة</span>
                    </h1>
                    <p className="mt-4 text-lg text-indigo-200 max-w-2xl mx-auto">
                        المنصة الأولى في السعودية لتبادل المهارات، مدعومة بالذكاء الاصطناعي لربطك بالخبير المناسب.
                    </p>
                    <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto flex items-center bg-white/90 backdrop-blur-sm border border-transparent rounded-full p-2 shadow-2xl glow-shadow focus-within:border-indigo-300 transition-all">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ماذا تريد أن تتعلم اليوم؟ (مثال: التصميم، البرمجة)"
                            className="flex-grow bg-transparent border-none focus:ring-0 pr-4 text-indigo-900 placeholder-gray-500 text-lg"
                        />
                        <button type="submit" className="bg-teal-500 text-indigo-900 rounded-full px-6 py-3 font-bold hover:bg-teal-400 transition-colors flex items-center gap-2">
                            <SearchIcon className="w-5 h-5"/>
                            <span>ابحث</span>
                        </button>
                    </form>
                </div>
            </section>

            {/* Recommendations Section */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-teal-100 rounded-full">
                        <AiSparkleIcon className="w-8 h-8 text-teal-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">توصيات ذكية لك</h2>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner className="w-16 h-16"/>
                    </div>
                ) : error ? (
                    <div className="text-center py-10 px-4 bg-red-50 text-red-700 rounded-lg">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map(rec => (
                            <SkillCard key={rec.id} recommendation={rec} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;