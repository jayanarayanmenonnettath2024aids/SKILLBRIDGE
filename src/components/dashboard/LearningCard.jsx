import React from 'react';
import Card from '../ui/Card';
import { PlayCircle, Clock } from 'lucide-react';

const LearningCard = ({ title, provider, duration, level, image }) => {
    return (
        <Card className="learning-card p-0 overflow-hidden">
            <div className="learning-image">
                <img src={image} alt={title} />
                <div className="play-overlay">
                    <PlayCircle size={32} className="text-white" />
                </div>
            </div>
            <div className="learning-content p-4">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-primary bg-blue-50 px-2 py-1 rounded">{provider}</span>
                </div>
                <h4 className="mb-2 line-clamp-2">{title}</h4>
                <div className="flex items-center gap-4 text-xs text-secondary">
                    <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{duration}</span>
                    </div>
                    <span>{level}</span>
                </div>
            </div>
        </Card>
    );
};

export default LearningCard;
