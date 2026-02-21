import React from 'react';

/**
 * VignanLogo — uses the real Vignan Institute PNG logo.
 * Props:
 *   size   = pixel size for the logo icon (default 40)
 *   dark   = true → dark blue text (white card backgrounds)
 *   dark   = false → white text (dark blue panel backgrounds)
 */
const VignanLogo = ({ size = 40, dark = false, style = {} }) => {
    const textColor = dark ? '#1E3A8A' : '#FFFFFF';
    const subColor = '#7C3AED';  // Vignan purple to match logo
    const microColor = dark ? '#94a3b8' : '#C4B5FD';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', ...style }}>
            {/* Real Vignan Institute PNG logo */}
            <img
                src="/vignan-logo.png"
                alt="Vignan Institute Logo"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    objectFit: 'contain',
                    flexShrink: 0,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}
            />

            {/* Text block */}
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{
                    fontFamily: 'Arial Black, Arial, sans-serif',
                    fontWeight: 900,
                    fontSize: '13px',
                    color: textColor,
                    letterSpacing: '2px',
                    lineHeight: '1.15'
                }}>VIGNAN</span>

                <span style={{
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 600,
                    fontSize: '7.5px',
                    color: subColor,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    lineHeight: '1.4'
                }}>INST. OF TECHNOLOGY</span>

                <span style={{
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 400,
                    fontSize: '6.5px',
                    color: microColor,
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase'
                }}>AND SCIENCE &nbsp;·&nbsp; EAMCET: VGNT</span>
            </div>
        </div>
    );
};

export default VignanLogo;
