import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Camera, Transform, Plane, Program, Mesh } from 'ogl';
import './GlassSurface.css';

const GlassSurface = ({
  children,
  width = '100%',
  height = '100%',
  borderRadius = 0,
  className = '',
  displace = 0.3,
  distortionScale = 1.0,
  redOffset = 0.01,
  greenOffset = 0.0,
  blueOffset = -0.01,
  brightness = 1.0,
  opacity = 1.0,
  mixBlendMode = 'normal',
  asBackground = false
}) => {
  const containerRef = useRef();
  const canvasRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Skip WebGL on mobile for performance

    const container = containerRef.current;
    if (!container) return;
    
    const renderer = new Renderer({ 
      canvas: canvasRef.current,
      alpha: true, 
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 1.2) // Lower DPR further for performance
    });
    const gl = renderer.gl;

    const camera = new Camera(gl, { fov: 45 });
    camera.position.z = 5;

    const scene = new Transform();
    const geometry = new Plane(gl);

    const program = new Program(gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform float uTime;
        uniform float uDisplace;
        uniform float uDistortionScale;
        uniform float uRedOffset;
        uniform float uGreenOffset;
        uniform float uBlueOffset;
        uniform float uBrightness;
        uniform float uOpacity;
        uniform vec2 uResolution;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
        }

        void main() {
          vec2 aspectUv = vUv;
          aspectUv.x *= uResolution.x / uResolution.y;
          
          float n = noise(aspectUv * uDistortionScale + uTime * 0.05);
          vec2 distortion = vec2(n) * uDisplace;

          float r = noise(aspectUv + distortion + vec2(uRedOffset));
          float g = noise(aspectUv + distortion + vec2(uGreenOffset));
          float b = noise(aspectUv + distortion + vec2(uBlueOffset));

          vec3 color = vec3(r, g, b) * uBrightness;
          gl_FragColor = vec4(color, uOpacity);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uDisplace: { value: displace },
        uDistortionScale: { value: distortionScale },
        uRedOffset: { value: redOffset / 100 },
        uGreenOffset: { value: greenOffset / 100 },
        uBlueOffset: { value: blueOffset / 100 },
        uBrightness: { value: brightness / 50 },
        uOpacity: { value: opacity },
        uResolution: { value: [0, 0] }
      },
      transparent: true
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    let raf;
    const update = (time) => {
      raf = requestAnimationFrame(update);
      program.uniforms.uTime.value = time * 0.001;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      if (renderer.width !== width || renderer.height !== height) {
        renderer.setSize(width, height);
        camera.perspective({ aspect: width / height });
        program.uniforms.uResolution.value = [width, height];
        
        const fov = camera.fov * (Math.PI / 180);
        const frustumHeight = 2 * Math.tan(fov / 2) * camera.position.z;
        const frustumWidth = frustumHeight * camera.aspect;
        mesh.scale.set(frustumWidth, frustumHeight, 1);
      }

      renderer.render({ scene, camera });
    };

    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [displace, distortionScale, redOffset, greenOffset, blueOffset, brightness, opacity, isMobile]);

  return (
    <div 
      className={`glass-surface-container ${className} ${asBackground ? 'is-background' : ''}`}
      ref={containerRef}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        mixBlendMode: mixBlendMode
      }}
    >
      {!isMobile && <canvas ref={canvasRef} className="glass-surface-canvas" />}
      <div className="glass-surface-content">
        {children}
      </div>
    </div>
  );
};

export default GlassSurface;
