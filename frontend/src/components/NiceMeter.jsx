import React from 'react';
import { motion } from 'framer-motion';

const NiceMeter = ({ percentage }) => {
    const getColor = () => {
        if (percentage <= 30) return '#ef4444'; // red
        if (percentage <= 70) return '#eab308'; // yellow
        return '#22c55e'; // green
    };

    const getLabel = () => {
        if (percentage <= 30) return 'Naughty Zone 😈';
        if (percentage <= 70) return 'Improving 😊';
        return 'Santa Approved 🎅❤️';
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="96" cy="96" r="88"
                        stroke="rgba(255,255,255,0.2)" strokeWidth="16" fill="transparent"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="96" cy="96" r="88"
                        stroke={getColor()} strokeWidth="16" fill="transparent"
                        strokeDasharray={2 * Math.PI * 88}
                        initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - percentage / 100) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">{percentage}%</span>
                    <span className="text-xs text-white/80 uppercase tracking-widest">Nice</span>
                </div>
            </div>
            <h3 className="mt-4 text-xl font-bold text-white animate-pulse">{getLabel()}</h3>
        </div>
    );
};
export default NiceMeter;
