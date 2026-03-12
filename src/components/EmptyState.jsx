import { useEffect, useState } from 'react';

/**
 * Komponen EmptyState yang keren dengan animasi
 * Digunakan saat belum ada data tamu yang tersedia
 */
const EmptyState = ({ 
    icon: Icon, 
    title = 'Belum Ada Data', 
    description = 'Data akan muncul di sini setelah ada pengunjung.', 
    variant = 'default' // 'default' | 'table' | 'chart'
}) => {
    const [visible, setVisible] = useState(false);
    const [dotCount, setDotCount] = useState(0);

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Animating dots for table variant
        if (variant === 'table') {
            const interval = setInterval(() => {
                setDotCount(prev => (prev + 1) % 4);
            }, 500);
            return () => clearInterval(interval);
        }
    }, [variant]);

    if (variant === 'table') {
        return (
            <tr>
                <td colSpan="100%" className="py-0">
                    <div 
                        className={`flex flex-col items-center justify-center py-16 px-4 transition-all duration-700 ease-out ${
                            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                    >
                        {/* Animated illustration */}
                        <div className="relative mb-8">
                            {/* Outer ring pulse */}
                            <div className="absolute inset-0 w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 animate-ping opacity-20"></div>
                            
                            {/* Middle ring */}
                            <div className="absolute inset-2 w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 animate-pulse"></div>
                            
                            {/* Icon container */}
                            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100/50 flex items-center justify-center shadow-lg shadow-blue-100/30">
                                {Icon && <Icon size={42} className="text-blue-400 animate-[bounce_3s_ease-in-out_infinite]" strokeWidth={1.5} />}
                            </div>

                            {/* Floating particles */}
                            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-blue-200 animate-float-slow opacity-60"></div>
                            <div className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-indigo-200 animate-float-medium opacity-60"></div>
                            <div className="absolute top-1/2 -right-5 w-2 h-2 rounded-full bg-purple-200 animate-float-fast opacity-60"></div>
                        </div>

                        {/* Text content */}
                        <h4 className="text-xl font-bold text-gray-800 mb-2 tracking-tight">{title}</h4>
                        <p className="text-gray-400 text-sm max-w-xs text-center leading-relaxed font-medium">
                            {description}
                        </p>
                        
                        {/* Waiting indicator */}
                        <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-50/60 rounded-full border border-blue-100/40">
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <div 
                                        key={i}
                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                            i < dotCount ? 'bg-blue-400 scale-110' : 'bg-blue-200 scale-100'
                                        }`}
                                    ></div>
                                ))}
                            </div>
                            <span className="text-xs text-blue-500 font-semibold">Menunggu data masuk</span>
                        </div>
                    </div>
                </td>
            </tr>
        );
    }

    if (variant === 'chart') {
        return (
            <div 
                className={`flex flex-col items-center justify-center h-full py-12 px-4 transition-all duration-700 ease-out ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
                {/* Animated chart placeholder */}
                <div className="relative mb-6">
                    <div className="flex items-end gap-1.5 h-16">
                        {[20, 35, 25, 45, 30, 40, 22].map((h, i) => (
                            <div 
                                key={i}
                                className="w-3 rounded-t-md bg-gradient-to-t from-gray-100 to-gray-50 border border-gray-100 animate-pulse"
                                style={{ 
                                    height: `${h}%`,
                                    animationDelay: `${i * 0.15}s`
                                }}
                            ></div>
                        ))}
                    </div>
                    <div className="w-full h-px bg-gray-200 mt-1"></div>
                </div>

                <h4 className="text-base font-bold text-gray-700 mb-1.5">{title}</h4>
                <p className="text-gray-400 text-xs max-w-[200px] text-center leading-relaxed font-medium">{description}</p>
            </div>
        );
    }

    // Default variant - full page-like empty state
    return (
        <div 
            className={`flex flex-col items-center justify-center min-h-[50vh] px-4 transition-all duration-700 ease-out ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
            {/* Large animated illustration */}
            <div className="relative mb-10">
                {/* Background glow */}
                <div className="absolute inset-0 w-36 h-36 rounded-full bg-gradient-to-br from-blue-200/40 to-indigo-200/40 blur-xl animate-pulse"></div>
                
                {/* Main circle */}
                <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-2 border-blue-100/50 flex items-center justify-center shadow-xl shadow-blue-100/20">
                    {Icon && <Icon size={56} className="text-blue-400 animate-[bounce_3s_ease-in-out_infinite]" strokeWidth={1.5} />}
                </div>
                
                {/* Orbiting dots */}
                <div className="absolute w-full h-full top-0 left-0 animate-[spin_8s_linear_infinite]">
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-300 shadow-sm"></div>
                </div>
                <div className="absolute w-full h-full top-0 left-0 animate-[spin_12s_linear_infinite_reverse]">
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-indigo-300 shadow-sm"></div>
                </div>
                <div className="absolute w-full h-full top-0 left-0 animate-[spin_10s_linear_infinite]">
                    <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-2 h-2 rounded-full bg-purple-300 shadow-sm"></div>
                </div>
            </div>

            {/* Content */}
            <h3 className="text-2xl font-extrabold text-gray-800 mb-3 tracking-tight">{title}</h3>
            <p className="text-gray-400 text-sm max-w-sm text-center leading-relaxed font-medium mb-6">{description}</p>
            
            {/* Animated wave bar */}
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                        key={i} 
                        className="w-1 bg-blue-300 rounded-full animate-wave"
                        style={{ 
                            animationDelay: `${i * 0.1}s`,
                            height: '12px'
                        }}
                    ></div>
                ))}
                <span className="text-xs text-blue-400 font-semibold ml-2">Menunggu pengunjung pertama...</span>
            </div>
        </div>
    );
};

export default EmptyState;
