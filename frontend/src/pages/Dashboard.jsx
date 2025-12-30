import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NiceMeter from '../components/NiceMeter';
import api from '../utils/api';
import { Clock, Gift } from 'lucide-react';
import Confetti from 'react-confetti';

const Dashboard = () => {
    const { user, updateUser } = useAuth();
    const [deeds, setDeeds] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/user/dashboard');
            setDeeds(res.data.deeds);
            // Sync user data if changed significantly or just update to be safe
            if (res.data.user.coins !== user.coins) {
                if (res.data.user.coins > user.coins) setShowConfetti(true);
                updateUser(res.data.user);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 pb-20 pt-4">
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} onConfettiComplete={() => setShowConfetti(false)} />}

            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold drop-shadow-md">Ho Ho Ho, {user.name}! 🎅❤️</h2>
                <p className="text-white/80 font-medium">Santa is proud of you!</p>
                <Link to="/missions" className="inline-block mt-4 bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full text-sm font-bold transition border border-white/20">
                    📜 Santa’s Missions
                </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 transform hover:scale-[1.02] transition duration-500">
                <NiceMeter percentage={user.niceMeter} />
            </div>

            <div className="bg-black/20 rounded-2xl p-6 backdrop-blur-sm border border-white/5">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Clock size={20} className="text-yellow-300" /> Recent Deeds
                </h3>
                <div className="space-y-3">
                    {deeds.length === 0 ? (
                        <p className="text-center text-white/50 py-4 italic">No good deeds yet. Time to be nice!</p>
                    ) : (
                        deeds.map((deed, i) => (
                            <div key={deed._id || i} className="bg-white/10 p-3 rounded-xl flex justify-between items-center hover:bg-white/20 transition">
                                <span className="font-medium">{deed.description}</span>
                                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                    +{deed.coinValue} 🪙
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Unlocked Stickers/Badges Preview */}
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/5">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Gift size={20} className="text-green-400" /> Santa's Treasure Room
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {(user.stickersUnlocked || []).length === 0 && <span className="text-sm opacity-50 italic">Show kindness to unlock treasure!</span>}
                    {(user.stickersUnlocked || []).includes('sticker1') && <div className="text-4xl bg-white/20 p-2 rounded-full" title="Kind Star Badge">⭐</div>}
                    {(user.stickersUnlocked || []).includes('sticker2') && <div className="text-4xl bg-white/20 p-2 rounded-full" title="Santa Helper Badge">🎖️</div>}
                    {(user.stickersUnlocked || []).includes('letter-badge') && <div className="text-4xl bg-white/20 p-2 rounded-full" title="Pen Pal">📨</div>}
                    {(user.stickersUnlocked || []).includes('badge') && <div className="text-4xl bg-white/20 p-2 rounded-full" title="Kindness Hero Badge">👑</div>}
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
