import React from 'react';

/**
 * VignanLogo — pure inline SVG, zero dependency on Tailwind.
 * Works on dev, production build, Vercel, Netlify — everywhere.
 * Props:
 *   dark  = true → uses dark blue text (for white backgrounds like dashboards)
 *   dark  = false (default) → uses white text (for dark/blue backgrounds like Login left panel)
 */
const VignanLogo = ({ dark = false, style = {} }) => {
    const textColor = dark ? '#1E3A8A' : '#FFFFFF';
    const subTextColor = '#06B6D4';
    const microTextColor = dark ? '#94a3b8' : '#93C5FD';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', ...style }}>
            {/* Cyan square with V */}
            <div style={{
                width: '38px', height: '38px', flexShrink: 0,
                backgroundColor: '#06B6D4',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(6,182,212,0.4)'
            }}>
                <span style={{
                    fontFamily: 'Arial Black, Arial, sans-serif',
                    fontWeight: 900, fontSize: '20px', color: '#FFFFFF', lineHeight: 1
                }}>V</span>
            </div>

            {/* Text block */}
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{
                    fontFamily: 'Arial Black, Arial, sans-serif',
                    fontWeight: 900, fontSize: '13px',
                    color: textColor, letterSpacing: '2px', lineHeight: '1.15'
                }}>VIGNAN</span>

                <span style={{
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 600, fontSize: '7.5px',
                    color: subTextColor, letterSpacing: '1.5px',
                    textTransform: 'uppercase', lineHeight: '1.4'
                }}>INST. OF TECHNOLOGY</span>

                <span style={{
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 400, fontSize: '6.5px',
                    color: microTextColor, letterSpacing: '0.8px',
                    textTransform: 'uppercase'
                }}>AND SCIENCE &nbsp;·&nbsp; EAMCET: VGNT</span>
            </div>
        </div>
    );
};

export default VignanLogo;
