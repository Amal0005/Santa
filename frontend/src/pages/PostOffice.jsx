import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Send, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

const PostOffice = () => {
    const { user, updateUser } = useAuth();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.coins < 50) {
            setError("Not enough coins! You need 50 coins to send a letter.");
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Fake delay for "sending" animation
            await new Promise(resolve => setTimeout(resolve, 2000));

            const res = await api.post('/letters', { content });

            updateUser({
                coins: res.data.coins,
                stickersUnlocked: res.data.stickersUnlocked
            });

            setResponse(res.data.santaResponse);
            setShowConfetti(true);
            setContent('');
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send letter.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pt-4 pb-24 relative px-4">
            {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                    <Mail className="text-red-200" /> Santa's Post Office
                </h2>
                <p className="text-white/80">Write to Santa clearly. Cost: 50 🪙</p>
            </div>

            <div className="bg-[#f4e4bc] text-gray-800 p-8 rounded-sm shadow-2xl relative transform rotate-1 hover:rotate-0 transition duration-500 font-serif min-h-[400px]">
                {/* Stamp */}
                <div className="absolute top-4 right-4 w-20 h-24 border-4 border-red-800/20 flex items-center justify-center rotate-3 opacity-50">
                    <div className="text-xs text-center font-bold text-red-800">NORTH POLE<br />POST</div>
                </div>

                {!response ? (
                    <form onSubmit={handleSubmit} className="h-full flex flex-col">
                        <label className="block font-bold text-xl mb-4 text-red-900">Dear Santa,</label>
                        <textarea
                            className="flex-1 w-full bg-transparent border-none outline-none text-lg leading-relaxed resize-none font-serif placeholder-gray-500/50"
                            placeholder="I have been very kind this year..."
                            rows="10"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={loading}
                            required
                        />

                        {error && <div className="text-red-600 font-bold mb-4 bg-red-100 p-2 rounded">{error}</div>}

                        <div className="flex justify-between items-end mt-4 pt-4 border-t-2 border-red-900/10">
                            <div className="text-sm font-bold text-red-900">From: {user.name}</div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-red-800 text-[#f4e4bc] px-6 py-2 rounded font-bold hover:bg-red-900 transition flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : <>Send Letter <Send size={16} /></>}
                            </button>
                        </div>
                    </form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <div className="text-6xl mb-4">🎅</div>
                        <h3 className="text-2xl font-bold text-red-900">Reply from Santa:</h3>
                        <p className="text-xl font-medium italic">"{response}"</p>
                        <button
                            onClick={() => { setResponse(''); setShowConfetti(false); }}
                            className="mt-8 text-red-800 font-bold underline hover:text-red-900"
                        >
                            Write another letter
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default PostOffice;
