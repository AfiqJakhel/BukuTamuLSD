import { Outlet, useNavigate } from 'react-router-dom';
import { Lock, X, ServerCrash, Server } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import InputField from '../components/InputField';
import { checkServerStatus } from '../services/api';

const GuestLayout = () => {
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const passwordInputRef = useRef(null);
    const [serverStatus, setServerStatus] = useState('checking'); // checking | online | offline

    // Check server status periodically
    useEffect(() => {
        const verifyStatus = async () => {
            const isOnline = await checkServerStatus();
            setServerStatus(isOnline ? 'online' : 'offline');
        };

        verifyStatus();
        const pollInterval = setInterval(verifyStatus, 30000);
        return () => clearInterval(pollInterval);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowLoginModal(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when modal opens
    useEffect(() => {
        if (showLoginModal && passwordInputRef.current) {
            // Small timeout ensures the modal is fully rendered before focusing
            setTimeout(() => {
                passwordInputRef.current.focus();
            }, 100);
        }
    }, [showLoginModal]);

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple mock authentication
        if (password === 'lsdimoep') {
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
        <div className="min-h-screen bg-transparent flex flex-col font-sans relative overflow-hidden z-0">
            <header className="bg-white/60 backdrop-blur-xl shadow-sm border-b border-white/50 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-20 transition-all">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <img src="/src/assets/images/logo lsd.png" alt="Logo LSD" className="h-10 object-contain group-hover:scale-105 transition-transform duration-300" />
                    <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight group-hover:from-primary group-hover:to-sidebar transition-colors">LabVisitor</h1>
                </div>

                {/* Server Status Indicator */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm shadow-sm transition-all duration-300
                    ${serverStatus === 'online' ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200/50' :
                        serverStatus === 'offline' ? 'bg-red-50/90 text-red-700 border-red-200/50' :
                            'bg-gray-50/90 text-gray-500 border-gray-200/50'}`}>
                    <span className="relative flex h-2 w-2">
                        {(serverStatus === 'online' || serverStatus === 'offline') && (
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${serverStatus === 'online' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${serverStatus === 'online' ? 'bg-emerald-500' : serverStatus === 'offline' ? 'bg-red-500' : 'bg-gray-400'}`}></span>
                    </span>
                    {serverStatus === 'online' ? (
                        <>
                            <span className="hidden sm:inline">Server Hidup</span>
                        </>
                    ) : serverStatus === 'offline' ? (
                        <>
                            <span className="hidden sm:inline">Server Mati</span>
                        </>
                    ) : (
                        <span className="hidden sm:inline">Memeriksa...</span>
                    )}
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 p-6 md:p-12 h-full py-12 relative z-10">
                {/* Welcome Text Section */}
                <div className="flex-1 text-center lg:text-left animate-fade-in md:mt-0 mt-8">

                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 drop-shadow-sm leading-[1.15] tracking-tight">
                        Selamat Datang di <br className="hidden lg:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-cyan-400 leading-tight block pt-2 pb-1">Laboratorium System Development</span>
                    </h2>
                </div>

                {/* Form Section */}
                <div className="flex-none w-full max-w-xl animate-fade-in relative z-10 flex justify-center lg:justify-end">
                    <Outlet />
                </div>
            </main>

            {/* Admin Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                        onClick={handleClose}
                    ></div>

                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-sm relative z-10 animate-fade-in overflow-hidden border border-white/60">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-sidebar"></div>

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shadow-inner border border-blue-100">
                                        <Lock size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Admin Login</h3>
                                        <p className="text-xs text-gray-500 mt-1">Masukan password untuk lanjut</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-2">
                                    <InputField
                                        ref={passwordInputRef}
                                        type="password"
                                        placeholder="Ketik password admin..."
                                        icon={Lock}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError('');
                                        }}
                                        required
                                    />
                                    {error && <p className="text-red-500 text-xs mt-1.5 font-semibold ml-2 animate-pulse">{error}</p>}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-primary to-sidebar hover:from-primary-hover hover:to-[#040b16] text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(11,111,241,0.39)] hover:shadow-[0_6px_20px_rgba(11,111,241,0.23)] hover:-translate-y-0.5 mt-4"
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
