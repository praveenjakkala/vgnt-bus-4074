import { motion } from 'framer-motion';

/**
 * VignanLogo — Matches the official horizontal layout:
 * [Logo] VIGNAN
 * -----------------------------------------
 * Institute of Technology and Science
 */
const VignanLogo = ({ size = 60, dark = false, style = {} }) => {
    // Colors from official logo
    const officialBlue = '#0072BC';
    const textColor = dark ? officialBlue : '#FFFFFF';
    const subColor = dark ? officialBlue : '#FFFFFF';
    const lineColor = dark ? '#E2E8F0' : 'rgba(255,255,255,0.3)';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', ...style }}>
            {/* Official Logo Icon */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    flexShrink: 0,
                }}
            >
                <img
                    src="/vignan-logo.png"
                    alt="Vignan Institute Logo"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                    }}
                />
            </motion.div>

            {/* Branding Text Block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800,
                    fontSize: `${size * 0.6}px`,
                    color: textColor,
                    letterSpacing: '1px',
                    lineHeight: '1.1',
                    textTransform: 'uppercase'
                }}>VIGNAN</span>

                {/* Horizontal Divider Line */}
                <div style={{
                    height: '1.5px',
                    width: '100%',
                    backgroundColor: lineColor,
                    margin: '2px 0'
                }}></div>

                <span style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 500,
                    fontSize: `${size * 0.25}px`,
                    color: subColor,
                    letterSpacing: '0.2px',
                    lineHeight: '1.2',
                    whiteSpace: 'nowrap'
                }}>Institute of Technology and Science</span>
            </div>
        </div>
    );
};

export default VignanLogo;
