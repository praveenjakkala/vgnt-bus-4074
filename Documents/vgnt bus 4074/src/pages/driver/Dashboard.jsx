import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Users, Navigation, CheckCircle, XCircle, Bus, Clock, LogOut } from 'lucide-react';
import VignanLogo from '../../components/VignanLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabaseClient';

const BUS_ID = 'ddcd5b3a-fd05-4bbc-96e6-eeac9b19141f';

// ✅ Real GPS coordinates for each route stop
const ROUTE_STOPS = [
    { id: 1, name: 'Rock Hills Colony', lat: 17.3688, lng: 78.4765, time: '07:15 AM', pickupCount: 12 },
    { id: 2, name: 'GM Goud', lat: 17.3740, lng: 78.4810, time: '07:25 AM', pickupCount: 8 },
    { id: 3, name: 'Komatireddy Prathik Reddy College', lat: 17.3792, lng: 78.4870, time: '07:35 AM', pickupCount: 5 },
    { id: 4, name: 'Pedda Banda', lat: 17.3845, lng: 78.4920, time: '07:45 AM', pickupCount: 15 },
    { id: 5, name: 'Clock Tower', lat: 17.3900, lng: 78.4960, time: '08:00 AM', pickupCount: 20 },
    { id: 6, name: 'VT Colony', lat: 17.3960, lng: 78.5010, time: '08:15 AM', pickupCount: 10 },
    { id: 7, name: 'Bandaru Gardens Road', lat: 17.4020, lng: 78.5060, time: '08:30 AM', pickupCount: 5 },
    { id: 8, name: 'Deshmukhi', lat: 17.4080, lng: 78.5110, time: '08:40 AM', pickupCount: 3 },
    { id: 9, name: 'VGNT College', lat: 17.4150, lng: 78.5180, time: '09:00 AM', pickupCount: 0 },
];

// Calculate distance between two GPS points in meters (Haversine formula)
const getDistanceMeters = (lat1, lng1, lat2, lng2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Determine stop statuses based on driver GPS position
const computeStopStatuses = (lat, lng) => {
    let closestIdx = 0;
    let minDist = Infinity;

    // Find the closest stop
    ROUTE_STOPS.forEach((stop, i) => {
        const dist = getDistanceMeters(lat, lng, stop.lat, stop.lng);
        if (dist < minDist) { minDist = dist; closestIdx = i; }
    });

    // Decide: if driver is within 300m of a stop, that stop is "next", all before are "passed"
    return ROUTE_STOPS.map((stop, i) => ({
        ...stop,
        status: i < closestIdx ? 'passed' : i === closestIdx ? 'next' : 'future'
    }));
};

const DriverDashboard = () => {
    const [isTracking, setIsTracking] = useState(false);
    const [activeTab, setActiveTab] = useState('route');
    const [gpsStatus, setGpsStatus] = useState('idle');
    const [currentCoords, setCurrentCoords] = useState(null);
    const [stops, setStops] = useState(ROUTE_STOPS.map((s, i) => ({ ...s, status: i === 0 ? 'next' : 'future' })));
    const watchIdRef = useRef(null);

    const [attendance, setAttendance] = useState([
        { id: 'S001', name: 'Ravi Kumar', stop: 'Rock Hills Colony', status: 'present' },
        { id: 'S002', name: 'Sneha Reddy', stop: 'Clock Tower', status: 'pending' },
        { id: 'S003', name: 'Amit Sharma', stop: 'VT Colony', status: 'pending' },
        { id: 'S004', name: 'Praveen J', stop: 'Rock Hills Colony', status: 'present' },
        { id: 'S005', name: 'Rahul V', stop: 'Pedda Banda', status: 'absent' },
    ]);

    const toggleAttendance = (id) => {
        setAttendance(prev => prev.map(s =>
            s.id === id ? { ...s, status: s.status === 'present' ? 'pending' : 'present' } : s
        ));
    };

    // Push GPS location + stop statuses to Supabase
    const pushLocationToSupabase = async (lat, lng, updatedStops) => {
        const nextStop = updatedStops.find(s => s.status === 'next');
        const passedCount = updatedStops.filter(s => s.status === 'passed').length;

        await supabase.from('buses').update({
            current_location: {
                lat,
                lng,
                timestamp: new Date().toISOString(),
                nextStop: nextStop?.name || 'VGNT College',
                passedStops: passedCount,
                stopStatuses: updatedStops.map(s => ({ id: s.id, status: s.status }))
            },
            status: 'active'
        }).eq('id', BUS_ID);
    };

    const startTracking = () => {
        if (!navigator.geolocation) { setGpsStatus('error'); return; }
        setGpsStatus('locating');
        setIsTracking(true);

        watchIdRef.current = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                setCurrentCoords({ lat, lng });
                setGpsStatus('active');

                // ✅ Auto-update stops based on GPS position
                const updatedStops = computeStopStatuses(lat, lng);
                setStops(updatedStops);

                await pushLocationToSupabase(lat, lng, updatedStops);
            },
            () => setGpsStatus('error'),
            { enableHighAccuracy: true, maximumAge: 4000, timeout: 10000 }
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
        setStops(ROUTE_STOPS.map((s, i) => ({ ...s, status: i === 0 ? 'next' : 'future' })));
        await supabase.from('buses').update({ status: 'inactive', current_location: null }).eq('id', BUS_ID);
    };

    useEffect(() => {
        return () => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); };
    }, []);

    const gpsStatusConfig = {
        idle: { color: 'text-gray-500', bg: 'bg-gray-400', label: 'Offline' },
        locating: { color: 'text-yellow-600', bg: 'bg-yellow-400', label: 'Getting GPS…' },
        active: { color: 'text-green-600', bg: 'bg-green-500', label: 'Live GPS Active' },
        error: { color: 'text-red-600', bg: 'bg-red-500', label: 'GPS Error' },
    };

    const nextStop = stops.find(s => s.status === 'next');
    const passedCount = stops.filter(s => s.status === 'passed').length;

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-100">
                <div className="p-4 flex justify-between items-center max-w-xl mx-auto">
                    <VignanLogo className="h-8" />
                    <div className="flex items-center space-x-2">
                        <span className="relative flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${gpsStatusConfig[gpsStatus].bg}`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${gpsStatusConfig[gpsStatus].bg}`}></span>
                        </span>
                        <span className={`text-xs font-bold uppercase ${gpsStatusConfig[gpsStatus].color}`}>
                            {gpsStatusConfig[gpsStatus].label}
                        </span>
                    </div>
                </div>

                {/* Trip Bar */}
                <div className="bg-gradient-to-r from-vignan-blue to-indigo-700 text-white px-4 py-3 shadow-inner">
                    <div className="flex justify-between items-center max-w-xl mx-auto">
                        <div>
                            <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Bus</p>
                            <p className="font-bold flex items-center text-sm"><Bus className="w-4 h-4 mr-1.5" />AP39 UW 4074</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Stops Done</p>
                            <p className="font-bold text-sm">{passedCount} / {stops.length}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Next Stop</p>
                            <p className="font-bold text-sm flex items-center justify-end">
                                <Navigation className="w-3 h-3 mr-1" />
                                {nextStop?.name?.split(' ')[0] || 'VGNT'}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-4 space-y-4 max-w-xl mx-auto">
                {/* START / STOP Button */}
                <motion.button whileTap={{ scale: 0.98 }}
                    onClick={isTracking ? stopTracking : startTracking}
                    className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center shadow-lg transition-all ${isTracking ? 'bg-red-500 text-white' : 'bg-gradient-to-r from-vignan-blue to-indigo-700 text-white'
                        }`}>
                    <Navigation className={`w-5 h-5 mr-2 ${!isTracking ? 'animate-pulse' : ''}`} />
                    {isTracking ? '⏹  STOP TRIP & GPS' : '▶  START TRIP — Enable GPS'}
                </motion.button>

                {/* GPS Info Card */}
                <AnimatePresence>
                    {isTracking && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <p className="text-sm font-bold text-green-800 mb-1">📡 GPS Active — Students See You Live</p>
                            {gpsStatus === 'locating' && <p className="text-xs text-yellow-600">Acquiring GPS signal…</p>}
                            {currentCoords && (
                                <div className="mt-2 bg-white rounded-lg p-2.5 border border-green-100">
                                    <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Live Coordinates</p>
                                    <p className="text-xs text-green-700 font-mono">Lat: {currentCoords.lat.toFixed(6)}</p>
                                    <p className="text-xs text-green-700 font-mono">Lng: {currentCoords.lng.toFixed(6)}</p>
                                    {nextStop && (
                                        <p className="text-xs text-vignan-blue font-bold mt-2 border-t border-green-100 pt-2">
                                            🚌 Heading to: {nextStop.name} ({nextStop.time})
                                        </p>
                                    )}
                                </div>
                            )}
                            {gpsStatus === 'error' && (
                                <p className="text-xs text-red-600 mt-1">⚠️ GPS denied — enable location in Chrome settings → Site Settings → Location</p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tabs */}
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    {[{ id: 'route', label: 'Route', icon: MapPin }, { id: 'students', label: 'Attendance', icon: Users }].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-3 px-2 flex items-center justify-center text-xs font-bold rounded-lg relative transition-all ${isActive ? 'text-white' : 'text-gray-500'}`}>
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
                            <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="font-bold text-gray-800 flex items-center text-sm">
                                    <MapPin className="w-4 h-4 mr-2 text-vignan-blue" /> Route Stops
                                </h2>
                                <span className="text-xs text-gray-400 font-medium">{passedCount} passed · {stops.length - passedCount - 1} ahead</span>
                            </div>
                            <motion.div variants={containerVariants} initial="hidden" animate="show"
                                className="relative border-l-2 border-vignan-blue/20 ml-8 py-4 space-y-0">
                                {stops.map((stop, i) => (
                                    <motion.div key={i} variants={itemVariants} className="pl-6 relative pb-6 last:pb-0">
                                        {/* Status dot */}
                                        <div className={`absolute -left-[9px] top-1 w-[18px] h-[18px] rounded-full border-4 z-10 ${stop.status === 'passed' ? 'bg-vignan-blue border-vignan-blue' :
                                                stop.status === 'next' ? 'bg-white border-vignan-cyan animate-pulse' :
                                                    'bg-white border-gray-300'
                                            }`} />
                                        {/* Bus icon on next stop */}
                                        {stop.status === 'next' && (
                                            <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                                                className="absolute -left-[16px] -top-6 z-20 bg-vignan-blue text-white p-1 rounded-md shadow-lg">
                                                <Bus className="w-3 h-3" />
                                            </motion.div>
                                        )}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className={`font-bold text-sm ${stop.status === 'next' ? 'text-vignan-blue text-base' :
                                                        stop.status === 'passed' ? 'text-gray-500 line-through' : 'text-gray-400'
                                                    }`}>{stop.name}</h3>
                                                <p className="text-xs text-gray-400 font-mono mt-0.5 flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />{stop.time}
                                                    {stop.status === 'passed' && <span className="ml-2 text-green-600 font-bold">✓ Passed</span>}
                                                </p>
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stop.status === 'passed' ? 'bg-gray-100 text-gray-400' :
                                                    stop.status === 'next' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-50 text-gray-300'
                                                }`}>{stop.pickupCount} stu.</span>
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
                                <h2 className="font-bold text-gray-800 text-sm flex items-center"><Users className="w-4 h-4 mr-2 text-vignan-blue" /> Attendance</h2>
                                <div className="flex space-x-3 text-xs font-bold">
                                    <span className="text-green-600">{attendance.filter(s => s.status === 'present').length} ✓</span>
                                    <span className="text-red-500">{attendance.filter(s => s.status === 'absent').length} ✗</span>
                                </div>
                            </div>
                            <motion.div variants={containerVariants} initial="hidden" animate="show" className="divide-y divide-gray-50">
                                {attendance.map(s => (
                                    <motion.div key={s.id} variants={itemVariants} className="flex items-center justify-between p-4 hover:bg-gray-50/80">
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">{s.name}</p>
                                            <p className="text-xs text-gray-400 flex items-center mt-0.5">
                                                <MapPin className="w-3 h-3 mr-1" />{s.stop}
                                            </p>
                                        </div>
                                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleAttendance(s.id)}
                                            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold ${s.status === 'present' ? 'bg-green-100 text-green-700' :
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
