import React from 'react';

/**
 * GradualBlur applies a smooth gradient mask over a blurred backdrop,
 * creating a cinematic fade-to-blur effect typically used at the bottom of Hero sections.
 */
const GradualBlur = ({ className = '', height = '250px' }) => {
  return (
    <div
      className={`gradual-blur ${className}`}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: height,
        pointerEvents: 'none',
        zIndex: 5,
        /* Create the base blur */
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        /* Apply a mask to make the blur gradually stronger towards the bottom */
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
      }}
    />
  );
};

export default GradualBlur;
