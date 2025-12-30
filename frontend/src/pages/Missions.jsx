import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Confetti from 'react-confetti';
import { Star, CheckCircle, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Missions = () => {
    const { updateUser } = useAuth();
    const [missions, setMissions] = useState([]);
    const [streak, setStreak] = useState(0);
    const [completedIds, setCompletedIds] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        try {
            const res = await api.get('/missions');
            setMissions(res.data.missions);
            setStreak(res.data.streak);
            setCompletedIds(res.data.completedMissions);
            // Sync user stats just in case
            updateUser(res.data.userStats);
        } catch (err) {
            console.error(err);
        }
    };

    const handleComplete = async (mission) => {
        try {
            const res = await api.post('/missions/complete', { missionId: mission.id, reward: mission.reward });

            setCompletedIds(res.data.completedMissions);
            setStreak(res.data.streak);

            // Update Global User Context
            updateUser({
                coins: res.data.coins,
                niceMeter: res.data.niceMeter
            });

            // Show user feedback
            setShowConfetti(true);
            const randomMsg = [
                "Fantastic job! Santa is clapping for you!",
                "You just made the world a kinder place!",
                "Santa knew you could do it!",
                "You are Santa's little helper!"
            ];
            setPopupMessage(res.data.newSticker ? `Streak Reward Unlocked: ${res.data.newSticker}!` : randomMsg[Math.floor(Math.random() * randomMsg.length)]);

            setTimeout(() => {
                setShowConfetti(false);
                setPopupMessage('');
            }, 4000);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-xl mx-auto pt-4 pb-24 relative">
            {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">🎄 Santa’s Daily Missions 🎯</h2>
                <p className="text-white/80 mb-4">Complete today’s magical missions to impress Santa!</p>
                <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-200 px-4 py-2 rounded-full border border-orange-500/50">
                    <Flame className="text-orange-500" fill="currentColor" />
                    <span className="font-bold text-lg">{streak} Day Streak. Santa loves consistency!</span>
                </div>
            </div>

            <div className="space-y-4">
                {missions.map((mission) => {
                    const isCompleted = completedIds.includes(mission.id);
                    return (
                        <motion.div
                            key={mission.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${isCompleted
                                ? 'bg-green-600/20 border-green-500/50'
                                : 'bg-white/10 border-white/10 hover:border-yellow-400/50'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Mission from Santa</h3>
                                    <p className="text-white/80 font-medium mb-2">{mission.description}</p>
                                    <div className="flex items-center gap-1 text-yellow-300 text-sm font-bold">
                                        <Star size={16} fill="currentColor" /> {mission.reward} Coins
                                    </div>
                                </div>
                                {isCompleted && <CheckCircle className="text-green-400" size={32} />}
                            </div>

                            {!isCompleted ? (
                                <button
                                    onClick={() => handleComplete(mission)}
                                    className="w-full py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg active:scale-95"
                                >
                                    I Did It, Santa ✔️
                                </button>
                            ) : (
                                <div className="text-green-300 font-medium text-center bg-green-900/30 py-2 rounded-lg">
                                    Fantastic Job! ✨
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Streak Rewards Info */}
            <div className="mt-8 bg-black/20 p-6 rounded-2xl border border-white/10">
                <h3 className="font-bold text-lg mb-4 text-center">🏆 Streak Rewards</h3>
                <div className="flex justify-between text-center text-xs">
                    <div className={`p-2 rounded-lg ${streak >= 3 ? 'text-yellow-300' : 'opacity-50'}`}>
                        <div className="text-2xl mb-1">⭐</div>
                        <div>3 Days</div>
                    </div>
                    <div className={`p-2 rounded-lg ${streak >= 7 ? 'text-yellow-300' : 'opacity-50'}`}>
                        <div className="text-2xl mb-1">🥇</div>
                        <div>7 Days</div>
                    </div>
                    <div className={`p-2 rounded-lg ${streak >= 15 ? 'text-yellow-300' : 'opacity-50'}`}>
                        <div className="text-2xl mb-1">👑</div>
                        <div>15 Days</div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {popupMessage && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="fixed bottom-24 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96 bg-white text-red-800 p-4 rounded-2xl shadow-2xl z-50 flex items-center gap-4 border-l-8 border-green-500"
                    >
                        <div className="text-3xl">🎅</div>
                        <div>
                            <h4 className="font-bold">Santa says:</h4>
                            <p className="text-sm font-medium">{popupMessage}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Missions;
