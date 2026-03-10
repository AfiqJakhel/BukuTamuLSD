import Table from '../../components/Table';

const recentVisitors = [
    { id: 1, name: 'Budi Santoso', type: 'Mahasiswa', time: '10:05 AM', purpose: 'Penelitian Lab', initials: 'BS', badgeClass: 'bg-blue-50 text-blue-600 border-blue-200' },
    { id: 2, name: 'Dr. Rina Purnamasari', type: 'Dosen', time: '09:30 AM', purpose: 'Supervisi', initials: 'RP', badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { id: 3, name: 'Arya Wiguna', type: 'Tamu', time: '09:15 AM', purpose: 'Kunjungan Industri', initials: 'AW', badgeClass: 'bg-amber-50 text-amber-600 border-amber-200' },
    { id: 4, name: 'Siti Nurhaliza', type: 'Mahasiswa', time: '08:45 AM', purpose: 'Tugas Akhir', initials: 'SN', badgeClass: 'bg-blue-50 text-blue-600 border-blue-200' },
    { id: 5, name: 'Ahmad Fauzi', type: 'Mahasiswa', time: '08:20 AM', purpose: 'Praktikum', initials: 'AF', badgeClass: 'bg-blue-50 text-blue-600 border-blue-200' },
];

const Visitors = () => {
    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Daftar Pengunjung Hari Ini</h3>
                <button className="bg-gradient-to-r from-primary to-sidebar hover:from-primary-hover hover:to-[#040b16] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    Unduh Laporan
                </button>
            </div>

            <Table headers={['Profil', 'Status', 'Tujuan', 'Waktu Masuk', 'Aksi']}>
                {recentVisitors.map((visitor) => (
                    <tr key={visitor.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                    {visitor.initials}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900 text-sm">{visitor.name}</span>
                                </div>
                            </div>
                        </td>
                        <td className="py-4 px-6">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${visitor.badgeClass}`}>
                                {visitor.type}
                            </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                            {visitor.purpose}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                            {visitor.time}
                        </td>
                        <td className="py-4 px-6">
                            <button className="text-primary hover:text-primary-hover text-sm font-medium">Detail</button>
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    );
};

export default Visitors;
