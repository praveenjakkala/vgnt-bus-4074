import React from 'react';

const VignanLogo = ({ className = 'h-10' }) => {
    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <div className="flex flex-col justify-center">
                <div className="flex items-center space-x-1">
                    <div className="w-6 h-6 bg-vignan-blue rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-black">V</span>
                    </div>
                    <div>
                        <p className="text-vignan-blue font-black text-xs leading-none tracking-tight">VIGNAN</p>
                        <p className="text-vignan-cyan font-bold text-[8px] leading-none tracking-widest uppercase">Institute of Technology</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VignanLogo;
