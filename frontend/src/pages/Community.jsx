import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Sparkles, Heart, Zap, Gift, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const Community = () => {
    const [stats, setStats] = useState({ totalDeeds: 0, totalCoins: 0, goal: 10000 });
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/deed/stats');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
        // Poll every 10 seconds
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const christmas = new Date(new Date().getFullYear(), 11, 25);
            if (new Date() > christmas) christmas.setFullYear(christmas.getFullYear() + 1);
            const diff = christmas - new Date();

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);

            setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        };
        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000);
        return () => clearInterval(timer);
    }, []);

    const progress = Math.min(100, (stats.totalCoins / stats.goal) * 100);

    return (
        <div className="max-w-4xl mx-auto pt-4 pb-24 relative px-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-10"
            >
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center justify-center gap-3 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300">
                    <Sparkles className="text-yellow-400" size={48} /> North Pole Spirit Hub
                </h2>
                <p className="text-xl text-blue-100 font-medium">Monitoring Global Christmas Cheer Levels</p>
            </motion.div>

            {/* Christmas Countdown */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-red-900/40 backdrop-blur-md rounded-xl p-4 mb-12 border border-red-500/30 inline-flex items-center gap-4 shadow-lg"
            >
                <Calendar className="text-red-300" />
                <span className="text-2xl font-mono font-bold text-white tracking-widest">{timeLeft}</span>
                <span className="text-sm text-red-200 uppercase tracking-widest">Until Christmas</span>
            </motion.div>

            {/* Spirit Meter */}
            <div className="mb-16 relative">
                <div className="flex justify-between text-sm font-bold text-blue-200 mb-2 uppercase tracking-wider">
                    <span>Low Spirit</span>
                    <span>Christmas Miracle</span>
                </div>
                <div className="h-12 bg-black/40 rounded-full border-2 border-white/10 overflow-hidden relative shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 relative"
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-30 animate-pulse"></div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-black drop-shadow-md">
                            {Math.round(progress)}%
                        </div>
                    </motion.div>
                </div>
                <p className="mt-4 text-white/80 italic">
                    "We need <span className="text-yellow-300 font-bold">{stats.goal}</span> accumulated Spirit Coins to power Santa's Sleigh!"
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl flex flex-col items-center gap-4"
                >
                    <div className="bg-red-600 p-4 rounded-full shadow-lg shadow-red-900/50">
                        <Heart size={40} className="text-white" fill="white" />
                    </div>
                    <div>
                        <div className="text-5xl font-black text-white mb-2">{stats.totalDeeds}</div>
                        <div className="text-red-200 uppercase font-bold tracking-widest text-sm">Acts of Kindness</div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl flex flex-col items-center gap-4"
                >
                    <div className="bg-yellow-500 p-4 rounded-full shadow-lg shadow-yellow-900/50">
                        <Gift size={40} className="text-white" />
                    </div>
                    <div>
                        <div className="text-5xl font-black text-yellow-300 mb-2">{stats.totalCoins}</div>
                        <div className="text-yellow-100 uppercase font-bold tracking-widest text-sm">Spirit Coins Generated</div>
                    </div>
                </motion.div>
            </div>

            <div className="mt-12 text-blue-200/60 text-sm">
                Last updated from North Pole Mainframe
            </div>
        </div>
    );
};

export default Community;
