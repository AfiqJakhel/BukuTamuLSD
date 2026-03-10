import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import GuestLayout from '../layouts/GuestLayout';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import Visitors from '../pages/admin/Visitors';

// Guest Pages
import GuestForm from '../pages/guest/GuestForm';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Admin Routes (Now Default) */}
                <Route path="/" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="visitors" element={<Visitors />} />
                </Route>

                {/* Guest Routes */}
                <Route path="/guest" element={<GuestLayout />}>
                    <Route index element={<GuestForm />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
