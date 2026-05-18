import React, { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { ShoppingBag, Star, Zap } from 'lucide-react';

const ITEMS = [
    { id: 'star', name: 'Golden Star', price: 500, icon: '⭐' },
    { id: 'lights', name: 'Fairy Lights', price: 150, icon: '💡' },
    { id: 'ball-red', name: 'Red Ball', price: 50, icon: '🔴' },
    { id: 'ball-blue', name: 'Blue Ball', price: 50, icon: '🔵' },
    { id: 'tinsel', name: 'Gold Tinsel', price: 100, icon: '🎗️' },
    { id: 'candy', name: 'Candy Cane', price: 75, icon: '🍬' },
    { id: 'gift', name: 'Gift Box', price: 200, icon: '🎁' },
    { id: 'snow', name: 'Magic Snow', price: 300, icon: '❄️' },
];

const TreePage = () => {
    const { user, updateUser } = useAuth();
    const [decorations, setDecorations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (user && user.decorations) {
            setDecorations(user.decorations);
        }
    }, [user]);

    const buyItem = async (item) => {
        if (decorations.includes(item.id)) return;
        if ((user.coins || 0) < item.price) {
            setMsg(`Not enough coins for ${item.name}!`);
            setTimeout(() => setMsg(''), 3000);
            return;
        }

        setLoading(true);
        try {
            const newDecorations = [...decorations, item.id];
            const newCoins = (user.coins || 0) - item.price;

            await updateUser({
                coins: newCoins,
                decorations: newDecorations
            });

            setMsg(`You bought ${item.name}!`);
            setShowConfetti(true);
            setTimeout(() => {
                setMsg('');
                setShowConfetti(false);
            }, 3000);
        } catch (err) {
            console.error(err);
            setMsg('Error buying item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto">
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 text-yellow-300 drop-shadow-md">My Kindness Tree 🎄</h2>
                <p className="text-white/80">Use your coins to decorate your tree!</p>
                <div className="mt-4 bg-black/30 inline-block px-4 py-2 rounded-full border border-yellow-500/50 text-yellow-400 font-bold text-xl">
                    You have: {user?.coins || 0} 🪙
                </div>
            </div>

            {msg && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white text-red-800 px-6 py-3 rounded-xl font-bold z-50 shadow-2xl animate-bounce border-2 border-green-500">
                    {msg}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* TREE VIEW */}
                <div className="bg-gradient-to-b from-blue-900/50 to-green-900/50 rounded-3xl p-8 border border-white/10 min-h-[400px] relative flex justify-center items-end overflow-hidden shadow-inner">
                    {decorations.includes('snow') && <div className="absolute inset-0 animate-pulse opacity-50 pointer-events-none text-6xl text-white">❄️ ❄️ ❄️</div>}

                    {/* Tree Container */}
                    <div className="relative w-64 h-80">
                        {/* Star */}
                        {decorations.includes('star') && <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-6xl drop-shadow-[0_0_15px_rgba(255,255,0,0.8)] z-20 animate-pulse">⭐</div>}

                        {/* Tree Body (CSS Triangles) */}
                        <div className="absolute bottom-0 w-0 h-0 border-l-[120px] border-r-[120px] border-b-[200px] border-l-transparent border-r-transparent border-b-green-700 z-10 flex justify-center">
                            {/* Ornaments on Tree */}
                            {decorations.includes('tinsel') && <div className="absolute top-20 w-40 h-2 bg-yellow-400/50 -rotate-12 rounded-full blur-[1px]"></div>}
                            {decorations.includes('tinsel') && <div className="absolute top-36 w-52 h-2 bg-yellow-400/50 rotate-6 rounded-full blur-[1px]"></div>}

                            {decorations.includes('ball-red') && <div className="absolute top-24 -left-8 text-2xl">🔴</div>}
                            {decorations.includes('ball-red') && <div className="absolute top-32 left-4 text-2xl">🔴</div>}
                            {decorations.includes('ball-blue') && <div className="absolute top-16 left-0 text-2xl">🔵</div>}
                            {decorations.includes('ball-blue') && <div className="absolute top-40 -left-12 text-2xl">🔵</div>}

                            {decorations.includes('lights') && <div className="absolute top-10 w-full h-full flex flex-wrap justify-center gap-8 opacity-70 animate-pulse">
                                <span className="text-yellow-200 text-xs">💡</span><span className="text-red-200 text-xs">💡</span><span className="text-blue-200 text-xs">💡</span>
                            </div>}

                            {decorations.includes('candy') && <div className="absolute top-28 left-8 text-2xl rotate-45">🍬</div>}
                        </div>
                        {/* Upper Tier */}
                        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[100px] border-r-[100px] border-b-[160px] border-l-transparent border-r-transparent border-b-green-600 z-10"></div>
                        {/* Top Tier */}
                        <div className="absolute bottom-56 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[80px] border-r-[80px] border-b-[120px] border-l-transparent border-r-transparent border-b-green-500 z-10"></div>

                        {/* Gifts Under Tree */}
                        {decorations.includes('gift') && <div className="absolute -bottom-4 -left-16 text-4xl z-20">🎁</div>}
                        {decorations.includes('gift') && <div className="absolute -bottom-4 -right-12 text-4xl z-20">🎁</div>}

                        {/* Trunk */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-amber-800"></div>
                    </div>
                </div>

                {/* SHOP */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2"><ShoppingBag className="text-green-400" /> Decoration Shop</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {ITEMS.map((item) => {
                            const owned = decorations.includes(item.id);
                            const canAfford = user.coins >= item.price;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => buyItem(item)}
                                    disabled={owned || loading}
                                    className={`p-3 rounded-xl flex flex-col items-center justify-center border-2 transition relative ${owned
                                        ? 'bg-green-500/20 border-green-500 opacity-60'
                                        : canAfford
                                            ? 'bg-white/10 border-white/10 hover:bg-white/20 hover:border-yellow-400 hover:scale-105'
                                            : 'bg-black/20 border-red-900/30 opacity-50 cursor-not-allowed'
                                        }`}
                                >
                                    <div className="text-3xl mb-1">{item.icon}</div>
                                    <div className="font-bold text-sm">{item.name}</div>
                                    <div className={`text-xs font-bold mt-1 ${owned ? 'text-green-400' : 'text-yellow-300'}`}>
                                        {owned ? 'Owned ✔' : `${item.price} 🪙`}
                                    </div>
                                    {item.id === 'star' && !owned && <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">EPIC</div>}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TreePage;
