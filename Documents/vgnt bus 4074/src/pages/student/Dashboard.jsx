import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SeatLayout from '../../components/SeatLayout';
import VignanLogo from '../../components/VignanLogo';
import { LogOut, MapPin, Clock, CreditCard, Download, Navigation, Bus, ChevronRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabaseClient';

const BUS_ID = 'ddcd5b3a-fd05-4bbc-96e6-eeac9b19141f';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    const [student, setStudent] = useState({
        name: storedUser.name || 'Student',
        id: storedUser.roll || 'N/A',
        seat: storedUser.seat || 'N/A',
        busNumber: 'AP39 UW 4074',
        route: 'Rock Hills Colony Route',
        fees: {
            total: storedUser.totalFee || 25000,
            paid: storedUser.paidAmount || 0,
            pending: storedUser.pendingAmount || 0,
            status: (storedUser.pendingAmount || 0) === 0 ? 'Paid' : 'Partially Paid'
        }
    });

    const [routeStops, setRouteStops] = useState([
        { name: 'Rock Hills Colony', time: '07:15 AM', status: 'passed' },
        { name: 'GM Goud', time: '07:25 AM', status: 'passed' },
        { name: 'Komatireddy Prathik Reddy College', time: '07:35 AM', status: 'passed' },
        { name: 'Pedda Banda', time: '07:45 AM', status: 'passed' },
        { name: 'Clock Tower', time: '08:00 AM', status: 'next' },
        { name: 'VT Colony', time: '08:15 AM', status: 'future' },
        { name: 'Bandaru Gardens Road', time: '08:30 AM', status: 'future' },
        { name: 'Deshmukhi', time: '08:40 AM', status: 'future' },
        { name: 'VGNT College', time: '09:00 AM', status: 'future' }
    ]);

    const [busLocation, setBusLocation] = useState(null);
    const [busActive, setBusActive] = useState(false);
    const [occupiedSeats, setOccupiedSeats] = useState(['R2-L1', 'R3-R2', 'R12-1', 'R4-L1']);
    const [activeTab, setActiveTab] = useState('status');

    useEffect(() => {
        const fetchStudentData = async () => {
            if (!storedUser.roll) return;
            const { data } = await supabase
                .from('students')
                .select('name, student_id, assigned_seat, total_fee, paid_amount, pending_amount')
                .eq('student_id', storedUser.roll)
                .single();
            if (data) {
                setStudent({
                    name: data.name,
                    id: data.student_id,
                    seat: data.assigned_seat || 'N/A',
                    busNumber: 'AP39 UW 4074',
                    route: 'Rock Hills Colony Route',
                    fees: {
                        total: data.total_fee || 0,
                        paid: data.paid_amount || 0,
                        pending: data.pending_amount || 0,
                        status: (data.pending_amount || 0) === 0 ? 'Paid' : 'Partially Paid'
                    }
                });
            }

            const { data: routeData } = await supabase
                .from('routes')
                .select('stop_name, arrival_time, stop_order')
                .eq('bus_id', BUS_ID)
                .order('stop_order', { ascending: true });

            if (routeData && routeData.length > 0) {
                const now = new Date();
                const currentMinutes = now.getHours() * 60 + now.getMinutes();
                const stops = routeData.map(s => {
                    const [h, m] = s.arrival_time.split(':').map(Number);
                    const diff = (h * 60 + m) - currentMinutes;
                    let status = diff < -5 ? 'passed' : diff <= 15 ? 'next' : 'future';
                    const period = h >= 12 ? 'PM' : 'AM';
                    const displayH = h > 12 ? h - 12 : h;
                    return { name: s.stop_name, time: `${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`, status };
                });
                setRouteStops(stops);
            }
        };
        fetchStudentData();

        // Realtime bus tracking
        const initBus = async () => {
            const { data } = await supabase.from('buses').select('current_location, status').eq('id', BUS_ID).single();
            if (data) { setBusLocation(data.current_location || null); setBusActive(data.status === 'active'); }
        };
        initBus();

        const channel = supabase.channel('bus-location')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'buses', filter: `id=eq.${BUS_ID}` }, (payload) => {
                setBusLocation(payload.new.current_location || null);
                setBusActive(payload.new.status === 'active');
            }).subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const handleLogout = () => { navigate('/'); };

    const listContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const listItem = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <header className="sticky top-0 z-20 bg-white shadow-md">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <VignanLogo className="h-10" />
                    <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                        onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <LogOut className="w-5 h-5" />
                    </motion.button>
                </div>
                <div className="bg-vignan-blue text-white p-4 shadow-inner">
                    <div className="flex justify-between items-end">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <p className="text-vignan-accent text-xs font-bold uppercase tracking-wider mb-1">Student Dashboard</p>
                            <h1 className="text-xl font-bold">{student.name}</h1>
                            <p className="text-sm opacity-80">{student.id}</p>
                        </motion.div>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <div className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                                {student.busNumber}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            <motion.div layout className="p-4 space-y-4 max-w-md mx-auto">
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    {[{ id: 'status', label: 'Live Status', icon: Navigation }, { id: 'route', label: 'My Route', icon: MapPin }, { id: 'fees', label: 'Fee Details', icon: CreditCard }].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-3 px-2 flex flex-col items-center justify-center text-xs font-medium rounded-lg transition-all duration-300 relative ${isActive ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                                {isActive && <motion.div layoutId="activeTab" className="absolute inset-0 bg-vignan-blue rounded-lg shadow-md" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                                <span className="relative z-10 flex flex-col items-center"><Icon className="w-5 h-5 mb-1" />{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode='wait'>
                    {activeTab === 'status' && (
                        <motion.div key="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                            {/* Current Location Card */}
                            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl p-5 shadow-lg border-t-4 border-vignan-accent relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-vignan-blue/5 rounded-bl-full -mr-4 -mt-4"></div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <h2 className="text-gray-500 text-xs uppercase font-bold tracking-wider">Current Location</h2>
                                        <p className="text-xl font-bold text-gray-900 mt-1">Clock Tower</p>
                                    </div>
                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>On Time
                                    </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                    <MapPin className="w-4 h-4 mr-2 text-vignan-blue" /><span>Next Stop: VT Colony</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="w-4 h-4 mr-2 text-vignan-blue" /><span>ETA: 15 mins to College</span>
                                </div>
                            </motion.div>

                            {/* Driver Card */}
                            <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="relative">
                                        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop" alt="Driver" className="w-12 h-12 rounded-full object-cover border-2 border-vignan-blue shadow-sm" />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-[0.65rem] text-gray-500 font-bold uppercase tracking-wider">Bus Driver</p>
                                        <h3 className="text-sm font-bold text-gray-900 leading-tight">CH Srinu</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">+91 97055 41626</p>
                                    </div>
                                </div>
                                <motion.a whileTap={{ scale: 0.9 }} href="tel:+919705541626"
                                    className="bg-green-50 text-green-600 p-3 rounded-full hover:bg-green-100 transition-colors shadow-sm border border-green-100">
                                    <Phone className="w-5 h-5 fill-current" />
                                </motion.a>
                            </motion.div>

                            {/* Live Tracking Card */}
                            <motion.div whileHover={{ scale: 1.01 }} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 relative">
                                {busActive && busLocation ? (
                                    <>
                                        <div className="bg-gradient-to-r from-vignan-blue to-indigo-700 text-white p-4 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-sm flex items-center">
                                                    <span className="relative flex h-3 w-3 mr-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                    </span>
                                                    Live Tracking — Bus is Moving
                                                </h3>
                                                <p className="text-xs text-blue-200 mt-1 font-mono">📍 {busLocation.lat?.toFixed(5)}, {busLocation.lng?.toFixed(5)}</p>
                                            </div>
                                            <Bus className="w-8 h-8 opacity-30" />
                                        </div>
                                        <div className="p-4">
                                            <p className="text-xs text-gray-500 mb-3">Last updated: {busLocation.timestamp ? new Date(busLocation.timestamp).toLocaleTimeString() : 'Just now'}</p>
                                            <a href={`https://www.google.com/maps?q=${busLocation.lat},${busLocation.lng}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center bg-vignan-blue text-white text-sm font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors">
                                                <MapPin className="w-4 h-4 mr-2" />Open in Google Maps →
                                            </a>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-40 bg-gray-50 flex flex-col items-center justify-center text-center p-4">
                                        <Bus className="w-10 h-10 text-gray-300 mb-2" />
                                        <p className="text-sm font-bold text-gray-500">Bus Not Started Yet</p>
                                        <p className="text-xs text-gray-400 mt-1">Live tracking will appear once the driver starts their trip.</p>
                                    </div>
                                )}
                            </motion.div>

                            {/* Seat Info */}
                            <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-r from-vignan-blue to-indigo-900 rounded-xl p-5 shadow-lg text-white">
                                <h2 className="text-vignan-accent font-bold mb-2 text-sm uppercase">Assigned Seat</h2>
                                <div className="flex justify-between items-end">
                                    <span className="text-4xl font-bold">{student.seat}</span>
                                    <Bus className="w-12 h-12 opacity-20" />
                                </div>
                            </motion.div>

                            {/* Bus Layout */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                                <h2 className="text-gray-800 font-bold mb-4 flex items-center"><Bus className="w-5 h-5 mr-2 text-vignan-blue" /> Bus Layout</h2>
                                <div className="overflow-x-auto pb-2"><SeatLayout occupiedSeats={occupiedSeats} onSeatClick={() => { }} /></div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'route' && (
                        <motion.div key="route" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 p-4 border-b border-gray-100 sticky top-0 z-10">
                                <h2 className="text-lg font-bold text-gray-800">{student.route}</h2>
                                <p className="text-xs text-gray-500 font-medium">Bus No: {student.busNumber}</p>
                            </div>
                            <div className="p-4">
                                <motion.div variants={listContainer} initial="hidden" animate="show"
                                    className="relative border-l-2 border-vignan-blue/20 ml-2 space-y-0 py-2">
                                    {routeStops.map((stop, i) => (
                                        <motion.div key={i} variants={listItem} className="pl-8 relative pb-8 last:pb-0">
                                            <div className={`absolute -left-[9px] top-1 w-[18px] h-[18px] rounded-full border-4 z-10 ${stop.status === 'passed' ? 'bg-vignan-blue border-vignan-blue' : stop.status === 'next' ? 'bg-white border-vignan-accent' : 'bg-white border-gray-300'}`}></div>
                                            {stop.status === 'next' && (
                                                <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                                    className="absolute -left-[14px] -top-6 z-20 bg-vignan-yellow text-vignan-blue p-1 rounded-md shadow-lg border border-vignan-blue/10">
                                                    <Bus className="w-4 h-4" />
                                                </motion.div>
                                            )}
                                            <h3 className={`font-bold text-sm ${stop.status === 'passed' ? 'text-gray-900' : stop.status === 'next' ? 'text-vignan-blue text-base' : 'text-gray-400'}`}>{stop.name}</h3>
                                            <p className="text-xs text-gray-400 font-mono mt-1 flex items-center"><Clock className="w-3 h-3 mr-1" /> {stop.time}</p>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'fees' && (
                        <motion.div key="fees" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-4">
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-vignan-accent"></div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Academic Year 2024-25</p>
                                <motion.p initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    className="text-4xl font-extrabold text-vignan-blue">₹{student.fees.total.toLocaleString()}</motion.p>
                                <p className="text-sm text-gray-400 mt-1">Total Transport Fee</p>
                                <div className="mt-6 flex justify-center space-x-4 text-sm bg-gray-50 p-4 rounded-lg">
                                    <div className="text-center flex-1">
                                        <p className="text-green-600 font-bold text-lg">₹{student.fees.paid.toLocaleString()}</p>
                                        <p className="text-gray-500 text-xs uppercase font-bold">Paid</p>
                                    </div>
                                    <div className="w-px bg-gray-200"></div>
                                    <div className="text-center flex-1">
                                        <p className="text-red-600 font-bold text-lg">₹{student.fees.pending.toLocaleString()}</p>
                                        <p className="text-gray-500 text-xs uppercase font-bold">Due</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Quick Actions</h3>
                                <motion.button whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50 text-vignan-blue rounded-lg mb-2 transition-colors border border-transparent hover:border-vignan-blue group">
                                    <div className="flex items-center">
                                        <div className="bg-white p-2 rounded-full shadow-sm mr-3 group-hover:bg-vignan-blue group-hover:text-white transition-colors"><CreditCard className="w-5 h-5" /></div>
                                        <span className="font-bold">Pay Online</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-vignan-blue" />
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50 text-vignan-blue rounded-lg transition-colors border border-transparent hover:border-vignan-blue group">
                                    <div className="flex items-center">
                                        <div className="bg-white p-2 rounded-full shadow-sm mr-3 group-hover:bg-vignan-blue group-hover:text-white transition-colors"><Download className="w-5 h-5" /></div>
                                        <span className="font-bold">Download Receipt</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-vignan-blue" />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default StudentDashboard;
