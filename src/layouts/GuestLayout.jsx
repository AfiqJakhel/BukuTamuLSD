import { Outlet, useNavigate } from 'react-router-dom';
import { Database, Lock, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import InputField from '../components/InputField';

const GuestLayout = () => {
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowLoginModal(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple mock authentication
        if (password === 'admin123') {
            setShowLoginModal(false);
            navigate('/');
        } else {
            setError('Password salah! Coba lagi.');
        }
    };

    const handleClose = () => {
        setShowLoginModal(false);
        setPassword('');
        setError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d6e4f0] flex flex-col font-sans relative">
            <header className="bg-white shadow-sm border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <img src="/src/assets/images/logo lsd.png" alt="Logo LSD" className="h-10 object-contain" />
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">LabVisitor</h1>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 md:p-12 h-full py-12">
                <Outlet />
            </main>

            <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-200/60 bg-white">
                &copy; {new Date().getFullYear()} Sistem Pendaftaran Lab. All rights reserved.
            </footer>

            {/* Admin Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                        onClick={handleClose}
                    ></div>

                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 animate-fade-in overflow-hidden border border-gray-100">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-sidebar"></div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                                        <Lock size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Admin Login</h3>
                                        <p className="text-xs text-gray-500">Masukan password untuk lanjut</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <InputField
                                        type="password"
                                        placeholder="Ketik password admin..."
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError('');
                                        }}
                                        required
                                    />
                                    {error && <p className="text-red-500 text-xs mt-1.5 font-medium ml-1">{error}</p>}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-primary to-sidebar hover:from-primary-hover hover:to-[#040b16] text-white font-medium py-2.5 rounded-xl transition-all shadow-md shadow-primary/20 mt-2"
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestLayout;
