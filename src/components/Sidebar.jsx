import { NavLink, useNavigate } from 'react-router-dom';
import { Database, LayoutDashboard, Users, UserPlus } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <aside className="w-72 bg-gradient-to-b from-[#040b16] to-[#0a2342] text-blue-100 flex flex-col h-screen fixed z-20 transition-all duration-300 shadow-xl shadow-blue-900/20 border-r border-blue-900/50">
            <div className="p-6 flex items-center gap-3 text-xl font-bold text-white border-b border-blue-500/30">
                <img src="/src/assets/images/logo lsd.png" alt="Logo LSD" className="h-8 object-contain" />
                <span>LabVisitor</span>
            </div>

            <nav className="flex-1 p-6 flex flex-col gap-2">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-white/10 text-blue-100 hover:text-white'}`}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>
                <NavLink
                    to="/visitors"
                    className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-white/10 text-blue-100 hover:text-white'}`}
                >
                    <Users size={20} />
                    Data Pengunjung
                </NavLink>
            </nav>

            <div className="p-6 border-t border-blue-500/30">
                <button
                    onClick={() => navigate('/guest')}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-600 text-white w-full transition-all shadow-md shadow-emerald-500/30"
                >
                    <UserPlus size={20} />
                    Buka Form Tamu
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
