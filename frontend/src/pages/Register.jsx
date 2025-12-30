import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register, login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            await login(email, password); // Auto login
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto pt-10">
            <h2 className="text-3xl font-bold text-center mb-8">Join Santa's List! 📜</h2>
            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-xl space-y-6">
                {error && <div className="bg-red-500/80 p-3 rounded-lg text-center text-sm font-bold">{error}</div>}

                <div>
                    <label className="block mb-2 font-medium ml-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/20 border-0 rounded-xl p-4 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-400 outline-none"
                        placeholder="Elf Buddy"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium ml-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/20 border-0 rounded-xl p-4 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-400 outline-none"
                        placeholder="buddy@northpole.com"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium ml-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/20 border-0 rounded-xl p-4 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-400 outline-none"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 text-lg">
                    Register
                </button>
            </form>
            <p className="text-center mt-6">
                Already have an account? <Link to="/login" className="font-bold underline hover:text-yellow-300">Login here</Link>
            </p>
        </div>
    );
};
export default Register;
