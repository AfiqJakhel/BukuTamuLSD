import { useState, useEffect } from 'react';
import Table from '../../components/Table';
import { fetchVisitors } from '../../services/api';
import { parseNIM } from '../../utils/nimParser';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const Visitors = () => {
    const [visitors, setVisitors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchVisitors();
                setVisitors(data);
            } catch (error) {
                console.error("Failed to load visitors", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                    Daftar Pengunjung Laboratorium
                </h3>
                <button className="bg-gradient-to-r from-primary to-sidebar hover:from-primary-hover hover:to-[#040b16] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    Unduh Laporan
                </button>
            </div>

            <Table headers={['Profil Mahasiswa (NIM)', 'Asal Akademik', 'Tujuan', 'Waktu Berkunjung']}>
                {isLoading ? (
                    <tr>
                        <td colSpan="4" className="py-8 text-center text-gray-500">Memuat data pengunjung...</td>
                    </tr>
                ) : visitors.length === 0 ? (
                    <tr>
                        <td colSpan="4" className="py-8 text-center text-gray-500">Belum ada data kunjungan.</td>
                    </tr>
                ) : (
                    visitors.map((visitor) => {
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
                                                <span className="text-xs text-gray-500 font-medium">Angkatan {parsed.angkatan} • {parsed.jalur}</span>
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
        </div>
    );
};

export default Visitors;
