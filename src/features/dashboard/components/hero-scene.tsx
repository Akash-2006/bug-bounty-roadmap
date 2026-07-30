import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Icosahedron,
  MeshDistortMaterial,
  Points,
  PointMaterial,
} from "@react-three/drei";
import * as THREE from "three";

/** Generate a spherical shell of random points for the particle field. */
function makeParticles(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * (0.85 + Math.random() * 0.4);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const positions = useRef(makeParticles(600, 3.4));

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.04;
      ref.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions.current} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#818cf8"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function Core() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.25;
      group.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <group ref={group}>
      {/* Distorted, glowing inner core */}
      <Icosahedron args={[1.15, 4]}>
        <MeshDistortMaterial
          color="#6366f1"
          emissive="#4338ca"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
          distort={0.35}
          speed={1.6}
        />
      </Icosahedron>

      {/* Wireframe shell */}
      <Icosahedron args={[1.55, 1]}>
        <meshBasicMaterial color="#a5b4fc" wireframe transparent opacity={0.35} />
      </Icosahedron>
    </group>
  );
}

interface HeroSceneProps {
  reducedMotion?: boolean;
}

/**
 * A self-contained WebGL scene: a rotating, distorted "exploit core" wrapped in
 * a wireframe shell and orbiting particles. Rendered in its own lazy chunk.
 */
export default function HeroScene({ reducedMotion = false }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#818cf8" />
      <pointLight position={[-4, -2, -2]} intensity={0.8} color="#22d3ee" />

      <Float
        speed={reducedMotion ? 0 : 1.4}
        rotationIntensity={reducedMotion ? 0 : 0.6}
        floatIntensity={reducedMotion ? 0 : 0.8}
      >
        <Core />
      </Float>

      <ParticleField />
    </Canvas>
  );
}
