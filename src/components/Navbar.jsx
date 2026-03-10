import { Search, Bell } from 'lucide-react';

const Navbar = ({ title, subtitle }) => {
    return (
        <header className="flex justify-between items-center bg-white shadow-sm border-b border-gray-200 px-10 py-5">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2.5 text-gray-500 hover:text-primary transition-colors rounded-full border border-gray-200 hover:border-primary">
                    <Search size={20} />
                </button>
                <button className="relative p-2.5 text-gray-500 hover:text-primary transition-colors rounded-full border border-gray-200 hover:border-primary">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold text-sm ring-2 ring-transparent group-hover:ring-blue-300 transition-all">
                        AD
                    </div>
                    <span className="font-medium text-sm text-gray-700">Admin Lab</span>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
