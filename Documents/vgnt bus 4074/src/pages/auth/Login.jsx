import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bus, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import VignanLogo from '../../components/VignanLogo';
import { supabase } from '../../supabaseClient';

const Login = () => {
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (role === 'management') { navigate('/management'); return; }
        if (role === 'driver') { navigate('/driver'); return; }

        // Student: validate against Supabase students table
        setLoading(true);
        const inputName = email.trim().toUpperCase();
        const inputRoll = password.trim();

        const { data, error: dbError } = await supabase
            .from('students')
            .select('name, student_id, assigned_seat, total_fee, paid_amount, pending_amount')
            .eq('name', inputName)
            .eq('student_id', inputRoll)
            .single();

        setLoading(false);

        if (dbError || !data) {
            setError('Invalid Name or Roll Number. Please try again.');
            return;
        }

        localStorage.setItem('user', JSON.stringify({
            name: data.name,
            roll: data.student_id,
            seat: data.assigned_seat,
            totalFee: data.total_fee,
            paidAmount: data.paid_amount,
            pendingAmount: data.pending_amount,
            role: 'student'
        }));
        navigate('/student');
    };

    const roles = [
        { id: 'student', label: 'Student', icon: User },
        { id: 'driver', label: 'Driver', icon: Bus },
        { id: 'management', label: 'Management', icon: Briefcase },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans">
            {/* Left Panel */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="md:w-1/2 bg-gradient-to-br from-vignan-blue via-indigo-800 to-indigo-900 text-white flex flex-col justify-center items-center p-10 relative overflow-hidden"
            >
                {/* Animated Particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white/10"
                        style={{
                            width: `${40 + i * 30}px`,
                            height: `${40 + i * 30}px`,
                            top: `${10 + i * 12}%`,
                            left: `${5 + i * 15}%`,
                        }}
                        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
                    />
                ))}

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center relative z-10">
                    <motion.div variants={itemVariants} className="flex justify-center mb-6">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl">
                            <VignanLogo className="h-12" />
                        </div>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-4xl font-black tracking-tight mb-2">
                        <span className="text-vignan-cyan">TRANSPORT</span> PORTAL
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-blue-200 text-sm mb-2">
                        Vignan Institute of Technology & Science
                    </motion.p>

                    <motion.div variants={itemVariants}
                        className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-vignan-cyan font-bold px-4 py-1.5 rounded-full text-sm mb-8 tracking-wider"
                    >
                        EAMCET CODE: VGNT
                    </motion.div>

                    <motion.div variants={itemVariants} className="mt-6 flex items-center justify-center space-x-2 text-sm text-blue-200">
                        <ShieldCheck className="w-5 h-5 text-vignan-cyan" />
                        <span>Secure Role-Based Access</span>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Right Panel */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="md:w-1/2 bg-white flex flex-col justify-center items-center p-8"
            >
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-black text-gray-800 mb-1">Welcome Back</h2>
                    <p className="text-gray-400 text-sm mb-8">Select your role and sign in</p>

                    {/* Role Selector */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {roles.map(({ id, label, icon: Icon }) => (
                            <motion.button
                                key={id}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setRole(id)}
                                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${role === id
                                        ? 'border-vignan-blue bg-vignan-blue text-white shadow-lg shadow-blue-200'
                                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                                    }`}
                            >
                                <Icon className="w-6 h-6 mb-1" />
                                <span className="text-xs font-bold">{label}</span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        {role === 'student' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name (as in record)</label>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="e.g. JAKKALA PRAVEEN"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-vignan-blue outline-none transition-colors bg-gray-50 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Roll Number (Password)</label>
                                    <input
                                        type="text"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="e.g. 23891A7229"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-vignan-blue outline-none transition-colors bg-gray-50 font-mono"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                                        {role === 'driver' ? 'Driver ID' : 'Admin Email'}
                                    </label>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder={role === 'driver' ? 'Enter Driver ID' : 'Enter Email'}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-vignan-blue outline-none transition-colors bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-vignan-blue outline-none transition-colors bg-gray-50"
                                    />
                                </div>
                            </>
                        )}

                        {/* Error message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl font-medium"
                            >
                                ⚠️ {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-vignan-blue to-indigo-700 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-blue-200 disabled:opacity-60"
                        >
                            {loading ? (
                                <span>Verifying…</span>
                            ) : (
                                <>
                                    <span>Sign In as {roles.find(r => r.id === role)?.label}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
