import './ParticleField.scss';

// Pre-defined particle data — varied positions, sizes, opacities, timings.
// These look like natural "bokeh" or "dust mote" depth layers.
const PARTICLES = [
  // Large soft bokeh circles
  { x: 12,  y: 10,  size: 80,  blur: 40, opacity: 0.018, drift: 'a', duration: 28, delay: 0   },
  { x: 78,  y: 8,   size: 100, blur: 50, opacity: 0.015, drift: 'b', duration: 34, delay: 5   },
  { x: 5,   y: 70,  size: 90,  blur: 45, opacity: 0.014, drift: 'c', duration: 30, delay: 10  },
  { x: 88,  y: 72,  size: 75,  blur: 38, opacity: 0.016, drift: 'a', duration: 26, delay: 7   },
  { x: 50,  y: 5,   size: 110, blur: 55, opacity: 0.012, drift: 'b', duration: 38, delay: 2   },
  { x: 30,  y: 85,  size: 85,  blur: 42, opacity: 0.016, drift: 'c', duration: 32, delay: 14  },
  // Medium bokeh
  { x: 20,  y: 45,  size: 40,  blur: 20, opacity: 0.025, drift: 'b', duration: 22, delay: 3   },
  { x: 65,  y: 35,  size: 50,  blur: 25, opacity: 0.022, drift: 'a', duration: 24, delay: 8   },
  { x: 82,  y: 55,  size: 36,  blur: 18, opacity: 0.028, drift: 'c', duration: 20, delay: 11  },
  { x: 40,  y: 60,  size: 44,  blur: 22, opacity: 0.020, drift: 'a', duration: 26, delay: 16  },
  // Small sharp particles — subtle dust motes
  { x: 33,  y: 22,  size: 3,   blur: 1,  opacity: 0.10,  drift: 'a', duration: 18, delay: 1   },
  { x: 58,  y: 78,  size: 2,   blur: 1,  opacity: 0.08,  drift: 'b', duration: 22, delay: 6   },
  { x: 72,  y: 18,  size: 4,   blur: 1,  opacity: 0.09,  drift: 'c', duration: 20, delay: 9   },
  { x: 15,  y: 88,  size: 2,   blur: 0,  opacity: 0.07,  drift: 'a', duration: 24, delay: 4   },
  { x: 90,  y: 30,  size: 3,   blur: 1,  opacity: 0.08,  drift: 'b', duration: 18, delay: 13  },
  { x: 48,  y: 48,  size: 2,   blur: 0,  opacity: 0.06,  drift: 'c', duration: 26, delay: 2   },
  { x: 25,  y: 65,  size: 3,   blur: 1,  opacity: 0.09,  drift: 'a', duration: 20, delay: 7   },
  { x: 68,  y: 92,  size: 2,   blur: 0,  opacity: 0.07,  drift: 'b', duration: 22, delay: 12  },
] as const;

interface ParticleFieldProps {
  className?: string;
}

const ParticleField = ({ className }: ParticleFieldProps) => (
  <div className={`particle-field${className ? ` ${className}` : ''}`} aria-hidden="true">
    {PARTICLES.map((p, i) => (
      <div
        key={i}
        className={`particle particle--drift-${p.drift}`}
        style={{
          left: `${p.x}%`,
          top:  `${p.y}%`,
          width:  `${p.size}px`,
          height: `${p.size}px`,
          filter: p.blur > 0 ? `blur(${p.blur}px)` : undefined,
          opacity: p.opacity,
          animationDuration:  `${p.duration}s`,
          animationDelay:     `-${p.delay}s`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    ))}
  </div>
);

export default ParticleField;
