
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Recommendation, SearchType } from '../types';
import { getRecommendations } from '../services/geminiService';
import SkillCard from '../components/SkillCard';
import { LoadingSpinner, AiSparkleIcon } from '../components/Icons';

const SearchResultsPage: React.FC = () => {
    const { query } = useParams<{ query: string }>();
    const [results, setResults] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchType, setSearchType] = useState<SearchType>(SearchType.SMART);
    
    const decodedQuery = query ? decodeURIComponent(query) : '';

    const fetchResults = useCallback(async () => {
        if (!decodedQuery) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getRecommendations(decodedQuery);
            if (searchType === SearchType.CHRONOLOGICAL) {
                // In a real app, this would be a different API call.
                // Here we just shuffle for demonstration.
                setResults(data.sort(() => Math.random() - 0.5));
            } else {
                setResults(data);
            }
        } catch (err) {
            setError("فشل في جلب نتائج البحث.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [decodedQuery, searchType]);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);
    
    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">نتائج البحث عن: <span className="text-indigo-700">"{decodedQuery}"</span></h1>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 p-4 bg-white rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center bg-gray-100 rounded-full p-1 self-start md:self-center">
                    <button
                        onClick={() => setSearchType(SearchType.SMART)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${searchType === SearchType.SMART ? 'bg-white text-indigo-700 shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        <span className="flex items-center gap-2">
                            <AiSparkleIcon className="w-4 h-4 text-teal-500" />
                            توصية ذكية
                        </span>
                    </button>
                    <button
                        onClick={() => setSearchType(SearchType.CHRONOLOGICAL)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${searchType === SearchType.CHRONOLOGICAL ? 'bg-white text-indigo-700 shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        الأحدث أولاً
                    </button>
                </div>
                 <p className="text-sm text-gray-500 text-center md:text-right">
                    {searchType === SearchType.SMART ? "نعرض الخبراء الأكثر ملاءمة لاهتماماتك أولاً." : "نعرض الخبراء الجدد والمضافين حديثاً."}
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner className="w-16 h-16"/>
                </div>
            ) : error ? (
                <div className="text-center py-10 px-4 bg-red-50 text-red-700 rounded-lg">
                    <p>{error}</p>
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map(rec => (
                        <SkillCard key={rec.id} recommendation={rec} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-4 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-700">لم نجد أي نتائج</h3>
                    <p className="text-gray-500 mt-2">حاول استخدام مصطلحات بحث مختلفة.</p>
                </div>
            )}
        </div>
    );
};

export default SearchResultsPage;