'use client'

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  const [isHovering, setIsHovering] = useState(false);
  const [isInputHovering, setIsInputHovering] = useState(false);
  const [isUsingMouse, setIsUsingMouse] = useState(false);

  const handleMouseMove = useCallback((event) => {
    if (event.sourceCapabilities?.firesTouchEvents || event.pointerType === 'touch') {
      return;
    }

    setIsUsingMouse(true);
    setMousePosition({ x: event.clientX, y: event.clientY });
  }, []);

  const handleTouchEvent = useCallback(() => {
    setIsUsingMouse(false);
    setMousePosition({ x: null, y: null });
  }, []);

  const handleMouseOver = useCallback((event) => {
    if (!isUsingMouse) return;

    const target = event.target;
    const isClickable =
      target.tagName.toLowerCase() === 'button' ||
      target.tagName.toLowerCase() === 'a' ||
      target.closest('button') ||
      target.closest('a') ||
      target.getAttribute('role') === 'button';
    const isInput = target.tagName.toLowerCase() === 'input' ||
      target.tagName.toLowerCase() === 'textarea' ||
      target.closest('input') ||
      target.closest('textarea');

    setIsHovering(isClickable);
    setIsInputHovering(isInput)
  }, [isUsingMouse]);


  useEffect(() => {
    const handlePointerEvent = (event) => {
      if (event.pointerType === 'touch') {
        handleTouchEvent();
      } else if (event.pointerType === 'mouse') {
        setIsUsingMouse(true);
      }
    };

    // Initial check for touch device
    const isTouchOnly = 'ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches;
    setIsUsingMouse(!isTouchOnly);

    window.addEventListener('pointermove', handleMouseMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerEvent, { passive: true });
    window.addEventListener('touchstart', handleTouchEvent, { passive: true });
    window.addEventListener('touchmove', handleTouchEvent, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handleMouseMove);
      window.removeEventListener('pointerdown', handlePointerEvent);
      window.removeEventListener('touchstart', handleTouchEvent);
      window.removeEventListener('touchmove', handleTouchEvent);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [handleMouseMove, handleMouseOver, handleTouchEvent]);

  return { mousePosition, isHovering, isMouseDevice: isUsingMouse, isInputHovering };
}

export function CustomCursor() {
  const { mousePosition, isHovering, isMouseDevice, isInputHovering } = useMousePosition();
  const [customCursorEnabled, setCustomCursorEnabled] = useState(true); // Default to true

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/rateministere/api/user/settings');

        if (!response.ok) {
          console.error('Failed to fetch user settings:', response.status, response.statusText);
          return; // Keep default value if fetch fails
        }

        const data = await response.json();
        setCustomCursorEnabled(data.customCursor);
      } catch (error) {
        console.error('Error fetching user settings:', error);
        // Keep default value if there's an error
      }
    };

    fetchSettings();
  }, []);


  useEffect(() => {
    console.log("CustomCursor component - customCursorEnabled:", customCursorEnabled, "isMouseDevice:", isMouseDevice); // Log the values

    if (!customCursorEnabled || !isMouseDevice) {
      const existingStyle = document.getElementById('custom-cursor-style');
      if (existingStyle) {
        existingStyle.remove();
      }
      return;
    }

    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    style.textContent = `
           * { cursor: none !important; }
        `;
    document.head.appendChild(style);

    return () => {
      const style = document.getElementById('custom-cursor-style');
      if (style) {
        style.remove();
      }
    };
  }, [isMouseDevice, customCursorEnabled]);

  // Don't render anything for touch input or when position is not set
  if (!customCursorEnabled || !isMouseDevice || mousePosition.x === null || mousePosition.y === null) {
    return null;
  }

  const scaleValue = isInputHovering ? 0.25 : isHovering ? 0.45 : 0.35;

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 999999999999,
      }}
    >
      <Image
        src="/rateministere/images/cursors/cursor.png"
        style={{
          position: 'fixed',
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: `translate(-38%, -35%) rotate(15deg) scale(${scaleValue})`,
          transition: 'transform 0.1s ease-out',
          pointerEvents: 'none',
          willChange: 'transform',
          imageRendering: 'high-quality',
        }}
        height={55}
        width={55}
        quality={100}
        alt="Custom cursor"
        priority
      />
    </div>
  );
}