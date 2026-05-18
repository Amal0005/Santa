import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    if (user) return <Navigate to="/dashboard" />;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back, Kind Elf! 🎅', {
                icon: '🏠',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            const errorMessage = err.message.replace('Firebase: ', '');
            toast.error(errorMessage || 'Login failed', {
                style: {
                    borderRadius: '10px',
                    background: '#ef4444',
                    color: '#fff',
                },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto pt-10 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <div className="inline-block p-4 bg-yellow-400 rounded-full mb-4 shadow-lg shadow-yellow-400/20">
                    <LogIn className="text-red-700 w-8 h-8" />
                </div>
                <h2 className="text-4xl font-black text-white drop-shadow-md">Welcome Back!👋</h2>
                <p className="text-white/60 mt-2">Ready to spread more kindness today?</p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleSubmit}
                className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 shadow-2xl space-y-6 relative overflow-hidden"
            >
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-red-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-yellow-400/10 rounded-full blur-3xl"></div>

                <div className="space-y-4">
                    <div className="relative group">
                        <label className="block mb-2 text-sm font-bold text-white/80 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-yellow-400 transition-colors w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/30 border-2 border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:border-yellow-400/50 focus:ring-4 focus:ring-yellow-400/10 outline-none transition-all"
                                placeholder="santa@northpole.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="block mb-2 text-sm font-bold text-white/80 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-yellow-400 transition-colors w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/30 border-2 border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:border-yellow-400/50 focus:ring-4 focus:ring-yellow-400/10 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-red-700 font-black py-4 rounded-2xl shadow-xl shadow-yellow-400/20 transform transition active:scale-[0.98] text-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Checking the List...
                        </>
                    ) : (
                        'Enter the Vault 🎅'
                    )}
                </button>

                <div className="text-center pt-2">
                    <p className="text-white/60">
                        New to the North Pole?{' '}
                        <Link to="/register" className="text-yellow-400 font-bold underline hover:text-yellow-300 transition-colors">
                            Join the Team here
                        </Link>
                    </p>
                </div>
            </motion.form>
        </div>
    );
};

export default Login;
