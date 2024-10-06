import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const CelestialBody = ({ position, size, color }) => {
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(position.x, position.y, position.z);
    }
  }, [position]);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default CelestialBody;
