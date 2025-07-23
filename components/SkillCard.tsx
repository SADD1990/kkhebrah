
import React from 'react';
import { Recommendation } from '../types';
import { AiSparkleIcon, StarIcon } from './Icons';
import { Link } from 'react-router-dom';

interface SkillCardProps {
  recommendation: Recommendation;
}

const SkillCard: React.FC<SkillCardProps> = ({ recommendation }) => {
  const { id, name, skill, rating, avatar, reason } = recommendation;
  return (
    <Link to={`/expert/${id}`} className="block bg-white rounded-2xl border border-gray-200/80 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-in-out group overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <img className="w-20 h-20 rounded-xl object-cover" src={avatar} alt={`صورة ${name}`} />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-800 transition-colors">{name}</h3>
            <p className="text-sm font-medium text-teal-700 bg-teal-100 inline-block px-2 py-0.5 rounded-md mt-1">{skill}</p>
            <div className="flex items-center mt-2 text-yellow-500">
              <StarIcon className="w-5 h-5" />
              <span className="text-gray-700 font-bold mr-1.5">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        {reason && (
          <div className="mt-4 p-3 bg-indigo-50 border-r-4 border-indigo-400 rounded-lg">
            <div className="flex items-center gap-2">
              <AiSparkleIcon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <p className="text-sm text-indigo-800 leading-relaxed">{reason}</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default SkillCard;