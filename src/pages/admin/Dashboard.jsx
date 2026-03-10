import { Users, UserPlus, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
    { name: 'Sen', visitors: 400 },
    { name: 'Sel', visitors: 300 },
    { name: 'Rab', visitors: 550 },
    { name: 'Kam', visitors: 450 },
    { name: 'Jum', visitors: 700 },
    { name: 'Sab', visitors: 800 },
    { name: 'Min', visitors: 650 },
];

const statData = [
    {
        title: 'Total Pengunjung',
        value: '3,205',
        trend: '+12.5%',
        trendUp: true,
        icon: <Users size={24} className="text-primary" />,
        bgIcon: 'bg-blue-100',
        subtitle: '12.5% vs bulan lalu'
    },
    {
        title: 'Pengunjung Hari Ini',
        value: '128',
        trend: '+8.2%',
        trendUp: true,
        icon: <UserPlus size={24} className="text-emerald-500" />,
        bgIcon: 'bg-emerald-100',
        subtitle: '8.2% vs kemarin'
    },
    {
        title: 'Rata-rata Waktu',
        value: '1j 45m',
        trend: '-2.1%',
        trendUp: false,
        icon: <Clock size={24} className="text-amber-500" />,
        bgIcon: 'bg-amber-100',
        subtitle: '2.1% vs minggu lalu'
    }
];

const Dashboard = () => {
    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
            {/* Stats Layer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statData.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500 text-sm font-medium">{stat.title}</span>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgIcon}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="flex items-end gap-3">
                            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                            <div className={`flex items-center text-sm font-semibold mb-1 ${stat.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                                {stat.trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                <span>{stat.subtitle}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Layer */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Statistik Kunjungan Mingguan</h3>
                <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0b74f1" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#0b74f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="visitors" stroke="#0b74f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
