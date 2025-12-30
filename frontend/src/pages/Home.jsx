import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Home = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 p-4">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="text-8xl mb-4 animate-bounce">🎅</div>
                <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg text-yellow-300">
                    ElfVault
                </h1>
                <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium">
                    "Be good, do good, and fill your wallet with kindness coins!"
                </p>
            </motion.div>

            <motion.div
                className="grid gap-4 md:grid-cols-2 max-w-md w-full"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                <Link to="/login" className="bg-white text-red-600 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition shadow-lg flex justify-center items-center">
                    Login to Wallet
                </Link>
                <Link to="/register" className="bg-green-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-green-700 transition shadow-lg border-2 border-green-400 flex justify-center items-center">
                    Join Santa's Team
                </Link>
            </motion.div>

            <div className="mt-12 grid grid-cols-3 gap-8 text-center max-w-2xl">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <div className="text-3xl mb-2">🎁</div>
                    <div className="font-bold">Earn Rewards</div>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <div className="text-3xl mb-2">📈</div>
                    <div className="font-bold">Track Kindness</div>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <div className="text-3xl mb-2">🏆</div>
                    <div className="font-bold">Top Charts</div>
                </div>
            </div>
        </div>
    );
};
export default Home;
