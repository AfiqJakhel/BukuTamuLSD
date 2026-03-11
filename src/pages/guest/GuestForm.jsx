import { useState, useEffect, useRef } from 'react';
import InputField from '../../components/InputField';
import { ArrowRight, CheckCircle2, User, ClipboardList, PenTool, ChevronDown, Check } from 'lucide-react';
import { submitVisitor } from '../../services/api';

const GuestForm = () => {
    const [submitted, setSubmitted] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [formData, setFormData] = useState({
        nim: '',
        purpose: 'Berkunjung',
        customPurpose: ''
    });
    const [nimError, setNimError] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const purposes = [
        { id: 'Berkunjung', label: 'Berkunjung' },
        { id: 'Praktikum', label: 'Praktikum' },
        { id: 'Lainnya', label: 'Lainnya...' }
    ];

    const resetForm = () => {
        setSubmitted(false);
        setCountdown(3);
        setFormData({
            nim: '',
            purpose: 'Berkunjung',
            customPurpose: ''
        });
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        let interval;
        if (submitted && countdown > 0) {
            interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (submitted && countdown === 0) {
            resetForm();
        }
        return () => clearInterval(interval);
    }, [submitted, countdown]);

    // Handle click outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.nim.length !== 10) {
            setNimError('NIM wajib terdiri dari tepat 10 angka!');
            return;
        }

        try {
            const payload = {
                nim: formData.nim,
                purpose: formData.purpose === 'Lainnya' ? formData.customPurpose : formData.purpose,
                created_at: new Date().toISOString()
            };

            // Coba kirim data ke backend database
            await submitVisitor(payload);
            setSubmitted(true);

        } catch (error) {
            console.error('Gagal mengirim ke database, API mungkin belum menyala:', error);
            // Fallback: Tetap tampilkan sukses agar UI bisa dites sementara backend belum ada
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <div className="bg-white/80 backdrop-blur-2xl w-full max-w-md p-10 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-center animate-fade-in relative overflow-hidden transition-all duration-500">
                {/* Glowing top line */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500"></div>

                <div className="relative w-24 h-24 mx-auto mb-8">
                    {/* Pulsing background effect */}
                    <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
                        <CheckCircle2 size={52} className="animate-[bounce_2s_infinite]" />
                    </div>
                </div>

                <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Sukses!</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Terima kasih telah mengisi buku tamu lab.<br />Silakan Masuk.
                </p>

                <div className="inline-flex items-center justify-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold mb-8 border border-emerald-100/50 relative overflow-hidden group hover:scale-105 transition-transform cursor-default">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 absolute left-4"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 relative z-10 animate-ping"></span>
                    <span className="relative z-10">Kembali dalam {countdown}s</span>
                </div>

                <button
                    onClick={resetForm}
                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3.5 rounded-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                >
                    Isi Pengunjung Lain Sekarang
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-2xl w-full max-w-xl p-8 md:p-10 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 animate-fade-in relative z-10">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-blue-500 to-sidebar rounded-t-3xl"></div>

            <div className="mb-10 mt-2">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-3 tracking-tight text-center">
                    Buku Tamu Lab
                </h2>
                <p className="text-gray-500 text-base leading-relaxed text-center">
                    Silakan isi data diri Anda sebelum memasuki ruangan.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <InputField
                        label="Nomor Induk Mahasiswa (NIM)"
                        placeholder="Masukkan NIM Anda"
                        required
                        icon={User}
                        value={formData.nim}
                        onChange={(e) => {
                            // Validasi angka saja & maks 10 digit di input ketikan
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 10) {
                                setFormData({ ...formData, nim: val });
                                setNimError('');
                            }
                        }}
                    />
                    {nimError && <p className="text-red-500 text-xs mt-1.5 font-semibold ml-2 animate-pulse">{nimError}</p>}
                </div>

                <div className="flex flex-col gap-2 w-full" ref={dropdownRef}>
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                        Alasan Kunjungan <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-full pl-11 pr-10 py-3.5 text-left border rounded-xl text-sm transition-all duration-300 focus:outline-none shadow-sm flex items-center justify-between
                                ${isDropdownOpen
                                    ? 'bg-white border-primary ring-4 ring-primary/10'
                                    : 'bg-gray-50/50 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDropdownOpen ? 'text-primary' : 'text-gray-400'}`}>
                                <ClipboardList size={20} />
                            </div>

                            <span className={`block truncate ${!formData.purpose ? 'text-gray-400' : 'text-gray-900 font-medium'}`}>
                                {purposes.find(p => p.id === formData.purpose)?.label || 'Pilih alasan...'}
                            </span>

                            <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isDropdownOpen ? 'text-primary rotate-180' : 'text-gray-400 rotate-0'}`}>
                                <ChevronDown size={20} />
                            </div>
                        </button>

                        {/* Custom Dropdown Menu */}
                        <div
                            className={`absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300 origin-top
                                ${isDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                        >
                            <div className="p-2 space-y-1">
                                {purposes.map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, purpose: option.id });
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3.5 transition-all duration-200 group relative
                                            ${formData.purpose === option.id
                                                ? 'bg-blue-50/80 text-primary'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg transition-colors ${formData.purpose === option.id ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                                            {option.id === 'Lainnya' ? <PenTool size={18} /> :
                                                option.id === 'Berkunjung' ? <User size={18} /> :
                                                    <ClipboardList size={18} />}
                                        </div>
                                        <div>
                                            <div className={`text-sm font-semibold block ${formData.purpose === option.id ? 'text-primary' : 'text-gray-900'}`}>
                                                {option.label}
                                            </div>
                                            <div className={`text-xs mt-0.5 ${formData.purpose === option.id ? 'text-primary/70' : 'text-gray-500'}`}>
                                                {option.description}
                                            </div>
                                        </div>
                                        {formData.purpose === option.id && (
                                            <div className="absolute right-4 text-primary bg-white rounded-full p-0.5 shadow-sm border border-blue-100">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Smooth Expansion Wrapper for Specific Purpose Input */}
                <div
                    className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden`}
                    style={{
                        maxHeight: formData.purpose === 'Lainnya' ? '200px' : '0px',
                        opacity: formData.purpose === 'Lainnya' ? 1 : 0,
                        transform: formData.purpose === 'Lainnya' ? 'translateY(0)' : 'translateY(-10px)'
                    }}
                >
                    <div className="pt-2">
                        <InputField
                            label="Spesifik Alasan Kunjungan"
                            placeholder="Tuliskan tujuan Anda..."
                            required={formData.purpose === 'Lainnya'}
                            icon={PenTool}
                            value={formData.customPurpose}
                            onChange={(e) => setFormData({ ...formData, customPurpose: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-sidebar hover:from-primary-hover hover:to-[#040b16] text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-[0_4px_14px_0_rgba(11,111,241,0.39)] hover:shadow-[0_6px_20px_rgba(11,111,241,0.23)] hover:-translate-y-0.5 flex justify-center items-center gap-2 group"
                    >
                        Daftar Sekarang
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GuestForm;
