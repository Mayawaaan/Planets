import React, { useRef, useState } from 'react'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Text } from '@react-three/drei'
import * as THREE from 'three'

const EllipticalRing = ({ a, b }) => {
  const points = []
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2
    const x = Math.cos(angle) * a
    const z = Math.sin(angle) * b
    points.push(new THREE.Vector3(x, 0, z))
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.08} />
    </line>
  )
}

const Planet = ({ texture, a, b, orbitSpeed, selfSpeed, size, name, onClick, hasRings, isFocused, visible = true, moonTexture }) => {
  const meshRef = useRef()
  const angleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * selfSpeed
    if (isFocused) {
      meshRef.current.position.set(0, 0, 0)
      return
    }
    angleRef.current += delta * orbitSpeed
    const x = Math.cos(angleRef.current) * a
    const z = Math.sin(angleRef.current) * b
    meshRef.current.position.set(x, 0, z)
  })

  return (
    <group ref={meshRef} visible={visible}>
      <mesh onClick={() => onClick(name, { x: 0, y: 0, z: 0 })}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {name === 'Earth' && <Moon onClick={onClick} texture={moonTexture} />}
      {hasRings && (
        <group>
          {Array.from({ length: 1500 }, (_, i) => {
            const angle = (i / 1500) * Math.PI * 2 + Math.random() * 0.5
            const innerRadius = size + 0.6
            const outerRadius = size + 2.2
            const radius = innerRadius + Math.random() * (outerRadius - innerRadius)
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            const y = (Math.random() - 0.5) * 0.08
            const rockSize = 0.015 + Math.random() * 0.025
            return (
              <mesh key={i} position={[x, y, z]}>
                <sphereGeometry args={[rockSize, 6, 6]} />
                <meshStandardMaterial color="gray" />
              </mesh>
            )
          })}
        </group>
      )}
    </group>
  )
}

const Moon = ({ onClick, texture }) => {
  const moonRef = useRef()
  const moonAngleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    moonAngleRef.current += delta * 0.5
    const x = Math.cos(moonAngleRef.current) * 1
    const z = Math.sin(moonAngleRef.current) * 1
    moonRef.current.position.set(x, 0, z)
    moonRef.current.rotation.y += delta * 0.1
  })

  return (
    <mesh
      ref={moonRef}
      onClick={() => {
        const p = moonRef.current ? moonRef.current.position : { x: 0, y: 0, z: 0 }
        onClick('Moon', { x: p.x, y: p.y, z: p.z })
      }}
    >
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

const planetDetails = {
  Sun: {
    description: "The Sun is a G-type main-sequence star powering the Solar System via core hydrogen fusion.",
    type: "Star (G2V)",
    radius: "696,340 km",
    mass: "1.989 × 10^30 kg",
    gravity: "274 m/s²",
    surfaceTemp: "~5,778 K",
    luminosity: "1 L☉",
    distanceFromSun: "0 AU",
    orbitalPeriod: "N/A",
    moons: "N/A",
    rings: "No"
  },
  Mercury: {
    description: "Smallest and innermost planet with extreme temperature swings and a tenuous exosphere.",
    type: "Terrestrial",
    radius: "2,439.7 km",
    mass: "3.3011 × 10^23 kg",
    gravity: "3.7 m/s²",
    dayLength: "58.6 Earth days",
    orbitalPeriod: "88 Earth days",
    distanceFromSun: "0.39 AU (58 million km)",
    atmosphere: "Exosphere (Na, K, O)",
    avgTemp: "~167 °C average",
    moons: 0,
    rings: "No"
  },
  Venus: {
    description: "Similar size to Earth but with a dense CO₂ atmosphere and runaway greenhouse effect.",
    type: "Terrestrial",
    radius: "6,051.8 km",
    mass: "4.8675 × 10^24 kg",
    gravity: "8.87 m/s²",
    dayLength: "243 Earth days (retrograde)",
    orbitalPeriod: "225 Earth days",
    distanceFromSun: "0.72 AU (108 million km)",
    atmosphere: "CO₂, N₂, sulfuric acid clouds",
    avgTemp: "~465 °C",
    moons: 0,
    rings: "No"
  },
  Earth: {
    description: "Only known planet with life; liquid water and protective magnetic field and atmosphere.",
    type: "Terrestrial",
    radius: "6,371 km",
    mass: "5.972 × 10^24 kg",
    gravity: "9.81 m/s²",
    dayLength: "23 h 56 m",
    orbitalPeriod: "365.25 days",
    distanceFromSun: "1 AU (150 million km)",
    atmosphere: "N₂, O₂",
    avgTemp: "~15 °C",
    moons: 1,
    rings: "No"
  },
  Moon: {
    description: "Earth's only natural satellite; heavily cratered with basaltic maria.",
    type: "Natural satellite",
    radius: "1,737.4 km",
    mass: "7.342 × 10^22 kg",
    gravity: "1.62 m/s²",
    dayLength: "27.3 days (synchronous)",
    orbitalPeriod: "27.3 days",
    distanceFromEarth: "384,400 km",
    atmosphere: "Exosphere (He, Ar, Na)",
    avgTemp: "~−20 °C average",
    moons: "Moon",
    rings: "No"
  },
  Mars: {
    description: "The Red Planet with iron oxide dust, extinct volcanoes, and polar ice caps.",
    type: "Terrestrial",
    radius: "3,389.5 km",
    mass: "6.4171 × 10^23 kg",
    gravity: "3.71 m/s²",
    dayLength: "24 h 37 m",
    orbitalPeriod: "687 Earth days",
    distanceFromSun: "1.52 AU (228 million km)",
    atmosphere: "CO₂, Ar, N₂",
    avgTemp: "~−63 °C",
    moons: 2,
    rings: "No"
  },
  Jupiter: {
    description: "Largest planet; gas giant with Great Red Spot and strong magnetic field.",
    type: "Gas giant",
    radius: "69,911 km",
    mass: "1.898 × 10^27 kg",
    gravity: "24.79 m/s²",
    dayLength: "9 h 56 m",
    orbitalPeriod: "11.86 Earth years",
    distanceFromSun: "5.20 AU (778 million km)",
    atmosphere: "H₂, He, trace CH₄, NH₃",
    avgTemp: "~−108 °C (cloud tops)",
    moons: 95,
    rings: "Faint ring system"
  },
  Saturn: {
    description: "Gas giant famous for its extensive ring system made of ice and rock.",
    type: "Gas giant",
    radius: "58,232 km",
    mass: "5.683 × 10^26 kg",
    gravity: "10.44 m/s²",
    dayLength: "10 h 33 m",
    orbitalPeriod: "29.46 Earth years",
    distanceFromSun: "9.58 AU (1.43 billion km)",
    atmosphere: "H₂, He, trace CH₄",
    avgTemp: "~−139 °C (cloud tops)",
    moons: 146,
    rings: "Prominent rings"
  },
  Uranus: {
    description: "Ice giant with axial tilt of ~98°, leading to extreme seasons.",
    type: "Ice giant",
    radius: "25,362 km",
    mass: "8.681 × 10^25 kg",
    gravity: "8.69 m/s²",
    dayLength: "17 h 14 m",
    orbitalPeriod: "84 Earth years",
    distanceFromSun: "19.2 AU (2.87 billion km)",
    atmosphere: "H₂, He, CH₄",
    avgTemp: "~−195 °C",
    moons: 28,
    rings: "Faint rings"
  },
  Neptune: {
    description: "Farthest known planet; ice giant with supersonic winds and moon Triton.",
    type: "Ice giant",
    radius: "24,622 km",
    mass: "1.024 × 10^26 kg",
    gravity: "11.15 m/s²",
    dayLength: "16 h 6 m",
    orbitalPeriod: "165 Earth years",
    distanceFromSun: "30.1 AU (4.5 billion km)",
    atmosphere: "H₂, He, CH₄",
    avgTemp: "~−201 °C",
    moons: 16,
    rings: "Faint rings"
  }
}

const App = () => {
  const MercuryTexture = useLoader(THREE.TextureLoader, '/2k_mercury.jpg')
  const VenusTexture = useLoader(THREE.TextureLoader, '/2k_venus_surface.jpg')
  const EarthTexture = useLoader(THREE.TextureLoader, '/2k_earth_daymap.jpg')
  const MarsTexture = useLoader(THREE.TextureLoader, '/2k_mars.jpg')
  const JupiterTexture = useLoader(THREE.TextureLoader, '/2k_jupiter.jpg')
  const SaturnTexture = useLoader(THREE.TextureLoader, '/2k_saturn.jpg')
  const UranusTexture = useLoader(THREE.TextureLoader, '/2k_uranus.jpg')
  const NeptuneTexture = useLoader(THREE.TextureLoader, '/2k_neptune.jpg')
  const SunTexture = useLoader(THREE.TextureLoader, '/2k_sun.jpg')
  const MoonTexture = useLoader(THREE.TextureLoader, '/2k_mercury.jpg')

  const [selected, setSelected] = useState(null)
  const [focusedPlanet, setFocusedPlanet] = useState(null)
  // Simplified state: only selection and focus retained
  const controlsRef = useRef()

  const handlePlanetClick = (planet, position) => {
    setSelected({ name: planet, ...planetDetails[planet] })
    setFocusedPlanet(planet)
    if (controlsRef.current) {
      // Set target to the planet's position
      controlsRef.current.target.set(position.x, position.y, position.z)
      // Position camera at a good distance from the planet
      const distance = planet === 'Sun' ? 8 : 3
      controlsRef.current.object.position.set(position.x, position.y, position.z + distance)
      // Update the controls to apply the changes
      controlsRef.current.update()
    }
  }

  const handleClose = () => {
    setSelected(null)
    setFocusedPlanet(null)
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.object.position.set(0, 0, 15)
      controlsRef.current.update()
    }
  }

  // No entrance/exit animations

  return (
    <>
      <Canvas camera={{ position: [0, 0, 60] }}>
        <Stars />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        {/* Sun as primary light source */}
        <pointLight position={[0, 0, 0]} intensity={2.5} distance={120} decay={2} />
        <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
        
        {/* Removed wormhole/black hole effects */}
        
        {/* Sun */}
        <mesh position={[0, 0, 0]} visible={!focusedPlanet || focusedPlanet === 'Sun'} onClick={() => handlePlanetClick('Sun', { x: 0, y: 0, z: 0 })}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial map={SunTexture} />
        </mesh>
        {/* Orbit lines */}
        {!focusedPlanet && (
          <>
            <EllipticalRing a={5} b={4} />
            <EllipticalRing a={7} b={5.6} />
            <EllipticalRing a={9} b={7.2} />
            <EllipticalRing a={11} b={8.8} />
            <EllipticalRing a={15} b={12} />
            <EllipticalRing a={20} b={16} />
            <EllipticalRing a={26} b={20.8} />
            <EllipticalRing a={32} b={25.6} />
          </>
        )}
        {focusedPlanet === 'Mercury' && <EllipticalRing a={5} b={4} />}
        {focusedPlanet === 'Venus' && <EllipticalRing a={7} b={5.6} />}
        {focusedPlanet === 'Earth' && <EllipticalRing a={9} b={7.2} />}
        {focusedPlanet === 'Mars' && <EllipticalRing a={11} b={8.8} />}
        {focusedPlanet === 'Jupiter' && <EllipticalRing a={15} b={12} />}
        {focusedPlanet === 'Saturn' && <EllipticalRing a={20} b={16} />}
        {focusedPlanet === 'Uranus' && <EllipticalRing a={26} b={20.8} />}
        {focusedPlanet === 'Neptune' && <EllipticalRing a={32} b={25.6} />}
        {/* Planets */}
        <Planet
          texture={MercuryTexture}
          a={5}
          b={4}
          orbitSpeed={0.4}
          selfSpeed={0.1}
          size={0.3}
          name="Mercury"
          onClick={handlePlanetClick}
          isFocused={focusedPlanet === 'Mercury'}
          visible={!focusedPlanet || focusedPlanet === 'Mercury'}
        />
        <Planet
          texture={VenusTexture}
          a={7}
          b={5.6}
          orbitSpeed={0.3}
          selfSpeed={0.075}
          size={0.5}
          name="Venus"
          onClick={handlePlanetClick}
          isFocused={focusedPlanet === 'Venus'}
          visible={!focusedPlanet || focusedPlanet === 'Venus'}
        />
        <Planet
          texture={EarthTexture}
          a={9}
          b={7.2}
          orbitSpeed={0.2}
          selfSpeed={0.05}
          size={0.6}
          name="Earth"
          onClick={handlePlanetClick}
          isFocused={focusedPlanet === 'Earth' || focusedPlanet === 'Moon'}
          visible={!focusedPlanet || focusedPlanet === 'Earth' || focusedPlanet === 'Moon'}
          moonTexture={MoonTexture}
        />
        <Planet
          texture={MarsTexture}
          a={11}
          b={8.8}
          orbitSpeed={0.15}
          selfSpeed={0.04}
          size={0.4}
          name="Mars"
          onClick={handlePlanetClick}
          isFocused={focusedPlanet === 'Mars'}
          visible={!focusedPlanet || focusedPlanet === 'Mars'}
        />
        <Planet
          texture={JupiterTexture}
          a={15}
          b={12}
          orbitSpeed={0.125}
          selfSpeed={0.03}
          size={1.2}
          name="Jupiter"
          onClick={handlePlanetClick}
          isFocused={focusedPlanet === 'Jupiter'}
          visible={!focusedPlanet || focusedPlanet === 'Jupiter'}
        />
        <Planet
          texture={SaturnTexture}
          a={20}
          b={16}
          orbitSpeed={0.1}
          selfSpeed={0.025}
          size={1.0}
          name="Saturn"
          onClick={handlePlanetClick}
          hasRings={true}
          isFocused={focusedPlanet === 'Saturn'}
          visible={!focusedPlanet || focusedPlanet === 'Saturn'}
        />
        <Planet
          texture={UranusTexture}
          a={26}
          b={20.8}
          orbitSpeed={0.075}
          selfSpeed={0.02}
          size={0.7}
          name="Uranus"
          onClick={handlePlanetClick}
          isFocused={focusedPlanet === 'Uranus'}
          visible={!focusedPlanet || focusedPlanet === 'Uranus'}
        />
        <Planet
          texture={NeptuneTexture}
          a={32}
          b={25.6}
          orbitSpeed={0.05}
          selfSpeed={0.015}
          size={0.7}
          name="Neptune"
          onClick={handlePlanetClick}
          isFocused={focusedPlanet === 'Neptune'}
          visible={!focusedPlanet || focusedPlanet === 'Neptune'}
        />
      </Canvas>
      {selected && (
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,20,20,0.9))',
          color: 'white',
          padding: '20px',
          borderRadius: '15px',
          maxWidth: '350px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2 style={{
            margin: '0 0 15px 0',
            color: '#feca57',
            textAlign: 'center',
            fontSize: '24px',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}>{selected.name}</h2>
          <p style={{ margin: '10px 0', lineHeight: '1.5', fontSize: '14px' }}>{selected.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '15px 0' }}>
            {selected.type && <p style={{ margin: '0', fontSize: '12px' }}><strong>Type:</strong> {selected.type}</p>}
            {selected.radius && <p style={{ margin: '0', fontSize: '12px' }}><strong>Radius:</strong> {selected.radius}</p>}
            {selected.mass && <p style={{ margin: '0', fontSize: '12px' }}><strong>Mass:</strong> {selected.mass}</p>}
            {selected.gravity && <p style={{ margin: '0', fontSize: '12px' }}><strong>Gravity:</strong> {selected.gravity}</p>}
            {selected.dayLength && <p style={{ margin: '0', fontSize: '12px' }}><strong>Day Length:</strong> {selected.dayLength}</p>}
            {selected.orbitalPeriod && <p style={{ margin: '0', fontSize: '12px' }}><strong>Orbital Period:</strong> {selected.orbitalPeriod}</p>}
            {selected.distanceFromSun && <p style={{ margin: '0', fontSize: '12px' }}><strong>Distance from Sun:</strong> {selected.distanceFromSun}</p>}
            {selected.distanceFromEarth && <p style={{ margin: '0', fontSize: '12px' }}><strong>Distance from Earth:</strong> {selected.distanceFromEarth}</p>}
            {selected.atmosphere && <p style={{ margin: '0', fontSize: '12px' }}><strong>Atmosphere:</strong> {selected.atmosphere}</p>}
            {selected.avgTemp && <p style={{ margin: '0', fontSize: '12px' }}><strong>Avg Temp:</strong> {selected.avgTemp}</p>}
            {selected.surfaceTemp && <p style={{ margin: '0', fontSize: '12px' }}><strong>Surface Temp:</strong> {selected.surfaceTemp}</p>}
            {selected.luminosity && <p style={{ margin: '0', fontSize: '12px' }}><strong>Luminosity:</strong> {selected.luminosity}</p>}
            {selected.moons !== undefined && <p style={{ margin: '0', fontSize: '12px' }}><strong>Moons:</strong> {selected.moons}</p>}
            {selected.rings && <p style={{ margin: '0', fontSize: '12px' }}><strong>Rings:</strong> {selected.rings}</p>}
          </div>
          <button onClick={handleClose} style={{
            display: 'block',
            margin: '20px auto 0',
            background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
            border: 'none',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(255,107,107,0.4)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>Close</button>
        </div>
      )}
      
      {/* Removed black hole / wormhole buttons */}
    </>
  )
}

export default App
