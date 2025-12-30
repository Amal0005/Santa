import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SnowEffect from './SnowEffect';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, PlusCircle, Trophy, Sparkles } from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'bg-white/20' : '';

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-600 via-red-500 to-green-800 text-white font-sans relative pb-20 md:pb-0">
            <SnowEffect />

            {/* Header */}
            <nav className="relative z-10 p-4 flex justify-between items-center bg-red-900/30 backdrop-blur-md shadow-lg border-b border-white/10">
                <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-yellow-300 drop-shadow-md">
                    🎅 ElfVault
                </Link>

                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-black/20 px-4 py-1 rounded-full border border-white/10">
                            <span className="text-yellow-400 font-bold">🪙 {user.coins}</span>
                        </div>
                        <button onClick={logout} className="p-2 hover:bg-white/20 rounded-full transition text-white/80 hover:text-white">
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="space-x-4">
                        <Link to="/login" className="hover:text-yellow-200 transition font-medium">Login</Link>
                        <Link to="/register" className="bg-white text-red-600 px-4 py-2 rounded-full font-bold hover:bg-yellow-100 transition shadow-lg transform hover:scale-105">Get Started</Link>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto p-4">
                {children}
            </main>

            {/* Bottom Nav (Mobile/Tablet Friendly) */}
            {user && (
                <div className="fixed bottom-0 left-0 right-0 bg-red-900/95 backdrop-blur-lg p-1 z-50 flex justify-around items-center border-t border-white/10 md:justify-center md:gap-12 md:rounded-t-3xl md:w-3/4 md:mx-auto md:bottom-4 md:border md:shadow-2xl text-xs">
                    <Link to="/" className={`p-2 rounded-xl transition flex flex-col items-center ${isActive('/dashboard') ? 'text-yellow-300 scale-110' : 'text-white/60 hover:text-white'}`}>
                        <Home size={18} />
                    </Link>
                    <Link to="/missions" className={`p-2 rounded-xl transition flex flex-col items-center ${isActive('/missions') ? 'text-yellow-300 scale-110' : 'text-white/60 hover:text-white'}`}>
                        <span className="text-base">📜</span>
                    </Link>
                    <Link to="/tree" className={`p-2 rounded-xl transition flex flex-col items-center ${isActive('/tree') ? 'text-yellow-300 scale-110' : 'text-white/60 hover:text-white'}`}>
                        <span className="text-base">🎄</span>
                    </Link>
                    <Link to="/add-deed" className={`p-2 rounded-full bg-yellow-400 text-red-700 shadow-xl transform -translate-y-4 border-4 border-red-800 transition hover:scale-110 hover:bg-yellow-300`}>
                        <PlusCircle size={24} />
                    </Link>
                    <Link to="/post-office" className={`p-2 rounded-xl transition flex flex-col items-center ${isActive('/post-office') ? 'text-yellow-300 scale-110' : 'text-white/60 hover:text-white'}`}>
                        <span className="text-base">📨</span>
                    </Link>
                    <Link to="/community" className={`p-2 rounded-xl transition flex flex-col items-center ${isActive('/community') ? 'text-yellow-300 scale-110' : 'text-white/60 hover:text-white'}`}>
                        <Sparkles size={18} />
                    </Link>
                    <Link to="/leaderboard" className={`p-2 rounded-xl transition flex flex-col items-center ${isActive('/leaderboard') ? 'text-yellow-300 scale-110' : 'text-white/60 hover:text-white'}`}>
                        <Trophy size={18} />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Layout;
