import React, { useState, useRef, useEffect } from 'react';
import { Users, UserPlus, Clock, ArrowUpRight, ArrowDownRight, Calendar, Activity, Filter, ChevronDown, Check } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchVisitors } from '../../services/api';
import { parseNIM } from '../../utils/nimParser';
import { 
    isSameDay, subDays, 
    isSameWeek, subWeeks, 
    isSameMonth, subMonths, 
    getHours, getDay,
    getDate, getDaysInMonth
} from 'date-fns';

const Dashboard = () => {
    const [chartFilter, setChartFilter] = useState('this_week');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle click outside for custom dropdown
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
        { id: 'last_month', label: 'Bulan Lalu' }
    ];

    const { data: visitors = [], isLoading: loading } = useQuery({
        queryKey: ['visitors'],
        queryFn: fetchVisitors,
    });

    // Perhitungan Statistik Total
    const today = new Date();
    const yesterday = subDays(today, 1);
    const lastWeekDate = subWeeks(today, 1);
    const lastMonthDate = subMonths(today, 1);

    let visitorsToday = 0;
    let visitorsYesterday = 0;
    let visitorsThisWeek = 0;
    let visitorsLastWeek = 0;
    let visitorsThisMonth = 0;
    let visitorsLastMonth = 0;
    const hourlyCounts = {};
    const angkatanCounts = {};
    const jurusanCounts = {};

    const getWeeklyTemplate = () => [
        { name: 'Min', visitors: 0 },
        { name: 'Sen', visitors: 0 },
        { name: 'Sel', visitors: 0 },
        { name: 'Rab', visitors: 0 },
        { name: 'Kam', visitors: 0 },
        { name: 'Jum', visitors: 0 },
        { name: 'Sab', visitors: 0 },
    ];
    
    const getMonthlyTemplate = (date) => Array.from({ length: getDaysInMonth(date) }, (_, i) => ({
        name: `${i + 1}`,
        visitors: 0
    }));

    let rawChartData = [];
    if (chartFilter.includes('week')) {
        rawChartData = getWeeklyTemplate();
    } else if (chartFilter === 'this_month') {
        rawChartData = getMonthlyTemplate(today);
    } else if (chartFilter === 'last_month') {
        rawChartData = getMonthlyTemplate(lastMonthDate);
    }

    visitors.forEach(visitor => {
        const visitDate = new Date(visitor.created_at);
        
        // Metrik Card
        if (isSameDay(visitDate, today)) visitorsToday++;
        if (isSameDay(visitDate, yesterday)) visitorsYesterday++;

        if (isSameWeek(visitDate, today, { weekStartsOn: 1 })) visitorsThisWeek++;
        if (isSameWeek(visitDate, lastWeekDate, { weekStartsOn: 1 })) visitorsLastWeek++;

        if (isSameMonth(visitDate, today)) visitorsThisMonth++;
        if (isSameMonth(visitDate, lastMonthDate)) visitorsLastMonth++;

        // Jam Sibuk
        const hour = getHours(visitDate);
        hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;

        // Distribusi Angkatan dan Jurusan
        const parsed = parseNIM(visitor.nim);
        if (parsed) {
            angkatanCounts[parsed.angkatan] = (angkatanCounts[parsed.angkatan] || 0) + 1;
            jurusanCounts[parsed.jurusan] = (jurusanCounts[parsed.jurusan] || 0) + 1;
        }

        // Distribusi Chart berdasarkan filter
        if (chartFilter === 'this_week' && isSameWeek(visitDate, today, { weekStartsOn: 1 })) {
            rawChartData[getDay(visitDate)].visitors++;
        } else if (chartFilter === 'last_week' && isSameWeek(visitDate, lastWeekDate, { weekStartsOn: 1 })) {
            rawChartData[getDay(visitDate)].visitors++;
        } else if (chartFilter === 'this_month' && isSameMonth(visitDate, today)) {
            rawChartData[getDate(visitDate) - 1].visitors++;
        } else if (chartFilter === 'last_month' && isSameMonth(visitDate, lastMonthDate)) {
            rawChartData[getDate(visitDate) - 1].visitors++;
        }
    });

    // Mengurutkan chart mingguan agar dimulai dari Senin
    let displayedChartData = rawChartData;
    if (chartFilter.includes('week')) {
        displayedChartData = [
            rawChartData[1], // Sen
            rawChartData[2], // Sel
            rawChartData[3], // Rab
            rawChartData[4], // Kam
            rawChartData[5], // Jum
            rawChartData[6], // Sab
            rawChartData[0], // Min
        ];
    }

    // Mencari Jam Sibuk
    let peakHour = 'N/A';
    let maxCount = 0;
    Object.keys(hourlyCounts).forEach(hour => {
        if (hourlyCounts[hour] > maxCount) {
            maxCount = hourlyCounts[hour];
            peakHour = `${String(hour).padStart(2, '0')}:00`;
        }
    });

    const hourlyDistributionData = Object.keys(hourlyCounts).map(key => ({ 
        name: `${String(key).padStart(2, '0')}:00`, 
        visitors: hourlyCounts[key] 
    })).sort((a, b) => parseInt(a.name) - parseInt(b.name));

    const angkatanData = Object.keys(angkatanCounts).map(key => ({ 
        name: key, 
        value: angkatanCounts[key] 
    })).sort((a,b) => b.value - a.value).slice(0, 6); // Ambil Top 6 terbesar

    const jurusanData = Object.keys(jurusanCounts).map(key => ({ 
        name: key, 
        value: jurusanCounts[key] 
    })).sort((a,b) => b.value - a.value).slice(0, 6);

    const COLORS = ['#0b74f1', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#6366f1'];

    const calculateTrend = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return (((current - previous) / previous) * 100).toFixed(1);
    };

    const todayTrend = calculateTrend(visitorsToday, visitorsYesterday);
    const weekTrend = calculateTrend(visitorsThisWeek, visitorsLastWeek);
    const monthTrend = calculateTrend(visitorsThisMonth, visitorsLastMonth);

    const statData = [
        {
            title: 'Pengunjung Hari Ini',
            value: visitorsToday.toString(),
            trend: `${Math.abs(todayTrend)}%`,
            trendUp: todayTrend >= 0,
            icon: <UserPlus size={24} className="text-emerald-500" />,
            bgIcon: 'bg-emerald-100',
            subtitle: `${Math.abs(todayTrend)}% vs kemarin`
        },
        {
            title: 'Pengunjung Mgg Ini',
            value: visitorsThisWeek.toString(),
            trend: `${Math.abs(weekTrend)}%`,
            trendUp: weekTrend >= 0,
            icon: <Users size={24} className="text-blue-500" />,
            bgIcon: 'bg-blue-100',
            subtitle: `${Math.abs(weekTrend)}% vs mgg lalu`
        },
        {
            title: 'Pengunjung Bln Ini',
            value: visitorsThisMonth.toString(),
            trend: `${Math.abs(monthTrend)}%`,
            trendUp: monthTrend >= 0,
            icon: <Calendar size={24} className="text-purple-500" />,
            bgIcon: 'bg-purple-100',
            subtitle: `${Math.abs(monthTrend)}% vs bln lalu`
        },
        {
            title: 'Jam Sibuk',
            value: peakHour,
            isNeutral: true,
            icon: <Clock size={24} className="text-amber-500" />,
            bgIcon: 'bg-amber-100'
        }
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <Activity size={40} className="text-primary animate-pulse w-10 h-10" />
                <p className="text-gray-500 font-medium">Memuat data dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
            {/* Stats Layer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            {stat.subtitle && (
                                <div className={`flex items-center text-sm font-semibold mb-1 ${stat.isNeutral ? 'text-gray-500' : (stat.trendUp ? 'text-emerald-500' : 'text-red-500')}`}>
                                    {!stat.isNeutral && (stat.trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />)}
                                    <span>{stat.subtitle}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Layer */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[450px] flex flex-col">
                <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Statistik Kunjungan</h3>
                        <div className="text-sm text-gray-500">
                            Menampilkan tren kunjungan berdasarkan rentang waktu
                        </div>
                    </div>
                    
                    {/* Time Filter Custom Dropdown */}
                    <div className="relative group z-20" ref={dropdownRef}>
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        
                        <button 
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="relative flex items-center justify-between gap-3 min-w-[150px] bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-primary/50 text-gray-700 text-sm rounded-xl px-4 py-2.5 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                        >
                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-primary shrink-0" />
                                <span className="text-gray-900 truncate">
                                    {filterOptions.find(opt => opt.id === chartFilter)?.label}
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
                                            setChartFilter(option.id);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-sm transition-colors cursor-pointer
                                            ${chartFilter === option.id 
                                                ? 'bg-blue-50/80 text-primary font-semibold' 
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                                            }`}
                                    >
                                        {option.label}
                                        {chartFilter === option.id && (
                                            <div className="text-primary bg-white rounded-full p-0.5 shadow-sm border border-blue-100">
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={displayedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0b74f1" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#0b74f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#6b7280' }} 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#6b7280' }} 
                                allowDecimals={false} 
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                labelFormatter={(label) => chartFilter.includes('month') ? `Tanggal ${label}` : label}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="visitors" 
                                stroke="#0b74f1" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorVisitors)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Additional Analytics Charts Layer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Distribusi Jam</h3>
                    <p className="text-xs text-gray-500 mb-6">Waktu favorit kunjungan ke lab</p>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyDistributionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#f3f4f6'}} />
                                <Bar dataKey="visitors" fill="#0b74f1" radius={[4, 4, 0, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Top Angkatan</h3>
                    <p className="text-xs text-gray-500 mb-6">Distribusi berdasarkan tahun angkatan</p>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={angkatanData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={95}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {angkatanData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Top Jurusan</h3>
                    <p className="text-xs text-gray-500 mb-6">Program studi pengunjung terbanyak</p>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={jurusanData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} width={90} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#f3f4f6'}} />
                                <Bar dataKey="value" fill="#14b8a6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;

