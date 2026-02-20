import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Users, Navigation, CheckCircle, XCircle, Bus, Clock, LogOut, Shield } from 'lucide-react';
import VignanLogo from '../../components/VignanLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabaseClient';

const BUS_ID = 'ddcd5b3a-fd05-4bbc-96e6-eeac9b19141f';

const DriverDashboard = () => {
    const [isTracking, setIsTracking] = useState(false);
    const [activeTab, setActiveTab] = useState('route');
    const [gpsStatus, setGpsStatus] = useState('idle');
    const [currentCoords, setCurrentCoords] = useState(null);
    const watchIdRef = useRef(null);

    const route = {
        name: 'Rock Hills Colony Route',
        busNumber: 'AP39 UW 4074',
        stops: [
            { id: 1, name: 'Rock Hills Colony', time: '07:15 AM', pickupCount: 12, status: 'passed' },
            { id: 2, name: 'GM Goud', time: '07:25 AM', pickupCount: 8, status: 'passed' },
            { id: 3, name: 'Komatireddy Prathik Reddy College', time: '07:35 AM', pickupCount: 5, status: 'passed' },
            { id: 4, name: 'Pedda Banda', time: '07:45 AM', pickupCount: 15, status: 'passed' },
            { id: 5, name: 'Clock Tower', time: '08:00 AM', pickupCount: 20, status: 'next' },
            { id: 6, name: 'VT Colony', time: '08:15 AM', pickupCount: 10, status: 'future' },
            { id: 7, name: 'Bandaru Gardens Road', time: '08:30 AM', pickupCount: 5, status: 'future' },
            { id: 8, name: 'Deshmukhi', time: '08:40 AM', pickupCount: 3, status: 'future' },
            { id: 9, name: 'VGNT College', time: '09:00 AM', pickupCount: 0, status: 'future' }
        ]
    };

    const [attendance, setAttendance] = useState([
        { id: 'S001', name: 'Ravi Kumar', stop: 'Rock Hills Colony', status: 'present' },
        { id: 'S002', name: 'Sneha Reddy', stop: 'Clock Tower', status: 'pending' },
        { id: 'S003', name: 'Amit Sharma', stop: 'VT Colony', status: 'pending' },
        { id: 'S004', name: 'Praveen J', stop: 'Rock Hills Colony', status: 'present' },
        { id: 'S005', name: 'Rahul V', stop: 'Pedda Banda', status: 'absent' },
    ]);

    const toggleAttendance = (id) => {
        setAttendance(attendance.map(s =>
            s.id === id ? { ...s, status: s.status === 'present' ? 'pending' : 'present' } : s
        ));
    };

    const pushLocationToSupabase = async (lat, lng) => {
        await supabase
            .from('buses')
            .update({
                current_location: { lat, lng, timestamp: new Date().toISOString() },
                status: 'active'
            })
            .eq('id', BUS_ID);
    };

    const startTracking = () => {
        if (!navigator.geolocation) { setGpsStatus('error'); return; }
        setGpsStatus('locating');
        setIsTracking(true);
        watchIdRef.current = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentCoords({ lat: latitude, lng: longitude });
                setGpsStatus('active');
                await pushLocationToSupabase(latitude, longitude);
            },
            () => setGpsStatus('error'),
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );
    };

    const stopTracking = async () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setIsTracking(false);
        setGpsStatus('idle');
        setCurrentCoords(null);
        await supabase.from('buses').update({ status: 'inactive', current_location: null }).eq('id', BUS_ID);
    };

    useEffect(() => {
        return () => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); };
    }, []);

    const gpsStatusConfig = {
        idle: { color: 'text-gray-500', bg: 'bg-gray-400', label: 'Offline' },
        locating: { color: 'text-yellow-600', bg: 'bg-yellow-400', label: 'Getting GPS…' },
        active: { color: 'text-green-600', bg: 'bg-green-500', label: 'Live Tracking On' },
        error: { color: 'text-red-600', bg: 'bg-red-500', label: 'GPS Error' },
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-100">
                <div className="p-4 flex justify-between items-center">
                    <VignanLogo className="h-8" />
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center space-x-2">
                        <span className="relative flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${gpsStatusConfig[gpsStatus].bg}`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${gpsStatusConfig[gpsStatus].bg}`}></span>
                        </span>
                        <span className={`text-xs font-bold uppercase ${gpsStatusConfig[gpsStatus].color}`}>
                            {gpsStatusConfig[gpsStatus].label}
                        </span>
                    </motion.div>
                </div>
                <div className="bg-vignan-blue text-white px-4 py-3 shadow-inner">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Current Trip</p>
                            <p className="font-bold flex items-center"><Bus className="w-4 h-4 mr-1.5" />{route.busNumber}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Route</p>
                            <p className="font-bold flex items-center justify-end"><Navigation className="w-4 h-4 mr-1.5" />{route.name.substring(0, 18)}...</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-4 space-y-4 max-w-xl mx-auto">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={isTracking ? stopTracking : startTracking}
                    className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center shadow-lg transition-all ${isTracking ? 'bg-red-500 text-white' : 'bg-gradient-to-r from-vignan-blue to-indigo-700 text-white'
                        }`}
                >
                    <Navigation className={`w-5 h-5 mr-2 ${isTracking ? '' : 'animate-pulse'}`} />
                    {isTracking ? '⏹  STOP TRIP & GPS' : '▶  START TRIP Now'}
                </motion.button>

                <AnimatePresence>
                    {isTracking && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start space-x-3">
                            <MapPin className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-green-800">📡 GPS Active — Students Can See You</p>
                                {gpsStatus === 'locating' && <p className="text-xs text-green-600 mt-1">Getting your location…</p>}
                                {currentCoords && <p className="text-xs text-green-600 font-mono mt-1">{currentCoords.lat.toFixed(5)}, {currentCoords.lng.toFixed(5)}</p>}
                                {gpsStatus === 'error' && <p className="text-xs text-red-600 mt-1">⚠️ GPS permission denied. Enable location in browser settings.</p>}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    {[{ id: 'route', label: 'Route Timeline', icon: MapPin }, { id: 'students', label: 'Student List', icon: Users }].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-3 px-2 flex items-center justify-center text-xs font-bold rounded-lg relative transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                {isActive && <motion.div layoutId="driverTab" className="absolute inset-0 bg-vignan-blue rounded-lg shadow" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />}
                                <span className="relative z-10 flex items-center"><Icon className="w-4 h-4 mr-1.5" />{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'route' && (
                        <motion.div key="route" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 p-4 border-b border-gray-100">
                                <h2 className="font-bold text-gray-800 flex items-center"><MapPin className="w-4 h-4 mr-2 text-vignan-blue" /> Route Stops</h2>
                            </div>
                            <motion.div variants={containerVariants} initial="hidden" animate="show"
                                className="p-4 relative border-l-2 border-vignan-blue/20 ml-6 space-y-0 py-2">
                                {route.stops.map((stop, i) => (
                                    <motion.div key={i} variants={itemVariants} className="pl-6 relative pb-6 last:pb-0">
                                        <div className={`absolute -left-[9px] top-1 w-[18px] h-[18px] rounded-full border-4 z-10 ${stop.status === 'passed' ? 'bg-vignan-blue border-vignan-blue' :
                                                stop.status === 'next' ? 'bg-vignan-yellow border-vignan-accent animate-pulse' : 'bg-white border-gray-300'
                                            }`} />
                                        {stop.status === 'next' && (
                                            <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                                                className="absolute -left-[14px] -top-5 z-20 bg-vignan-blue text-white p-1 rounded-md shadow-lg">
                                                <Bus className="w-3 h-3" />
                                            </motion.div>
                                        )}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className={`font-bold text-sm ${stop.status === 'next' ? 'text-vignan-blue text-base' : stop.status === 'passed' ? 'text-gray-700' : 'text-gray-400'}`}>{stop.name}</h3>
                                                <p className="text-xs text-gray-400 font-mono mt-0.5 flex items-center"><Clock className="w-3 h-3 mr-1" />{stop.time}</p>
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stop.status === 'passed' ? 'bg-vignan-blue/10 text-vignan-blue' : stop.status === 'next' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-400'}`}>
                                                {stop.pickupCount} Students
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                    {activeTab === 'students' && (
                        <motion.div key="students" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between">
                                <h2 className="font-bold text-gray-800 flex items-center"><Users className="w-4 h-4 mr-2 text-vignan-blue" /> Attendance</h2>
                                <div className="flex space-x-3 text-xs font-bold">
                                    <span className="text-green-600">{attendance.filter(s => s.status === 'present').length} Present</span>
                                    <span className="text-red-500">{attendance.filter(s => s.status === 'absent').length} Absent</span>
                                </div>
                            </div>
                            <motion.div variants={containerVariants} initial="hidden" animate="show" className="divide-y divide-gray-50">
                                {attendance.map(s => (
                                    <motion.div key={s.id} variants={itemVariants} className="flex items-center justify-between p-4 hover:bg-gray-50/80">
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">{s.name}</p>
                                            <p className="text-xs text-gray-400 flex items-center mt-0.5"><MapPin className="w-3 h-3 mr-1" />{s.stop}</p>
                                        </div>
                                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleAttendance(s.id)}
                                            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${s.status === 'present' ? 'bg-green-100 text-green-700' :
                                                    s.status === 'absent' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                            {s.status === 'present' ? <CheckCircle className="w-3 h-3" /> : s.status === 'absent' ? <XCircle className="w-3 h-3" /> : null}
                                            <span className="capitalize">{s.status}</span>
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DriverDashboard;
