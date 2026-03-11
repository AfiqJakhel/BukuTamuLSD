import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // auto refresh when admin switch tabs
      staleTime: 5000, // cache for 5 seconds
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-primary/20 selection:text-primary">
        {/* Global Stunning Modern Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgNDBoNDBNNDAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDAsIDAsIDAsIDAuMDQpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] opacity-100 mix-blend-overlay"></div>

            {/* Animated Gradient Orbs */}
            <div className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full bg-blue-500/15 blur-[120px] mix-blend-multiply opacity-70 animate-[pulse_8s_ease-in-out_infinite]"></div>
            <div className="absolute top-1/4 -right-1/4 w-[60%] h-[60%] rounded-full bg-cyan-400/20 blur-[130px] mix-blend-multiply opacity-70 animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
            <div className="absolute -bottom-1/4 left-1/3 w-[50%] h-[50%] rounded-full bg-indigo-500/15 blur-[120px] mix-blend-multiply opacity-50 animate-[pulse_12s_ease-in-out_infinite]"></div>
        </div>
        
        {/* App Content */}
        <div className="relative z-10 w-full min-h-screen">
            <AppRoutes />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
