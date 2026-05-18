import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Confetti from 'react-confetti';
import { Star, CheckCircle, Flame, Target, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MISSIONS_LIST = [
    { id: 'm1', description: 'Say something kind to a friend', reward: 10, icon: '💬' },
    { id: 'm2', description: 'Help with house chores', reward: 20, icon: '🧹' },
    { id: 'm3', description: 'Read a book for 15 mins', reward: 15, icon: '📚' },
    { id: 'm4', description: 'Drink a glass of water', reward: 5, icon: '💧' },
    { id: 'm5', description: 'Tidy up your room', reward: 25, icon: '🧺' }
];

const Missions = () => {
    const { user, updateUser } = useAuth();
    const [completedIds, setCompletedIds] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Synchronize local completedIds with user data
    useEffect(() => {
        if (user) {
            console.log("Missions: User data updated, syncing completedIds", user.completedMissions);
            const today = new Date().toISOString().split('T')[0];

            if (user.lastMissionDate !== today) {
                setCompletedIds([]);
            } else {
                setCompletedIds(user.completedMissions || []);
            }
        }
    }, [user?.lastMissionDate, JSON.stringify(user?.completedMissions)]);

    const handleComplete = async (mission) => {
        if (completedIds.includes(mission.id) || loading) {
            console.warn("Missions: Already completed or loading", mission.id);
            return;
        }

        console.log("Missions: Completing mission", mission.id);
        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            let newStreak = user?.streak || 0;
            let currentCompleted = [...completedIds];

            // Reset logic if new day
            if (user?.lastMissionDate !== today) {
                currentCompleted = [];
                if (user?.lastMissionDate === yesterdayStr) {
                    newStreak += 1;
                } else {
                    newStreak = 1;
                }
            }

            const newCompletedList = [...currentCompleted, mission.id];

            const updates = {
                coins: (user?.coins || 0) + mission.reward,
                niceMeter: Math.min(100, (user?.niceMeter || 0) + 5),
                completedMissions: newCompletedList,
                lastMissionDate: today,
                streak: newStreak
            };

            console.log("Missions: Sending updates to updateUser", updates);
            await updateUser(updates);

            // Local state updates for instant feedback
            setCompletedIds(newCompletedList);

            setShowConfetti(true);
            const randomMsg = [
                "Fantastic job! Santa is clapping for you!",
                "You just made the world a kinder place!",
                "Santa knew you could do it!",
                "You are Santa's little helper!"
            ];
            setPopupMessage(randomMsg[Math.floor(Math.random() * randomMsg.length)]);

            setTimeout(() => {
                setShowConfetti(false);
                setPopupMessage('');
            }, 4000);

        } catch (err) {
            console.error("Missions: Integration failed", err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="text-center pt-20 text-white font-bold">Checking Santa's list... 🎅</div>;

    return (
        <div className="max-w-xl mx-auto pt-6 pb-24 relative px-4">
            {showConfetti && <Confetti recycle={false} numberOfPieces={300} gravity={0.15} />}

            <div className="text-center mb-10 space-y-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-block p-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/20"
                >
                    <Target className="text-red-700 w-8 h-8" />
                </motion.div>
                <h2 className="text-4xl font-black text-white drop-shadow-md">Santa's Missions</h2>
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-2xl shadow-xl border border-white/20">
                    <Flame className="w-6 h-6 animate-pulse" fill="currentColor" />
                    <span className="font-black text-xl">{(user?.streak || 0)} DAY STREAK</span>
                </div>
            </div>

            <div className="space-y-4">
                {MISSIONS_LIST.map((mission, index) => {
                    const isCompleted = completedIds.includes(mission.id);
                    return (
                        <motion.div
                            key={mission.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group p-6 rounded-[2rem] border-2 transition-all duration-500 relative overflow-hidden ${isCompleted
                                ? 'bg-green-500/10 border-green-500/50 scale-[0.98] opacity-80'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-yellow-400/50 hover:scale-[1.02]'
                                }`}
                        >
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                        {mission.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-white">{mission.description}</h3>
                                        <div className="flex items-center gap-1.5 text-yellow-400 text-sm font-bold mt-1">
                                            <Star size={14} fill="currentColor" /> Reward: {mission.reward} 🪙
                                        </div>
                                    </div>
                                </div>
                                {isCompleted ? (
                                    <CheckCircle className="text-green-400 w-10 h-10 shrink-0" />
                                ) : (
                                    <button
                                        onClick={() => handleComplete(mission)}
                                        disabled={loading}
                                        className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg whitespace-nowrap disabled:opacity-50"
                                    >
                                        {loading ? 'Wait...' : 'I Did It!'}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Streak Info */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 text-center"
            >
                <Trophy className="w-5 h-5 mx-auto mb-4 text-yellow-400" />
                <div className="grid grid-cols-3 gap-4">
                    <div className={`p-4 rounded-3xl transition-all duration-700 ${(user?.streak || 0) >= 3 ? 'bg-yellow-400/20 scale-110 text-yellow-300' : 'bg-white/5 opacity-30 grayscale'}`}>
                        <div className="text-3xl mb-1">🎁</div>
                        <div className="text-[10px] font-black uppercase">3 Days</div>
                    </div>
                    <div className={`p-4 rounded-3xl transition-all duration-700 ${(user?.streak || 0) >= 7 ? 'bg-orange-400/20 scale-110 text-orange-300' : 'bg-white/5 opacity-30 grayscale'}`}>
                        <div className="text-3xl mb-1">🥇</div>
                        <div className="text-[10px] font-black uppercase">7 Days</div>
                    </div>
                    <div className={`p-4 rounded-3xl transition-all duration-700 ${(user?.streak || 0) >= 15 ? 'bg-red-400/20 scale-110 text-red-300' : 'bg-white/5 opacity-30 grayscale'}`}>
                        <div className="text-3xl mb-1">👑</div>
                        <div className="text-[10px] font-black uppercase">15 Days</div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {popupMessage && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-28 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96 bg-white text-gray-900 p-6 rounded-[2rem] shadow-2xl z-50 flex items-center gap-5 border-b-8 border-green-500"
                    >
                        <div className="text-5xl">🎅</div>
                        <div>
                            <h4 className="font-black text-red-600">Santa Notice!</h4>
                            <p className="text-sm font-bold text-gray-600 leading-tight">{popupMessage}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Missions;
