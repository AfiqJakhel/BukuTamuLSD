import { useState, useEffect } from 'react';
import InputField from '../../components/InputField';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const GuestForm = () => {
    const [submitted, setSubmitted] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [formData, setFormData] = useState({
        nim: '',
        purpose: 'Praktikum',
        customPurpose: ''
    });

    const resetForm = () => {
        setSubmitted(false);
        setCountdown(3);
        setFormData({
            nim: '',
            purpose: 'Praktikum',
            customPurpose: ''
        });
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Submit api logic goes here
    };

    if (submitted) {
        return (
            <div className="bg-white w-full max-w-md p-10 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 text-center animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Sukses!</h2>
                <p className="text-gray-500 mb-6">Terima kasih telah mengisi buku tamu lab. Silakan masuk ke ruangan.</p>
                <div className="text-sm font-medium text-primary mb-6 animate-pulse">
                    Kembali ke form dalam {countdown}...
                </div>
                <button
                    onClick={resetForm}
                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 rounded-xl transition-colors"
                >
                    Isi Pengunjung Lain Sekarang
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white w-full max-w-xl p-8 md:p-10 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-sidebar"></div>

            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Isi Buku Tamu</h2>
                <p className="text-gray-500">Silakan isi data diri Anda sebelum memasuki ruangan laboratorium.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                    label="Nomor Induk Mahasiswa (NIM)"
                    placeholder="Masukkan NIM Anda"
                    required
                    value={formData.nim}
                    onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                />

                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-gray-700">Alasan Kunjungan <span className="text-red-500">*</span></label>
                    <select
                        required
                        className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full"
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    >
                        <option value="Praktikum">Praktikum</option>
                        <option value="Berkunjung">Berkunjung</option>
                        <option value="Lainnya">Lainnya...</option>
                    </select>
                </div>

                {formData.purpose === 'Lainnya' && (
                    <div className="animate-fade-in">
                        <InputField
                            label="Spesifik Alasan Kunjungan"
                            placeholder="Tuliskan tujuan spesifik Anda..."
                            required
                            value={formData.customPurpose}
                            onChange={(e) => setFormData({ ...formData, customPurpose: e.target.value })}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-sidebar hover:from-primary-hover hover:to-[#040b16] text-white font-medium py-3.5 rounded-xl transition-all shadow-md shadow-primary/30 flex justify-center items-center gap-2 group mt-2"
                >
                    Daftar Sekarang
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </div>
    );
};

export default GuestForm;
