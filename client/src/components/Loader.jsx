export default function Loader () {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center z-50">
      <div className="text-center text-white p-8 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl animate-fadeInUp mx-4 relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-white/5 to-white/10 rounded-3xl animate-pulse"></div>
        
        <div className="relative z-10">
          {/* Modern spinner */}
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          
          {/* Loading text */}
          <h4 className="text-2xl font-semibold mb-2 drop-shadow-lg">
            Loading your dashboard...
          </h4>
          <p className="text-white/80 text-base drop-shadow-md">
            Please wait while we verify your credentials
          </p>
          
          {/* Animated dots */}
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};