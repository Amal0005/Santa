import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Confetti from 'react-confetti';

const AddDeed = () => {
    const [description, setDescription] = useState('');
    const [coinValue, setCoinValue] = useState(10);
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || loading) return;

        setLoading(true);
        try {
            // Add deed to Firestore
            await addDoc(collection(db, 'deeds'), {
                userId: user.uid,
                description,
                coinValue,
                date: new Date().toISOString()
            });

            // Calculate new stats
            const updates = {
                coins: (user.coins || 0) + coinValue,
                niceMeter: Math.min(100, (user.niceMeter || 0) + Math.ceil(coinValue / 5)),
                stickersUnlocked: [...(user.stickersUnlocked || [])]
            };

            // Simple logic for unlocking stickers
            if (updates.coins >= 100 && !updates.stickersUnlocked.includes('sticker1')) updates.stickersUnlocked.push('sticker1');
            if (updates.coins >= 500 && !updates.stickersUnlocked.includes('sticker2')) updates.stickersUnlocked.push('sticker2');
            if (updates.coins >= 1000 && !updates.stickersUnlocked.includes('badge')) updates.stickersUnlocked.push('badge');

            await updateUser(updates);

            setShowPopup(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 3500);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto pt-8 relative pb-20 px-4">
            {showPopup && <Confetti recycle={true} numberOfPieces={300} />}

            <h2 className="text-3xl font-bold mb-6 text-center text-yellow-300 drop-shadow-md">Log a Good Deed ✍️</h2>

            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl space-y-6">
                <div>
                    <label className="block mb-2 font-bold text-white/80 ml-1">What did you do today?</label>
                    <textarea
                        className="w-full bg-black/30 border-2 border-white/5 rounded-2xl p-4 text-white placeholder-white/20 focus:border-yellow-400/50 focus:ring-4 focus:ring-yellow-400/10 outline-none resize-none transition-all"
                        rows="3"
                        placeholder="I shared my toys with my sister..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-4 font-bold text-white/80 ml-1">How acts of kindness feel?</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[10, 25, 50].map((val) => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => setCoinValue(val)}
                                className={`py-4 rounded-2xl font-black transition-all transform active:scale-95 border-2 ${coinValue === val
                                    ? 'bg-yellow-400 text-red-700 border-yellow-300 shadow-lg shadow-yellow-400/20'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/60'
                                    }`}
                            >
                                <div className="text-xl">{val} <span className="text-xs italic">🪙</span></div>
                                <div className="text-[10px] uppercase tracking-widest mt-1">
                                    {val === 10 ? 'Kind' : val === 25 ? 'Sweet' : 'Saint'}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || showPopup}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-green-500/20 transform transition active:scale-[0.98] text-xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    {loading ? 'Sending to Santa...' : 'Submit to Santa 🎅'}
                </button>
            </form>

            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-[100] px-4"
                    >
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div
                            initial={{ scale: 0.5, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white text-red-600 p-10 rounded-[3rem] shadow-2xl relative z-10 text-center max-w-sm border-8 border-yellow-400"
                        >
                            <div className="text-7xl mb-6">🎅✨</div>
                            <h3 className="text-3xl font-black mb-3">Ho Ho Ho!</h3>
                            <p className="text-xl text-gray-700 font-bold leading-relaxed">
                                "Santa is so proud of your kindness! I've added <span className="text-green-600">{coinValue} coins</span> to your wallet!"
                            </p>
                            <div className="mt-8 text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">
                                Redirecting to Dashboard...
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddDeed;
