// import { useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, Environment, ContactShadows, Float } from "@react-three/drei";

// function Bottle() {
//   const group = useRef();

//   useFrame((state) => {
//     const t = state.clock.getElapsedTime();
//     group.current.rotation.y = Math.sin(t / 1.5) * 0.4;
//   });

//   return (
//     <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
//       <group ref={group}>
//         {/* Bottle Body */}
//         <mesh position={[0, 0, 0]}>
//           <cylinderGeometry args={[0.7, 0.85, 2.4, 64]} />
//           <meshPhysicalMaterial
//             color="#0f0f1a"
//             metalness={0.95}
//             roughness={0.05}
//             clearcoat={1}
//             clearcoatRoughness={0.1}
//             transmission={0.4}
//             thickness={0.6}
//             ior={1.5}
//           />
//         </mesh>

//         {/* Gold Cap */}
//         <mesh position={[0, 1.4, 0]}>
//           <cylinderGeometry args={[0.38, 0.45, 0.45, 32]} />
//           <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.15} />
//         </mesh>

//         {/* Neck */}
//         <mesh position={[0, 1.15, 0]}>
//           <cylinderGeometry args={[0.28, 0.32, 0.25, 32]} />
//           <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
//         </mesh>
//       </group>
//     </Float>
//   );
// }

// export default function PerfumeBottle3D() {
//   return (
//     <div className="w-full h-[420px] md:h-[520px]">
//       <Canvas camera={{ position: [0, 0, 6], fov: 42 }}>
//         <ambientLight intensity={0.5} />
//         <spotLight position={[10, 15, 10]} angle={0.2} penumbra={1} intensity={1.2} castShadow />
//         <pointLight position={[-8, -5, -5]} intensity={0.6} color="#D4AF37" />
//         <Bottle />
//         <ContactShadows position={[0, -1.6, 0]} opacity={0.5} scale={12} blur={2.5} />
//         <Environment preset="city" />
//         <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
//       </Canvas>
//     </div>
//   );
// }
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float } from "@react-three/drei";

function Bottle() {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 1.5) * 0.4;
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={group}>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.85, 2.4, 64]} />
          <meshPhysicalMaterial
            color="#0f0f1a"
            metalness={0.9}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.15}
          />
        </mesh>

        {/* Cap */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.38, 0.45, 0.45, 32]} />
          <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.15} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 1.15, 0]}>
          <cylinderGeometry args={[0.28, 0.32, 0.25, 32]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <spotLight
        position={[10, 15, 10]}
        angle={0.25}
        penumbra={1}
        intensity={1}
      />
      <pointLight position={[-6, -3, -4]} intensity={0.5} color="#D4AF37" />
      <Bottle />
      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.4}
        scale={12}
        blur={2.5}
      />
      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.2}
        enablePan={false}
      />
    </>
  );
}

export default function PerfumeBottle3D() {
  return (
    <div className="w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            Loading 3D...
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}