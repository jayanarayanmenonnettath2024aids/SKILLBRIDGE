import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const MatchScore = ({ score, size = 120, strokeWidth = 10 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    const color = score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';

    return (
        <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    stroke="rgba(0,0,0,0.05)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <motion.circle
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
                <span style={{ fontSize: `${size / 4}px`, fontWeight: '800', color: 'var(--dash-text-primary)' }}>{score}%</span>
            </div>
        </div>
    );
};

export default MatchScore;
