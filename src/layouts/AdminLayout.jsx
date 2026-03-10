import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminLayout = () => {
    const location = useLocation();

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/':
                return { title: 'Dashboard', subtitle: 'Ringkasan data pengunjung laboratorium hari ini' };
            case '/visitors':
                return { title: 'Data Pengunjung', subtitle: 'Kelola seluruh daftar pengunjung dengan mudah' };
            default:
                return { title: 'Admin Panel', subtitle: 'Halaman Administrasi Buku Tamu Lab' };
        }
    };

    const { title, subtitle } = getPageTitle();

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
            <Sidebar />
            <div className="flex-1 ml-72 flex flex-col min-h-screen">
                <Navbar title={title} subtitle={subtitle} />
                <main className="p-10 flex-1 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
