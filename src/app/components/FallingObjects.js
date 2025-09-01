"use client";
import { useState, useEffect } from 'react';
import './FallingObjects.css';

export const CreateFallingObjects = (containerRef, numObjects = 20, containerHeight = 300, objectProps) => { // Add objectProps argument

  const [objects, setObjects] = useState([]);

  useEffect(() => {
    const generateObjects = () => {
      const newObjects = [];
      for (let i = 0; i < numObjects; i++) {
        newObjects.push(createObject(objectProps)); // Use objectProps to customize objects
      }
      setObjects(newObjects);
    };

    const createObject = (props) => {  // Pass in the object properties
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const size = props?.size || (Math.random() * 30 + 10); // Use prop or random if not provided
      const x = Math.random() * (containerWidth - size);
      const y = -size;
      const rotation = Math.random() * 360;
      const delay = Math.random() * 5;
      return { x, y, size, rotation, delay, ...props }; // Include all props in the object
    };

    if (containerRef.current) {
      generateObjects();
    }
  }, [numObjects, containerRef, objectProps]); // Add objectProps as a dependency

  useEffect(() => {
    const animateObjects = () => {
      if (!containerRef.current) return; // Guard against null ref

      const containerHeight = containerRef.current.offsetHeight;

      setObjects(prevObjects =>
        prevObjects.filter(obj => obj.y < containerHeight).map(obj => ({
          ...obj,
          y: obj.y + obj.size * 0.1 + Math.random() * 0.5,
          rotation: obj.rotation + 1
        }))
      );
      requestAnimationFrame(animateObjects);
    };

    return () => cancelAnimationFrame(animateObjects);
  }, [containerRef]);

  return objects.map((obj, index) => (
    <div
      key={index}
      className="falling-object"  // Keep it simple
      style={{
        left: obj.x,
        top: obj.y,
        width: obj.size,
        height: obj.size,
        fontSize: obj.size,
        color: obj.color,       // Use from passed in props
        transform: `rotate(${obj.rotation}deg)`,
        '--delay': obj.delay,
        '--size': obj.size,
        '--trail-length': obj.size / 2,
        '--container-height': `${containerHeight}px`,
        ...obj.style        // Spread any additional styles passed in
      }}
    >
      {obj.content}                {/* Use from passed in props */}
    </div>
  ));

};

export default CreateFallingObjects;



//HOW TO USE//

// In your component:
/* import { createFallingObjects } from './FallingObjects';

const objectProps = { // Pass in whatever props you want!
    color: 'blue',
    content: '🚀',
    style: { backgroundColor: 'orange', borderRadius: '50%' }, // and even additional styles
    size: 50
};

const fallingObjectsJSX = createFallingObjects(containerRef, 20, 300, objectProps); */