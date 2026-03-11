import { Search, Bell } from 'lucide-react';

const Navbar = ({ title, subtitle }) => {
    return (
        <header className="flex justify-between items-center bg-white shadow-sm border-b border-gray-200 px-10 py-5">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold text-sm ring-2 ring-transparent group-hover:ring-blue-300 transition-all">
                        LSD
                    </div>
                    <span className="font-medium text-sm text-gray-700">Laboratorium System Development</span>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
