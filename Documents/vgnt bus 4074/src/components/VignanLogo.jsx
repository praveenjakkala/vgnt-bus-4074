import React from 'react';

const VignanLogo = ({ className = 'h-10', dark = false }) => {
    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            {/* Logo icon */}
            <div className="flex-shrink-0 w-9 h-9 bg-vignan-cyan rounded-lg flex items-center justify-center shadow-md">
                <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: '18px', color: 'white', lineHeight: 1 }}>V</span>
            </div>
            {/* Text */}
            <div className="flex flex-col leading-none">
                <span style={{
                    fontFamily: 'Arial Black, Arial, sans-serif',
                    fontWeight: 900,
                    fontSize: '13px',
                    color: dark ? '#1E3A8A' : 'white',
                    letterSpacing: '2px',
                    lineHeight: '1.1'
                }}>VIGNAN</span>
                <span style={{
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 600,
                    fontSize: '7px',
                    color: '#06B6D4',
                    letterSpacing: '1.5px',
                    lineHeight: '1.3',
                    textTransform: 'uppercase'
                }}>INST. OF TECHNOLOGY</span>
                <span style={{
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: '6px',
                    color: dark ? '#94a3b8' : '#93C5FD',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                }}>AND SCIENCE · EAMCET: VGNT</span>
            </div>
        </div>
    );
};

export default VignanLogo;
