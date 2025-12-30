import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Crown, Star, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get('/user/leaderboard');
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="max-w-2xl mx-auto pt-4 pb-24 relative px-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2 drop-shadow-lg text-yellow-300">
                    <Trophy className="text-yellow-400" size={32} /> Santa's Nice List
                </h2>
                <p className="text-white/80">Top kindness spreaders from around the world! 🌍</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                {users.length === 0 ? (
                    <div className="text-center p-8 opacity-70">Loading the list...</div>
                ) : (
                    users.map((u, index) => {
                        const isCurrent = currentUser && currentUser._id === u._id;
                        let rankIcon = <span className="text-xl font-bold text-white/60">#{index + 1}</span>;
                        let rowClass = "bg-white/5";

                        if (index === 0) {
                            rankIcon = <div className="text-3xl">👑</div>;
                            rowClass = "bg-gradient-to-r from-yellow-500/30 to-yellow-600/10 border-l-4 border-yellow-400 shadow-lg";
                        } else if (index === 1) {
                            rankIcon = <div className="text-2xl">🥈</div>;
                            rowClass = "bg-white/10 border-l-4 border-gray-300";
                        } else if (index === 2) {
                            rankIcon = <div className="text-2xl">🥉</div>;
                            rowClass = "bg-white/5 border-l-4 border-amber-700";
                        }

                        if (isCurrent) {
                            rowClass += " ring-2 ring-yellow-400 z-10 relative scale-[1.02]";
                        }

                        return (
                            <motion.div
                                key={u._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`p-4 flex items-center justify-between border-b border-white/5 last:border-0 transition-all ${rowClass}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 text-center flex justify-center">
                                        {rankIcon}
                                    </div>

                                    {/* Avatar Placeholder: Randomize or use stored logic later */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-inner ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 'bg-red-800 text-white border border-white/20'
                                        }`}>
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div>
                                        <div className={`font-bold text-lg flex items-center gap-2 ${isCurrent ? 'text-yellow-300' : 'text-white'}`}>
                                            {u.name} {isCurrent && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-2">YOU</span>}
                                        </div>
                                        <div className="flex gap-1 mt-1">
                                            {/* Badges */}
                                            {u.stickersUnlocked.includes('sticker1') && <span title="Kind Star" className="text-xs">⭐</span>}
                                            {u.stickersUnlocked.includes('sticker2') && <span title="Santa Helper" className="text-xs">🎖️</span>}
                                            {u.stickersUnlocked.includes('letter-badge') && <span title="Pen Pal" className="text-xs">📨</span>}
                                            {u.stickersUnlocked.includes('badge') && <span title="Kindness Hero" className="text-xs">👑</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="font-bold text-xl text-yellow-300 drop-shadow-sm flex items-center justify-end gap-1">
                                        {u.coins} <span className="text-sm opacity-80">🪙</span>
                                    </div>
                                    <div className="text-xs text-white/50 font-medium">Kindness Coins</div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
export default Leaderboard;
