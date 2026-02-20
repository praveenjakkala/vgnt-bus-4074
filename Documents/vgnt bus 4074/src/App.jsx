import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import StudentDashboard from './pages/student/Dashboard';
import DriverDashboard from './pages/driver/Dashboard';
import ManagementDashboard from './pages/management/Dashboard';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/driver" element={<DriverDashboard />} />
                <Route path="/management" element={<ManagementDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
