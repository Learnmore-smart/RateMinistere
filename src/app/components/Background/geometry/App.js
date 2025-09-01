'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
const GeometricAnimation = React.forwardRef((props, ref) => {
  const [particles, setParticles] = useState([]);
  const colors = ["#FF6B6B", "#FFE66D", "#4472CA"];
  const border = ["50%", "0%"];
  const nextId = useRef(1);
  const animationFrameRef = useRef(null);


  const moveParticle = useCallback((particle) => {
    const startY = particle.y;
    const distance = window.innerHeight - startY;
    const duration = particle.isTriangle ? 5000 : particle.animation * 1000;
    const startTime = Date.now();
    let currentParticle = particle;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      let opacity = currentParticle.opacity || 1;
      if (progress < 0.1) opacity = progress * 10;
      else if (progress > 0.9) opacity = (1 - progress) * 10;
      const currentY = startY + (distance * progress);
      currentParticle = { ...currentParticle, y: currentY, opacity }
      setParticles(prev => prev.map(p => p.id === particle.id ? currentParticle : p));
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setParticles(prev => prev.filter(p => p.id !== particle.id));
      }
    };
    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);


  const createParticle = useCallback((event) => {
    if (event.target.classList.contains('particles')) {
      const newParticle = {
        id: nextId.current++,
        x: Math.max(0, Math.min(document.documentElement.clientWidth, event.clientX)),
        y: event.clientY,
        color: colors[Math.floor(Math.random() * 3)],
        isTriangle: true,
        opacity: 0
      };

      setParticles(prev => [...prev, newParticle]);
      moveParticle(newParticle);
    }
  }, [moveParticle]);

  const createRandomParticles = useCallback(() => {
    const w = document.documentElement.clientWidth;
    const maxParticles = 7;
    const newParticles = Array.from({ length: maxParticles }, () => ({
      id: nextId.current++,
      x: Math.max(0, Math.min(w, Math.random() * w)),
      y: -10 - (Math.random() * 20),
      width: Math.floor(Math.random() * 8) + 5,
      opacity: 0,
      color: colors[Math.floor(Math.random() * 3)],
      borderRadius: border[Math.floor(Math.random() * 2)],
      animation: Math.floor(Math.random() * 12) + 8
    }));

    setParticles(prev => [...prev, ...newParticles]);
    newParticles.forEach(moveParticle);
  }, [moveParticle]);


  useEffect(() => {
    createRandomParticles();
    const interval = setInterval(createRandomParticles, 5000);
    window.addEventListener('resize', createRandomParticles);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', createRandomParticles);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    };
  }, [createRandomParticles]);

  return (
    <div className="particles" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: -1,
      pointerEvents: 'none',
      overflow: 'hidden',
    }} onClick={createParticle} ref={ref}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.opacity,
            transition: 'opacity 0.1s',
            ...(particle.isTriangle ? {
              width: '10px',
              borderTop: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderLeft: '5px solid transparent',
              borderBottom: `10px solid ${particle.color}`
            } : {
              width: `${particle.width}px`,
              height: `${particle.width}px`,
              backgroundColor: particle.color,
              borderRadius: particle.borderRadius
            })
          }}
        />
      ))}
    </div>
  );
});

GeometricAnimation.displayName = 'GeometricAnimation';

export default GeometricAnimation;