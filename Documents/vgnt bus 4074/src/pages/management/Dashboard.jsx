import React, { useState, useEffect } from 'react';
import { Users, Bus, AlertTriangle, CreditCard, Search, Map, ExternalLink, Activity, DollarSign } from 'lucide-react';
import SeatLayout from '../../components/SeatLayout';
import VignanLogo from '../../components/VignanLogo';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';

const ManagementDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');

    const [stats, setStats] = useState({ totalStudents: 0, totalBuses: 1, pendingFees: 0, activeAlerts: 0 });
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(true);

    const buses = [
        { id: 'B001', number: 'AP39 UW 4074', driver: 'CH Srinu', mobile: '9705541626', capacity: 57, route: 'Rock Hills Colony', status: 'Active' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const { data: studentData } = await supabase
                .from('students')
                .select('name, student_id, assigned_seat, pending_amount, paid_amount, total_fee');
            if (studentData) {
                const totalPending = studentData.reduce((sum, s) => sum + (parseFloat(s.pending_amount) || 0), 0);
                setStats(prev => ({ ...prev, totalStudents: studentData.length, pendingFees: totalPending }));
                setStudents(studentData.map(s => ({
                    id: s.student_id, name: s.name,
                    feeStatus: (s.pending_amount || 0) === 0 ? 'Paid' : 'Pending',
                    pending: s.pending_amount || 0, route: 'Rock Hills Colony'
                })));
            }
            setLoadingStudents(false);
        };
        fetchData();
    }, []);

    const [occupiedSeats, setOccupiedSeats] = useState(['R2-L1', 'R3-R2', 'R12-1']);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, type: "spring", stiffness: 100 } })
    };

    const AnimatedCounter = ({ value, prefix = '' }) => <span>{prefix}{value.toLocaleString()}</span>;

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderOverview = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-vignan-blue', bg: 'bg-indigo-50' },
                    { label: 'Total Buses', value: stats.totalBuses, icon: Bus, color: 'text-vignan-cyan', bg: 'bg-cyan-50' },
                    { label: 'Pending Fees', value: stats.pendingFees, icon: DollarSign, color: 'text-red-500', bg: 'bg-red-50', isCurrency: true },
                    { label: 'Active Alerts', value: stats.activeAlerts, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50' },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-vignan-blue to-vignan-cyan opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <p className="text-2xl font-black text-gray-900">
                                {stat.isCurrency ? `₹${(stat.value / 1000).toFixed(0)}K` : <AnimatedCounter value={stat.value} />}
                            </p>
                            <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Fleet Status */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-vignan-blue to-vignan-cyan"></div>
                <div className="p-6 flex justify-between items-center bg-gray-50/50 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        <span className="relative flex h-3 w-3 mr-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Live Fleet Control
                    </h3>
                </div>
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80" alt="Map"
                        className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/50 flex items-center">
                            <Map className="w-5 h-5 mr-3 text-vignan-blue" />
                            <span className="text-sm font-bold text-gray-600">Real-time GPS tracking enabled</span>
                        </div>
                    </div>
                    <motion.div animate={{ x: [0, 100, 200], y: [0, -20, 10] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/4 bg-vignan-blue text-white p-2 rounded-full shadow-xl border-2 border-white z-10">
                        <Bus className="w-5 h-5" />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );

    const renderStudents = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
                <Search className="w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search by name or roll number..." value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full outline-none text-sm text-gray-700 placeholder-gray-400" />
            </div>
            {loadingStudents ? (
                <div className="p-8 text-center text-gray-400 text-sm">Loading students...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                            <tr>
                                <th className="p-4 text-left">Student Name</th>
                                <th className="p-4 text-left">Roll No</th>
                                <th className="p-4 text-left">Fee Status</th>
                                <th className="p-4 text-left">Pending</th>
                                <th className="p-4 text-left">Route</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStudents.map((s, i) => (
                                <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                                    className="hover:bg-gray-50/80 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{s.name}</td>
                                    <td className="p-4 font-mono text-gray-500 text-xs">{s.id}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.feeStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                            {s.feeStatus}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">₹{s.pending.toLocaleString()}</td>
                                    <td className="p-4 text-gray-500 text-xs">{s.route}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderBuses = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                    <tr>
                        <th className="p-4 text-left">Bus Number</th>
                        <th className="p-4 text-left">Driver</th>
                        <th className="p-4 text-left">Mobile</th>
                        <th className="p-4 text-left">Route</th>
                        <th className="p-4 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {buses.map((b, i) => (
                        <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/80 transition-colors">
                            <td className="p-4 font-bold text-vignan-blue">{b.number}</td>
                            <td className="p-4 font-medium text-gray-900">{b.driver}</td>
                            <td className="p-4 text-gray-500 font-mono text-xs">{b.mobile}</td>
                            <td className="p-4 text-gray-600 text-xs">{b.route}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${b.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {b.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'buses', label: 'Fleet', icon: Bus },
        { id: 'seats', label: 'Seat Map', icon: Map },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-100">
                <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
                    <VignanLogo className="h-10" />
                    <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Management Portal</p>
                        <p className="text-sm font-black text-vignan-blue">VGNT Bus 4074</p>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-4">
                {/* Tab Bar */}
                <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 mb-6 overflow-x-auto">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${isActive ? 'bg-vignan-blue text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>
                                <Icon className="w-4 h-4" /><span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'students' && renderStudents()}
                {activeTab === 'buses' && renderBuses()}
                {activeTab === 'seats' && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="font-bold text-gray-800 mb-4 flex items-center"><Bus className="w-5 h-5 mr-2 text-vignan-blue" /> Bus AP39 UW 4074 — Seat Map</h2>
                        <SeatLayout occupiedSeats={occupiedSeats} onSeatClick={() => { }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagementDashboard;
