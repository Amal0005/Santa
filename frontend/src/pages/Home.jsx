import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Gift, Heart, Trophy, Sparkles, ArrowRight } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-[90vh] flex flex-col items-center justify-center py-10 px-4 max-w-6xl mx-auto">
            {/* Hero Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center space-y-8"
            >
                <motion.div variants={itemVariants} className="relative inline-block">
                    <div className="text-[120px] md:text-[150px] leading-none select-none drop-shadow-2xl">🎅</div>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute -top-4 -right-4 bg-yellow-400 text-red-700 p-3 rounded-2xl font-black text-sm shadow-xl rotate-12 border-2 border-white"
                    >
                        NEW!
                    </motion.div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-sm">
                        ElfVault
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
                        The magical kindness tracker where every good deed powers Santa's sleigh.
                    </p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link to="/register" className="group bg-white text-red-600 px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3">
                        Join the Nice List <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/login" className="bg-red-600/20 backdrop-blur-md text-white border-2 border-white/20 px-10 py-5 rounded-2xl font-black text-xl hover:bg-red-600/30 transition-all flex items-center justify-center">
                        Login to Vault
                    </Link>
                </motion.div>
            </motion.div>

            {/* Features Section */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
            >
                <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all duration-500">
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Heart className="text-red-400 w-8 h-8" fill="currentColor" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Log Deeds</h3>
                    <p className="text-white/50 leading-relaxed font-medium">Record your daily acts of kindness and watch your nice meter grow to new heights.</p>
                </div>

                <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all duration-500">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Sparkles className="text-yellow-400 w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Earn Coins</h3>
                    <p className="text-white/50 leading-relaxed font-medium">Collect Spirit Coins for your hard work and spend them on magical tree decorations.</p>
                </div>

                <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all duration-500">
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Trophy className="text-green-400 w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Top Charts</h3>
                    <p className="text-white/50 leading-relaxed font-medium">Climb the global Nice List leaderboard and show the world your holiday spirit.</p>
                </div>
            </motion.div>

            {/* Stats/Footer area */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="mt-20 py-10 border-t border-white/5 w-full text-center"
            >
                <p className="text-white/40 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                    <div className="h-1 w-1 bg-green-500 rounded-full animate-ping" /> Powered by North Pole Magic
                </p>
            </motion.div>
        </div>
    );
};

export default Home;
