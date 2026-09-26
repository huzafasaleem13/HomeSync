import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import { useState } from "react";

const rooms = [
  {
    id: "living",
    name: "Living room",
    position: [-2.05, 0, -1.25],
    size: [3.7, 0.14, 3.1],
    color: "#b9c4ac",
    temperature: "23°C",
    devices: "4 devices online",
    furniture: [
      { position: [-2.25, 0.35, -1.3], size: [1.7, 0.5, 0.75], color: "#72685c" },
      { position: [-0.95, 0.24, -1.95], size: [0.65, 0.3, 0.65], color: "#8b7866" },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    position: [1.85, 0, -1.25],
    size: [3.1, 0.14, 3.1],
    color: "#d8b894",
    temperature: "24°C",
    devices: "3 devices online",
    furniture: [
      { position: [1.85, 0.45, -1.25], size: [1.5, 0.75, 0.75], color: "#8a7967" },
      { position: [3.05, 0.35, -0.55], size: [0.65, 0.5, 1.25], color: "#a08d79" },
    ],
  },
  {
    id: "bedroom",
    name: "Master bedroom",
    position: [-2.05, 0, 2.25],
    size: [3.7, 0.14, 2.7],
    color: "#aeb9c4",
    temperature: "22°C",
    devices: "2 devices online",
    furniture: [
      { position: [-2.15, 0.32, 2.25], size: [1.85, 0.4, 1.25], color: "#6d7479" },
      { position: [-0.85, 0.35, 3.0], size: [0.55, 0.55, 0.55], color: "#8d8580" },
    ],
  },
  {
    id: "bathroom",
    name: "Bathroom",
    position: [0.9, 0, 2.25],
    size: [1.95, 0.14, 2.7],
    color: "#c2d0ca",
    temperature: "25°C",
    devices: "2 devices online",
    furniture: [
      { position: [0.75, 0.32, 2.4], size: [0.85, 0.5, 0.85], color: "#d5d0c6" },
    ],
  },
  {
    id: "entrance",
    name: "Entrance",
    position: [3.1, 0, 2.25],
    size: [1.85, 0.14, 2.7],
    color: "#c9baaa",
    temperature: "21°C",
    devices: "1 device online",
    furniture: [
      { position: [3.35, 0.3, 2.45], size: [0.65, 0.45, 1.1], color: "#876f5b" },
    ],
  },
];

const outerWalls = [
  { position: [0, 0.48, -2.9], size: [7.9, 0.82, 0.14] },
  { position: [0, 0.48, 3.65], size: [7.9, 0.82, 0.14] },
  { position: [-3.95, 0.48, 0.38], size: [0.14, 0.82, 6.7] },
  { position: [3.95, 0.48, 0.38], size: [0.14, 0.82, 6.7] },
];

export default function SmartHomeScene({ darkMode }) {
  const [selectedRoomId, setSelectedRoomId] = useState("living");
  const [hoveredRoomId, setHoveredRoomId] = useState(null);
  const [lights, setLights] = useState({
    living: true,
    kitchen: false,
    bedroom: true,
    bathroom: false,
    entrance: true,
  });

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);

  function toggleSelectedRoomLight() {
    setLights((currentLights) => ({
      ...currentLights,
      [selectedRoomId]: !currentLights[selectedRoomId],
    }));
  }

  const canvasBg = darkMode ? "#292524" : "#e7e2d7";
  const baseColor = darkMode ? "#1c1917" : "#d6cec0";
  const wallColor = darkMode ? "#3a3530" : "#f2ede3";

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
            Interactive floor plan
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Your home in 3D
          </h2>
        </div>

        <p className="text-sm text-stone-500 dark:text-stone-400">
          Drag to rotate · Scroll to zoom · Select a room
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="h-[560px] overflow-hidden border border-stone-300 bg-[#e7e2d7] dark:border-stone-700 dark:bg-[#292524]">
          <Canvas
            shadows
            camera={{ position: [9, 9, 11], fov: 42 }}
            aria-label="Interactive three-dimensional model of the smart home"
          >
            <color attach="background" args={[canvasBg]} />

            <ambientLight intensity={darkMode ? 0.8 : 1.35} />
            <directionalLight
              castShadow
              intensity={darkMode ? 1.5 : 2.2}
              position={[7, 10, 6]}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />

            <mesh position={[0, -0.18, 0]} receiveShadow>
              <boxGeometry args={[10.3, 0.12, 8.4]} />
              <meshStandardMaterial color={baseColor} roughness={1} />
            </mesh>

            {rooms.map((room) => {
              const isSelected = room.id === selectedRoomId;
              const isHovered = room.id === hoveredRoomId;
              const lightIsOn = lights[room.id];

              return (
                <group
                  key={room.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedRoomId(room.id);
                  }}
                  onPointerOver={(event) => {
                    event.stopPropagation();
                    setHoveredRoomId(room.id);
                    document.body.style.cursor = "pointer";
                  }}
                  onPointerOut={(event) => {
                    event.stopPropagation();
                    setHoveredRoomId((current) => (current === room.id ? null : current));
                    document.body.style.cursor = "auto";
                  }}
                >
                  <mesh
                    castShadow
                    receiveShadow
                    position={room.position}
                    scale={isSelected ? 1.025 : isHovered ? 1.015 : 1}
                  >
                    <boxGeometry args={room.size} />
                    <meshStandardMaterial
                      color={room.color}
                      roughness={0.9}
                      metalness={0}
                    />
                  </mesh>

                  {room.furniture.map((item, index) => (
                    <mesh
                      key={`${room.id}-${index}`}
                      castShadow
                      receiveShadow
                      position={item.position}
                    >
                      <boxGeometry args={item.size} />
                      <meshStandardMaterial
                        color={item.color}
                        roughness={0.95}
                        metalness={0}
                      />
                    </mesh>
                  ))}

                  <pointLight
                    color="#f5d8a5"
                    intensity={lightIsOn ? 2.2 : 0}
                    distance={4}
                    position={[room.position[0], 2.3, room.position[2]]}
                  />

                  {(isSelected || isHovered) && (
                    <Html
                      position={[room.position[0], 0.85, room.position[2]]}
                      center
                      distanceFactor={10}
                    >
                      <div
                        className={`pointer-events-none whitespace-nowrap border px-2.5 py-1.5 text-xs shadow-sm transition-all duration-150 ${
                          isSelected
                            ? "border-stone-500 bg-[#f5f1e8] text-stone-900 dark:border-stone-500 dark:bg-[#292524] dark:text-stone-100"
                            : "border-stone-300 bg-[#faf8f5]/95 text-stone-700 backdrop-blur-xs dark:border-stone-600 dark:bg-[#201d1b]/95 dark:text-stone-300"
                        }`}
                      >
                        <div className="font-semibold">{room.name}</div>
                        {isHovered && (
                          <div className="mt-1 flex items-center gap-1.5 border-t border-stone-200/80 pt-1 text-[11px] font-medium text-stone-500 dark:border-stone-700/80 dark:text-stone-400">
                            <span>{room.temperature}</span>
                            <span>·</span>
                            <span>{room.devices}</span>
                          </div>
                        )}
                      </div>
                    </Html>
                  )}
                </group>
              );
            })}

            {outerWalls.map((wall, index) => (
              <mesh
                key={index}
                castShadow
                receiveShadow
                position={wall.position}
              >
                <boxGeometry args={wall.size} />
                <meshStandardMaterial color={wallColor} roughness={1} />
              </mesh>
            ))}

            <mesh castShadow receiveShadow position={[0, 0.48, 0.7]}>
              <boxGeometry args={[0.14, 0.82, 5.2]} />
              <meshStandardMaterial color={wallColor} roughness={1} />
            </mesh>

            <mesh castShadow receiveShadow position={[-1.95, 0.48, 0.7]}>
              <boxGeometry args={[3.8, 0.82, 0.14]} />
              <meshStandardMaterial color={wallColor} roughness={1} />
            </mesh>

            <ContactShadows
              position={[0, -0.11, 0]}
              opacity={0.3}
              scale={11}
              blur={2.5}
              far={4}
            />

            <OrbitControls
              enablePan={false}
              minDistance={8}
              maxDistance={16}
              maxPolarAngle={Math.PI / 2.15}
              minPolarAngle={Math.PI / 4.1}
            />
          </Canvas>
        </div>

        <aside className="border border-stone-300 bg-[#f5f1e8] p-5 dark:border-stone-700 dark:bg-[#231f1c]">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
            Selected room
          </p>

          <h3 className="mt-2 text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            {selectedRoom.name}
          </h3>

          <div className="mt-6 space-y-4 border-y border-stone-300 py-5 dark:border-stone-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500 dark:text-stone-400">Temperature</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {selectedRoom.temperature}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500 dark:text-stone-400">Connected devices</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {selectedRoom.devices}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500 dark:text-stone-400">Main lights</span>
              <span
                className={
                  lights[selectedRoomId]
                    ? "font-semibold text-emerald-700 dark:text-emerald-400"
                    : "font-semibold text-stone-600 dark:text-stone-400"
                }
              >
                {lights[selectedRoomId] ? "On" : "Off"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleSelectedRoomLight}
            className="mt-5 w-full border border-stone-500 bg-stone-800 px-4 py-3 text-sm font-semibold text-stone-50 transition-colors duration-200 hover:bg-stone-700 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-300"
          >
            Turn lights {lights[selectedRoomId] ? "off" : "on"}
          </button>

          <div className="mt-5 space-y-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                type="button"
                onClick={() => setSelectedRoomId(room.id)}
                onMouseEnter={() => setHoveredRoomId(room.id)}
                onMouseLeave={() => setHoveredRoomId((current) => (current === room.id ? null : current))}
                className={`w-full border px-3 py-2.5 text-left text-sm transition-colors duration-200 ${
                  room.id === selectedRoomId
                    ? "border-stone-500 bg-stone-200 text-stone-900 dark:border-stone-500 dark:bg-stone-700 dark:text-stone-100"
                    : room.id === hoveredRoomId
                    ? "border-stone-400 bg-stone-200/50 text-stone-800 dark:border-stone-600 dark:bg-stone-700/50 dark:text-stone-200"
                    : "border-stone-300 bg-transparent text-stone-600 hover:bg-stone-200/60 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-700/60"
                }`}
              >
                {room.name}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}