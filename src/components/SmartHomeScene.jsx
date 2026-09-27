import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CloudSun,
  Lamp,
  Lock,
  Minus,
  Plus,
  Speaker,
  Tv,
  Wind,
} from "lucide-react";

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

const outdoorWeather = {
  temperature: "18°C",
  condition: "Partly cloudy",
  humidity: "58%",
  wind: "14 km/h",
  uvIndex: "Moderate",
};

const initialDevices = {
  living: [
    { id: "living-tv", name: "Smart TV", type: "tv", isOn: true },
    { id: "living-lamp", name: "Floor lamp", type: "lamp", isOn: true },
    { id: "living-speaker", name: "Audio soundbar", type: "speaker", isOn: false },
    { id: "living-ac", name: "Climate AC", type: "climate", isOn: true },
  ],
  kitchen: [
    { id: "kitchen-oven", name: "Induction cooktop", type: "lamp", isOn: false },
    { id: "kitchen-lights", name: "Cabinet lighting", type: "lamp", isOn: false },
    { id: "kitchen-fridge", name: "Cooling unit", type: "climate", isOn: true },
  ],
  bedroom: [
    { id: "bedroom-ac", name: "Air purifier", type: "climate", isOn: true },
    { id: "bedroom-lamp", name: "Reading lamp", type: "lamp", isOn: true },
  ],
  bathroom: [
    { id: "bathroom-vent", name: "Exhaust fan", type: "climate", isOn: false },
    { id: "bathroom-mirror", name: "Mirror backlight", type: "lamp", isOn: false },
  ],
  entrance: [
    { id: "entrance-lock", name: "Smart deadbolt", type: "lock", isOn: true },
  ],
};

function getDeviceIcon(type) {
  switch (type) {
    case "tv":
      return Tv;
    case "speaker":
      return Speaker;
    case "climate":
      return Wind;
    case "lock":
      return Lock;
    case "lamp":
    default:
      return Lamp;
  }
}

export default function SmartHomeScene({ darkMode }) {
  const [selectedRoomId, setSelectedRoomId] = useState("living");
  const [hoveredRoomId, setHoveredRoomId] = useState(null);
  const [isDeviceListExpanded, setIsDeviceListExpanded] = useState(true);
  const [lights, setLights] = useState({
    living: true,
    kitchen: false,
    bedroom: true,
    bathroom: false,
    entrance: true,
  });
  const [temperatures, setTemperatures] = useState({
    living: 23,
    kitchen: 24,
    bedroom: 22,
    bathroom: 25,
    entrance: 21,
  });
  const [roomDevices, setRoomDevices] = useState(initialDevices);

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);

  function toggleSelectedRoomLight() {
    setLights((currentLights) => ({
      ...currentLights,
      [selectedRoomId]: !currentLights[selectedRoomId],
    }));
  }

  function toggleDevice(roomId, deviceId) {
    setRoomDevices((current) => ({
      ...current,
      [roomId]: current[roomId].map((device) =>
        device.id === deviceId ? { ...device, isOn: !device.isOn } : device
      ),
    }));
  }

  function getDeviceCount(roomId) {
    const devices = roomDevices[roomId] || [];
    const onCount = devices.filter((d) => d.isOn).length;
    return `${onCount}/${devices.length} active`;
  }

  function adjustTemperature(delta) {
    setTemperatures((current) => {
      const currentVal = current[selectedRoomId] ?? 22;
      const nextVal = Math.min(32, Math.max(16, currentVal + delta));
      return {
        ...current,
        [selectedRoomId]: nextVal,
      };
    });
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

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
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
                            <span>{temperatures[room.id]}°C</span>
                            <span>·</span>
                            <span>{getDeviceCount(room.id)}</span>
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

        <aside className="flex flex-col justify-between border border-stone-300 bg-[#f5f1e8] p-4 xl:h-[560px] dark:border-stone-700 dark:bg-[#231f1c]">
          <div className="space-y-3">
            {/* Outdoor climate widget */}
            <div className="flex items-center justify-between border border-stone-300 bg-[#f7f4ed] px-3.5 py-2.5 dark:border-stone-700 dark:bg-[#292524]">
              <div className="flex items-center gap-2.5">
                <CloudSun className="h-5 w-5 shrink-0 text-stone-600 dark:text-stone-300" />
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                      {outdoorWeather.temperature}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      {outdoorWeather.condition}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    Humidity {outdoorWeather.humidity} · Wind {outdoorWeather.wind}
                  </p>
                </div>
              </div>
              <span className="border border-stone-300 bg-stone-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300">
                UV {outdoorWeather.uvIndex}
              </span>
            </div>

            {/* Room quick switcher */}
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                Rooms
              </p>
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 xl:grid-cols-2">
                {rooms.map((room) => {
                  const isSelected = room.id === selectedRoomId;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setSelectedRoomId(room.id)}
                      onMouseEnter={() => setHoveredRoomId(room.id)}
                      onMouseLeave={() => setHoveredRoomId((current) => (current === room.id ? null : current))}
                      className={`truncate border px-2 py-1.5 text-left text-xs font-medium transition-colors duration-150 ${
                        isSelected
                          ? "border-stone-700 bg-stone-800 text-stone-50 dark:border-stone-400 dark:bg-stone-200 dark:text-stone-900"
                          : room.id === hoveredRoomId
                          ? "border-stone-400 bg-stone-200/60 text-stone-900 dark:border-stone-600 dark:bg-stone-700/60 dark:text-stone-100"
                          : "border-stone-300 bg-white/70 text-stone-600 hover:bg-stone-200/50 dark:border-stone-700 dark:bg-[#1f1c1a]/60 dark:text-stone-400 dark:hover:bg-stone-700/50"
                      }`}
                    >
                      {room.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected room details */}
            <div className="border border-stone-300 bg-[#f7f4ed] p-3 dark:border-stone-700 dark:bg-[#292524]">
              <div className="flex items-center justify-between border-b border-stone-200/80 pb-2 dark:border-stone-700/80">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                    Active room
                  </p>
                  <h3 className="text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    {selectedRoom.name}
                  </h3>
                </div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  {getDeviceCount(selectedRoomId)}
                </span>
              </div>

              <div className="mt-2.5 space-y-2 text-xs">
                {/* Climate control row */}
                <div className="flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-400">Climate</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => adjustTemperature(-1)}
                      className="flex h-5 w-5 items-center justify-center border border-stone-300 bg-white text-stone-600 hover:bg-stone-200 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
                      aria-label="Decrease temperature"
                    >
                      <Minus className="h-2.5 w-2.5" />
                    </button>
                    <span className="min-w-8 text-center font-semibold text-stone-800 dark:text-stone-200">
                      {temperatures[selectedRoomId]}°C
                    </span>
                    <button
                      type="button"
                      onClick={() => adjustTemperature(1)}
                      className="flex h-5 w-5 items-center justify-center border border-stone-300 bg-white text-stone-600 hover:bg-stone-200 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
                      aria-label="Increase temperature"
                    >
                      <Plus className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </div>

                {/* Main lighting inline row */}
                <div className="flex items-center justify-between border-t border-stone-200/60 pt-1.5 dark:border-stone-700/60">
                  <span className="text-stone-600 dark:text-stone-400">Illumination</span>
                  <button
                    type="button"
                    onClick={toggleSelectedRoomLight}
                    className={`border px-2.5 py-0.5 text-[11px] font-semibold transition-colors duration-150 ${
                      lights[selectedRoomId]
                        ? "border-emerald-800/30 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-400"
                        : "border-stone-300 bg-white text-stone-600 hover:bg-stone-200 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
                    }`}
                  >
                    Lights {lights[selectedRoomId] ? "On" : "Off"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Room devices section */}
          <div className="mt-3 flex min-h-0 flex-1 flex-col border-t border-stone-300 pt-3 dark:border-stone-700">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                Room devices ({roomDevices[selectedRoomId]?.length || 0})
              </p>
              <button
                type="button"
                onClick={() => setIsDeviceListExpanded((open) => !open)}
                className="flex items-center gap-1 text-[11px] font-medium text-stone-500 transition-colors hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
                aria-label={isDeviceListExpanded ? "Collapse device list" : "Expand device list"}
              >
                <span>{isDeviceListExpanded ? "Hide" : "Show"}</span>
                {isDeviceListExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            </div>

            {isDeviceListExpanded && (
              <div className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-0.5">
                {roomDevices[selectedRoomId]?.map((device) => {
                  const DeviceIcon = getDeviceIcon(device.type);

                  return (
                    <div
                      key={device.id}
                      className={`flex items-center justify-between border px-2.5 py-1.5 transition-colors duration-150 ${
                        device.isOn
                          ? "border-stone-400 bg-stone-200/60 dark:border-stone-600 dark:bg-stone-800/60"
                          : "border-stone-300 bg-transparent dark:border-stone-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <DeviceIcon className="h-3.5 w-3.5 shrink-0 text-stone-500 dark:text-stone-400" />
                        <div>
                          <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                            {device.name}
                          </p>
                          <p className="text-[9px] text-stone-500 dark:text-stone-400">
                            {device.isOn ? "Operating" : "Standby"}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleDevice(selectedRoomId, device.id)}
                        className={`border px-2 py-0.5 text-[10px] font-semibold transition-colors duration-150 ${
                          device.isOn
                            ? "border-stone-700 bg-stone-800 text-stone-50 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900"
                            : "border-stone-300 text-stone-600 hover:bg-stone-200/60 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700/60"
                        }`}
                      >
                        {device.isOn ? "On" : "Off"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}