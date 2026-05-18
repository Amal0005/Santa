import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';

const Register = () => {
    const { user, register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if logged in
    if (user) {
        return <Navigate to="/dashboard" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        try {
            await register(name, email, password);
            toast.success(`Welcome to the Nice List, ${name}! 🎄`, {
                duration: 5000,
                icon: '🎁',
            });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            const errorMessage = err?.message?.replace('Firebase: ', '') || 'Registration failed';
            toast.error(errorMessage);
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
                <div className="inline-block p-4 bg-green-500 rounded-full mb-4 shadow-lg shadow-green-500/20">
                    <UserPlus className="text-white w-8 h-8" />
                </div>
                <h2 className="text-4xl font-black text-white drop-shadow-md">Join Santa's Team! 📜</h2>
                <p className="text-white/60 mt-2">Start your journey of spreading kindness.</p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleSubmit}
                className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 shadow-2xl space-y-5 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 -ml-8 -mt-8 w-24 h-24 bg-green-500/10 rounded-full blur-3xl"></div>

                <div className="space-y-4">
                    <div className="relative group">
                        <label className="block mb-1 text-sm font-bold text-white/80 ml-1">Your Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-green-400 transition-colors w-5 h-5" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/30 border-2 border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:border-green-400/50 focus:ring-4 focus:ring-green-400/10 outline-none transition-all"
                                placeholder="Buddy the Elf"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="block mb-1 text-sm font-bold text-white/80 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-green-400 transition-colors w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/30 border-2 border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:border-green-400/50 focus:ring-4 focus:ring-green-400/10 outline-none transition-all"
                                placeholder="buddy@northpole.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="block mb-1 text-sm font-bold text-white/80 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-green-400 transition-colors w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/30 border-2 border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:border-green-400/50 focus:ring-4 focus:ring-green-400/10 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-500/20 transform transition active:scale-[0.98] text-lg flex items-center justify-center gap-3 disabled:opacity-70"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        'Sign Me Up! 🎄'
                    )}
                </button>

                <div className="text-center pt-2">
                    <p className="text-white/60 text-sm">
                        Already on the Nice List?{' '}
                        <Link to="/login" className="text-green-400 font-bold underline hover:text-green-300 transition-colors">
                            Login here
                        </Link>
                    </p>
                </div>
            </motion.form>
        </div>
    );
};

export default Register;
