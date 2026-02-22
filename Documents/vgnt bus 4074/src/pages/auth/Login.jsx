import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bus, Briefcase, ArrowRight, ShieldCheck, Mail, Lock, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VignanLogo from '../../components/VignanLogo';
import { supabase } from '../../supabaseClient';

const Login = () => {
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const moveX = (clientX - window.innerWidth / 2) / 50;
        const moveY = (clientY - window.innerHeight / 2) / 50;
        setMousePos({ x: moveX, y: moveY });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (role === 'management') { navigate('/management'); return; }
        if (role === 'driver') { navigate('/driver'); return; }

        setLoading(true);
        const inputName = email.trim().toUpperCase();
        const inputRoll = password.trim();

        const { data, error: dbError } = await supabase
            .from('students')
            .select('*')
            .eq('name', inputName)
            .eq('student_id', inputRoll)
            .single();

        setLoading(false);

        if (dbError || !data) {
            setError('Verification failed. Please check your credentials.');
            return;
        }

        localStorage.setItem('user', JSON.stringify({ ...data, role: 'student' }));
        navigate('/student');
    };

    const roles = [
        { id: 'student', label: 'Student', icon: UserCircle, color: 'from-blue-600 to-indigo-700' },
        { id: 'driver', label: 'Driver', icon: Bus, color: 'from-cyan-500 to-blue-600' },
        { id: 'management', label: 'Management', icon: Briefcase, color: 'from-indigo-600 to-purple-700' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col md:flex-row font-sans selection:bg-vignan-cyan/30"
            onMouseMove={handleMouseMove}
        >
            {/* Left Panel - Immersive Branding */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="md:w-[55%] relative flex flex-col justify-center items-center p-12 overflow-hidden bg-[#2D31A6]"
            >
                {/* Visual Background - Vibrant Blue 30/70 Split */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/background-new.jpg"
                        className="w-full h-full object-cover opacity-30"
                        style={{ objectPosition: 'center 40%' }}
                        alt="Vignan Campus"
                    />
                    {/* Professional Blue Shading Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2D31A6] via-[#2F34B3]/90 to-transparent mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-[#2D31A6]/50 backdrop-blur-[1px]"></div>
                </div>

                {/* Floating Glows */}
                <div className="absolute inset-0 z-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                            x: [0, 30, 0],
                            y: [0, -20, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-cyan-400/20 blur-[120px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.5, 0.2],
                            x: [0, -30, 0],
                            y: [0, 30, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, delay: 2 }}
                        className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-blue-500/15 blur-[150px] rounded-full"
                    />
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 w-full max-w-xl"
                >
                    <motion.div variants={itemVariants} className="inline-flex mb-12">
                        <div className="glass-morphism p-5 rounded-[2rem] border border-white/20 shadow-2xl">
                            <VignanLogo />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-10">
                        <h1 className="text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-center">
                            <span className="text-[#00E5FF] drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">TRANSPORT</span> <br />
                            <span className="text-white">PORTAL</span>
                        </h1>

                        <p className="text-blue-50 text-2xl font-bold tracking-tight opacity-95 text-center">
                            Vignan Institute of Technology & Science
                        </p>

                        <div className="pt-10 flex flex-col items-center gap-10">
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                className="px-10 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/20 shadow-xl"
                            >
                                <span className="text-[#00E5FF] font-black text-xl tracking-[0.2em] uppercase">
                                    EAMCET CODE: VGNT
                                </span>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="flex items-center space-x-4 opacity-90"
                            >
                                <ShieldCheck className="w-8 h-8 text-[#00E5FF]" />
                                <span className="text-white font-bold tracking-wide text-xl uppercase text-center">Secure Role-Based Access</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Footer Attribution */}
                <div className="absolute bottom-12 left-12 z-10 hidden lg:block">
                    <div className="flex items-center space-x-4 opacity-50 transition-opacity hover:opacity-100">
                        <div className="h-px w-12 bg-white"></div>
                        <p className="text-white text-[10px] uppercase tracking-[5px] font-black">VGNT CAMPUS PORTAL V2.0</p>
                    </div>
                </div>
            </motion.div >

            {/* Right Panel - Premium Form */}
            < motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="md:w-[45%] bg-white flex flex-col justify-center items-center p-12 lg:p-24 relative overflow-hidden"
            >
                <div className="w-full max-w-md relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2 className="text-4xl font-black text-slate-900 mb-2">Welcome Back</h2>
                        <p className="text-slate-400 font-medium mb-12">Empowering your journey with technology.</p>
                    </motion.div>

                    {/* Premium Role Selector */}
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        {roles.map(({ id, label, icon: Icon, color }) => (
                            <motion.button
                                key={id}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setRole(id)}
                                className={`group flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${role === id
                                    ? `border-transparent bg-gradient-to-br ${color} text-white shadow-2xl shadow-blue-200/50 scale-105 z-10`
                                    : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:bg-white'
                                    }`}
                            >
                                {role === id && (
                                    <motion.div
                                        layoutId="activeRole"
                                        className="absolute inset-0 bg-white/10 opacity-50"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <Icon className={`w-7 h-7 mb-2 transition-transform duration-300 ${role === id ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
                            </motion.button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={role}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleLogin}
                            className="space-y-6"
                        >
                            <div className="space-y-5">
                                <div className="group relative">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
                                        {role === 'student' ? 'Full Name' : role === 'driver' ? 'Driver ID' : 'Admin Email'}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            {role === 'management' ? <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-vignan-blue transition-colors" /> : <User className="h-5 w-5 text-slate-300 group-focus-within:text-vignan-blue transition-colors" />}
                                        </div>
                                        <input
                                            type={role === 'management' ? 'email' : 'text'}
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder={role === 'student' ? 'e.g. JAKKALA PRAVEEN' : role === 'driver' ? 'Enter Driver ID' : 'admin@vignan.ac.in'}
                                            required
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-vignan-blue outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="group relative">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
                                        {role === 'student' ? 'Roll Number / Password' : 'Password'}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-vignan-blue transition-colors" />
                                        </div>
                                        <input
                                            type={role === 'student' ? 'text' : 'password'}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder={role === 'student' ? 'e.g. 23891A7229' : '••••••••'}
                                            required
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-vignan-blue outline-none transition-all font-bold text-slate-800 font-mono tracking-widest placeholder:text-slate-300 placeholder:tracking-normal"
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50/50 backdrop-blur-sm border border-red-100 text-red-600 text-xs px-5 py-4 rounded-2xl font-bold flex items-center space-x-3 shadow-sm"
                                >
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className={`shimmer w-full py-4 rounded-2x rounded-2xl font-black text-sm text-white flex items-center justify-center space-x-3 shadow-2xl transition-all disabled:opacity-70 bg-gradient-to-r ${roles.find(r => r.id === role)?.color}`}
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>AUTHENTICATING...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>SECURE SIGN IN</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>

                            <div className="pt-4 text-center">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">
                                    Trusted by <span className="text-slate-900">5000+ Students</span> Daily
                                </p>
                            </div>
                        </motion.form>
                    </AnimatePresence>
                </div>

                {/* Decorative BG for Right Panel */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full blur-3xl -mr-32 -mt-32 -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50/50 rounded-full blur-3xl -ml-32 -mb-32 -z-10" />
            </motion.div >
        </div >
    );
};

export default Login;
