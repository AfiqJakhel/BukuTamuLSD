import { useState, useRef, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Table from '../../components/Table';
import { fetchVisitors } from '../../services/api';
import { parseNIM } from '../../utils/nimParser';
import { format, isSameWeek, subWeeks, isSameMonth, subMonths, isSameYear } from 'date-fns';
import { id } from 'date-fns/locale';
import { Download, ChevronLeft, ChevronRight, Filter, ChevronDown, Check, ClipboardList, Users } from 'lucide-react';
import EmptyState from '../../components/EmptyState';

const Visitors = () => {
    const { data: visitors = [], isLoading } = useQuery({
        queryKey: ['visitors'],
        queryFn: fetchVisitors,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [timeFilter, setTimeFilter] = useState('this_year');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filterOptions = [
        { id: 'this_week', label: 'Minggu Ini' },
        { id: 'last_week', label: 'Minggu Lalu' },
        { id: 'this_month', label: 'Bulan Ini' },
        { id: 'last_month', label: 'Bulan Lalu' },
        { id: 'this_year', label: 'Tahun Ini' }
    ];

    const filteredVisitors = useMemo(() => {
        if (!visitors.length) return [];
        const today = new Date();
        const lastWeekDate = subWeeks(today, 1);
        const lastMonthDate = subMonths(today, 1);

        return visitors.filter(visitor => {
            const visitDate = new Date(visitor.created_at);
            
            // Aturan utama: Abaikan data tahun lain (jika sudah bertukar tahun, data tahun kemaren tidak dibaca)
            if (!isSameYear(visitDate, today)) return false;

            if (timeFilter === 'this_week') {
                return isSameWeek(visitDate, today, { weekStartsOn: 1 });
            } else if (timeFilter === 'last_week') {
                return isSameWeek(visitDate, lastWeekDate, { weekStartsOn: 1 });
            } else if (timeFilter === 'this_month') {
                return isSameMonth(visitDate, today);
            } else if (timeFilter === 'last_month') {
                return isSameMonth(visitDate, lastMonthDate);
            }
            
            return true; // 'this_year' (Keseluruhan) di tahun ini
        });
    }, [visitors, timeFilter]);

    useEffect(() => {
        setCurrentPage(1); // Reset page saat filter berubah
    }, [timeFilter]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredVisitors.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);

    const handleDownloadCSV = () => {
        if (!filteredVisitors || filteredVisitors.length === 0) return;

        // Headernya sesuai permintaan
        const headers = ['Waktu', 'Tanggal', 'Hari', 'NIM', 'Angkatan', 'Jalur Masuk', 'Jurusan', 'Fakultas', 'Tujuan'];

        const rows = filteredVisitors.map(visitor => {
            const parsed = parseNIM(visitor.nim) || {};
            const date = new Date(visitor.created_at);

            return [
                format(date, 'HH:mm:ss'),               // Jam gabungan
                format(date, 'dd/MM/yyyy'),
                format(date, 'EEEE', { locale: id }),  // Hari (Senin, Selasa, dll)
                "\t" + visitor.nim, // Supaya angka tidak menjadi format scientific di excel, tambahkan \t atau jadikan string
                parsed.angkatan || '-',
                parsed.jalur || '-',
                parsed.jurusan || '-',
                parsed.fakultas || '-',
                visitor.purpose,
            ].map(value => `"${value}"`).join(","); // Beri quote agar CSV aman terhadap koma di dalam string
        });

        // Pakai BOM \uFEFF supaya Excel otomatis deteksi file sebagai UTF-8 (bisa support karakter unik)
        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Laporan_Pengunjung_Lab_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-10">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Daftar Pengunjung Laboratorium
                </h3>
                
                <div className="flex items-center gap-3">
                    {/* Time Filter Custom Dropdown */}
                    <div className="relative group z-20" ref={dropdownRef}>
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        
                        <button 
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="relative flex items-center justify-between gap-3 min-w-[160px] bg-white backdrop-blur-sm border border-gray-200 hover:border-primary/50 text-gray-700 text-sm rounded-xl px-4 py-2.5 shadow-sm focus:outline-none transition-all font-semibold"
                        >
                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-primary shrink-0" />
                                <span className="text-gray-900 truncate">
                                    {filterOptions.find(opt => opt.id === timeFilter)?.label}
                                </span>
                            </div>
                            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-primary' : ''} shrink-0`} />
                        </button>

                        <div 
                            className={`absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300 origin-top-right
                            ${isDropdownOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                        >
                            <div className="p-2 space-y-1">
                                {filterOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            setTimeFilter(option.id);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-sm transition-colors cursor-pointer
                                            ${timeFilter === option.id 
                                                ? 'bg-blue-50/80 text-primary font-semibold' 
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                                            }`}
                                    >
                                        {option.label}
                                        {timeFilter === option.id && (
                                            <div className="text-primary bg-white rounded-full p-0.5 shadow-sm border border-blue-100">
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleDownloadCSV}
                        disabled={isLoading || filteredVisitors.length === 0}
                        className="flex items-center gap-2 bg-gradient-to-r from-primary to-sidebar hover:from-primary-hover hover:to-[#040b16] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
                    >
                        <Download size={18} />
                        Unduh Laporan
                    </button>
                </div>
            </div>

            <Table headers={['Profil Mahasiswa (NIM)', 'Asal Akademik', 'Tujuan', 'Waktu Berkunjung']}>
                {isLoading ? (
                    <tr>
                        <td colSpan="4" className="py-8 text-center text-gray-500">Memuat data pengunjung...</td>
                    </tr>
                ) : visitors.length === 0 ? (
                    <EmptyState
                        variant="table"
                        icon={Users}
                        title="Belum Ada Pengunjung"
                        description="Data pengunjung lab akan otomatis muncul di sini setelah ada tamu yang mengisi buku tamu."
                    />
                ) : filteredVisitors.length === 0 ? (
                    <EmptyState
                        variant="table"
                        icon={ClipboardList}
                        title="Tidak Ada Data Periode Ini"
                        description={`Belum ada kunjungan pada filter "${filterOptions.find(o => o.id === timeFilter)?.label}". Coba pilih periode lain.`}
                    />
                ) : (
                    currentItems.map((visitor) => {
                        const parsed = parseNIM(visitor.nim);

                        return (
                            <tr key={visitor.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-full bg-blue-50 text-primary border border-blue-100 flex items-center justify-center font-bold text-sm shrink-0 shadow-inner">
                                            {parsed ? `${parsed.angkatan.slice(2)}` : '???'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 text-sm">{visitor.nim}</span>
                                            {parsed ? (
                                                <span className="text-xs text-gray-500 font-medium">Angkatan {parsed.angkatan} - {parsed.jalur}</span>
                                            ) : (
                                                <span className="text-xs text-red-400 font-medium">Format NIM tidak dikenali</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    {parsed ? (
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-800 text-sm">
                                                {parsed.jurusan}
                                            </span>
                                            <span className="text-xs text-gray-500 mt-0.5">
                                                {parsed.jenjang} - {parsed.fakultas}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-400">Data tidak tersedia</span>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-sm">
                                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full font-medium inline-block border border-gray-200">
                                        {visitor.purpose}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                                    <div className="flex flex-col">
                                        <span>{format(new Date(visitor.created_at), 'dd MMM yyyy', { locale: id })}</span>
                                        <span className="text-xs text-gray-400">{format(new Date(visitor.created_at), 'HH:mm')} WIB</span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })
                )}
            </Table>

            {/* Pagination Controls */}
            {!isLoading && filteredVisitors.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 gap-4">
                    <div className="text-sm text-gray-500 font-medium">
                        Menampilkan <span className="text-gray-900 font-bold">{indexOfFirstItem + 1}</span> hingga <span className="text-gray-900 font-bold">{Math.min(indexOfLastItem, filteredVisitors.length)}</span> dari <span className="text-gray-900 font-bold">{filteredVisitors.length}</span> pengunjung
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                // Logic to show pages around current page
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                                            currentPage === pageNum 
                                                ? 'bg-primary text-white shadow-sm' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Visitors;
