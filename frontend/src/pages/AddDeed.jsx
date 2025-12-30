import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Confetti from 'react-confetti';

const AddDeed = () => {
    const [description, setDescription] = useState('');
    const [coinValue, setCoinValue] = useState(10);
    const [showPopup, setShowPopup] = useState(false);
    const { updateUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/deed/add', { description, coinValue });
            updateUser({ coins: res.data.coins, niceMeter: res.data.niceMeter, stickersUnlocked: res.data.stickersUnlocked });
            setShowPopup(true);
            setTimeout(() => {
                navigate('/');
            }, 3500);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto pt-8 relative pb-20">
            {showPopup && <Confetti recycle={true} numberOfPieces={300} />}

            <h2 className="text-2xl font-bold mb-6 text-center">Log a Good Deed ✍️</h2>

            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl space-y-6">
                <div>
                    <label className="block mb-2 font-medium">What did you do?</label>
                    <textarea
                        className="w-full bg-black/20 border-0 rounded-xl p-4 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-400 outline-none resize-none transition"
                        rows="3"
                        placeholder="I helped clean the dishes..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-4 font-medium">How big was this deed?</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[10, 25, 50].map((val) => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => setCoinValue(val)}
                                className={`py-3 rounded-xl font-bold transition transform active:scale-95 border border-white/5 ${coinValue === val
                                        ? 'bg-yellow-400 text-yellow-900 shadow-lg scale-105 border-transparent'
                                        : 'bg-white/10 hover:bg-white/20'
                                    }`}
                            >
                                {val} 🪙
                                <div className="text-[10px] opacity-70">
                                    {val === 10 ? 'Small' : val === 25 ? 'Medium' : 'Big'}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={showPopup}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 text-lg disabled:opacity-50"
                >
                    Submit to Santa 🎅
                </button>
            </form>

            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-[100] p-4"
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <div className="bg-white text-red-600 p-8 rounded-3xl shadow-2xl relative z-10 text-center max-w-sm border-4 border-yellow-400">
                            <div className="text-6xl mb-4 bounce-animation">🎅✨</div>
                            <h3 className="text-2xl font-bold mb-2">Ho Ho Ho!</h3>
                            <p className="text-lg text-gray-700 font-medium">"Santa is so proud of you! Keep up the amazing work!"</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default AddDeed;
