import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SnowEffect from './SnowEffect';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, PlusCircle, Trophy, Sparkles, User, Mail, TreeDeciduous, ScrollText } from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Home' },
        { path: '/missions', icon: ScrollText, label: 'Missions' },
        { path: '/tree', icon: TreeDeciduous, label: 'Tree' },
        { path: '/add-deed', icon: PlusCircle, label: 'Log', isMain: true },
        { path: '/post-office', icon: Mail, label: 'Post' },
        { path: '/community', icon: Sparkles, label: 'World' },
        { path: '/leaderboard', icon: Trophy, label: 'Top' },
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans relative overflow-x-hidden selection:bg-yellow-400 selection:text-black">
            {/* Christmas Gradient Background */}
            <div className="fixed inset-0 bg-gradient-to-b from-red-950 via-red-900 to-green-950 pointer-events-none opacity-80" />

            <SnowEffect />

            {/* Header */}
            <nav className="sticky top-0 z-[100] px-4 py-3 bg-red-900/40 backdrop-blur-xl border-b border-white/10 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform">🎅</div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter text-yellow-100 leading-none">ElfVault</span>
                        <span className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest px-0.5">By North Pole Co.</span>
                    </div>
                </Link>

                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 px-4 py-1.5 rounded-2xl">
                            <span className="text-yellow-400 font-black text-lg">{user.coins || 0}</span>
                            <span className="text-sm">🪙</span>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2.5 bg-white/5 hover:bg-red-500/20 rounded-2xl transition-all border border-white/5 hover:border-red-500/30 text-white/60 hover:text-red-400"
                            title="Sign Out"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="px-5 py-2 text-sm font-bold text-white/80 hover:text-white transition-colors">Login</Link>
                        <Link to="/register" className="bg-white text-red-600 px-6 py-2 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-xl">Join Team</Link>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto pb-32 md:pb-12 min-h-[calc(100vh-64px)]">
                {children}
            </main>

            {/* Premium Mobile Bottom Navigation */}
            {user && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-[100]">
                    <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            if (item.isMain) {
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="relative group -mt-10"
                                    >
                                        <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <div className={`p-4 rounded-full shadow-2xl transition-all border-4 border-[#121a2c] ${active ? 'bg-yellow-400 text-red-700' : 'bg-red-600 text-white hover:bg-red-500 scale-110'}`}>
                                            <Icon size={28} />
                                        </div>
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`p-3.5 rounded-2xl flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'bg-white/10 text-yellow-400' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
                                >
                                    <Icon size={active ? 22 : 20} strokeWidth={active ? 3 : 2} />
                                    {active && <div className="w-1 h-1 bg-yellow-400 rounded-full" />}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
