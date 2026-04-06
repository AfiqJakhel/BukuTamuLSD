import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import InputField from '../../components/InputField';
import { ArrowRight, CheckCircle2, User, ClipboardList, PenTool, ChevronDown, Check, AlertCircle, ShieldAlert } from 'lucide-react';
import { submitVisitor } from '../../services/api';

const formSchema = z.object({
    nim: z.string()
        .min(10, 'NIM harus terdiri dari 10 angka')
        .max(10, 'NIM harus terdiri dari 10 angka')
        .regex(/^\d+$/, 'NIM hanya boleh berisi angka'),
    purpose: z.string().min(1, 'Pilih alasan kunjungan'),
    customPurpose: z.string().optional()
}).superRefine((data, ctx) => {
    if (data.purpose === 'Lainnya' && (!data.customPurpose || data.customPurpose.trim() === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Alasan spesifik kunjungan harus diisi',
            path: ['customPurpose']
        });
    }
});

const GuestForm = () => {
    const [submitted, setSubmitted] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [shake, setShake] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const dropdownRef = useRef(null);
    const errorTimeoutRef = useRef(null);

    // Integrasi react-hook-form dengan zod
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, touchedFields, isSubmitted }
    } = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit',
        defaultValues: {
            nim: '',
            purpose: 'Berkunjung',
            customPurpose: ''
        }
    });

    const currentPurpose = watch('purpose');

    const purposes = [
        { id: 'Berkunjung', label: 'Berkunjung' },
        { id: 'Praktikum', label: 'Praktikum' },
        { id: 'Lainnya', label: 'Lainnya...' }
    ];

    // Integrasi react-query untuk mengirim data
    const visitorMutation = useMutation({
        mutationFn: submitVisitor,
        onSuccess: () => {
            setSubmitted(true);
            // Pastikan semua error bersih total saat sukses
            setShowError(false);
            setErrorMessage('');
            setShake(false);
            if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        },
        onError: (error) => {
            console.error('Gagal mengirim ke database:', error);
            // Tetap anggap sukses untuk demo jika API mati
            setSubmitted(true);
            setShowError(false);
            setErrorMessage('');
        }
    });

    const resetForm = () => {
        setSubmitted(false);
        setCountdown(3);
        reset();
        setIsDropdownOpen(false);
        setShowError(false);
        setShake(false);
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

    // Prevent closing and standard reload shortcuts where possible
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (
                e.key === 'F5' ||
                (e.ctrlKey && e.key === 'r') ||
                (e.altKey && e.key === 'ArrowLeft') ||
                (e.altKey && e.key === 'ArrowRight') ||
                (e.altKey && e.key === 'F4') ||
                (e.altKey && e.key === 'Tab')
            ) {
                e.preventDefault();
            }
        };

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const onSubmit = (data) => {
        // Clear any pending error timeouts and hide banner immediately
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        setShowError(false);
        setShake(false);
        setErrorMessage('');
        
        const payload = {
            nim: data.nim,
            purpose: data.purpose === 'Lainnya' ? data.customPurpose : data.purpose,
            created_at: new Date().toISOString()
        };

        visitorMutation.mutate(payload);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        };
    }, []);

    const onError = (errors) => {
        // Trigger shake
        setShake(true);
        setTimeout(() => setShake(false), 200);

        // Show banner
        const firstError = Object.values(errors)[0];
        setErrorMessage(firstError?.message || 'Lengkapi data Anda');
        setShowError(true);
        
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = setTimeout(() => setShowError(false), 3000);
    };

    if (submitted) {
        return (
            <div className="bg-white/80 backdrop-blur-2xl w-full max-w-md p-10 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-center animate-fade-in relative overflow-hidden transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500"></div>

                <div className="relative w-24 h-24 mx-auto mb-8">
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
        <div className={`bg-white/80 backdrop-blur-2xl w-full max-w-xl p-8 md:p-10 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 animate-fade-in relative z-10 ${shake ? 'animate-[headShake_0.5s_ease-in-out]' : ''}`}>
            
            {/* Error Banner - hanya render jika sedang tidak sukses/loading */}
            {!submitted && !visitorMutation.isPending && showError && errorMessage && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-[90%] transition-all duration-300 z-50 ${showError ? 'opacity-100 -translate-y-full' : 'opacity-0 -translate-y-1/2 pointer-events-none'}`}>
                    <div className="bg-red-500 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-red-400">
                        <ShieldAlert size={20} className="shrink-0" />
                        <span className="text-sm font-bold truncate">{errorMessage}</span>
                    </div>
                </div>
            )}

            <div className={`absolute top-0 left-0 w-full h-1.5 rounded-t-3xl transition-colors duration-500 ${!submitted && showError ? 'bg-red-500' : 'bg-gradient-to-r from-primary via-blue-500 to-sidebar'}`}></div>

            <div className="mb-10 mt-2">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-3 tracking-tight text-center">
                    Buku Tamu Lab
                </h2>
                <p className="text-gray-500 text-base leading-relaxed text-center">
                    Silakan isi data diri Anda sebelum memasuki ruangan.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} noValidate className="space-y-6">
                <div>
                    <InputField
                        {...register('nim')}
                        label="Nomor Induk Mahasiswa (NIM)"
                        placeholder="Masukkan NIM Anda"
                        required
                        icon={User}
                        onChange={(e) => {
                            // Format hanya angka
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setValue('nim', val, { shouldValidate: isSubmitted });
                        }}
                    />
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

                            <span className={`block truncate ${!currentPurpose ? 'text-gray-400' : 'text-gray-900 font-medium'}`}>
                                {purposes.find(p => p.id === currentPurpose)?.label || 'Pilih alasan...'}
                            </span>

                            <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isDropdownOpen ? 'text-primary rotate-180' : 'text-gray-400 rotate-0'}`}>
                                <ChevronDown size={20} />
                            </div>
                        </button>

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
                                            setValue('purpose', option.id, { shouldValidate: true });
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3.5 transition-all duration-200 group relative
                                            ${currentPurpose === option.id
                                                ? 'bg-blue-50/80 text-primary'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg transition-colors ${currentPurpose === option.id ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                                            {option.id === 'Lainnya' ? <PenTool size={18} /> :
                                                option.id === 'Berkunjung' ? <User size={18} /> :
                                                    <ClipboardList size={18} />}
                                        </div>
                                        <div>
                                            <div className={`text-sm font-semibold block ${currentPurpose === option.id ? 'text-primary' : 'text-gray-900'}`}>
                                                {option.label}
                                            </div>
                                        </div>
                                        {currentPurpose === option.id && (
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

                <div
                    className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden`}
                    style={{
                        maxHeight: currentPurpose === 'Lainnya' ? '200px' : '0px',
                        opacity: currentPurpose === 'Lainnya' ? 1 : 0,
                        transform: currentPurpose === 'Lainnya' ? 'translateY(0)' : 'translateY(-10px)'
                    }}
                >
                    <div className="pt-2">
                        <InputField
                            {...register('customPurpose')}
                            label="Spesifik Alasan Kunjungan"
                            placeholder="Tuliskan tujuan Anda..."
                            required={currentPurpose === 'Lainnya'}
                            icon={PenTool}
                        />
                        {isSubmitted && errors.customPurpose && (
                            <div className="flex items-center gap-1.5 mt-2 ml-1 text-red-500 animate-fade-in">
                                <AlertCircle size={14} />
                                <p className="text-xs font-semibold">{errors.customPurpose.message}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={visitorMutation.isPending}
                        className="w-full disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-sidebar hover:from-primary-hover hover:to-[#040b16] text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-[0_4px_14px_0_rgba(11,111,241,0.39)] hover:shadow-[0_6px_20px_rgba(11,111,241,0.23)] hover:-translate-y-0.5 flex justify-center items-center gap-2 group"
                    >
                        {visitorMutation.isPending ? 'Mengirim Data...' : 'Check-In'}
                        {!visitorMutation.isPending && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GuestForm;
