import React, { useEffect, useState, useRef } from 'react'; 
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import DetailsPanel from './DetailsPanel'; 
import mercuryImage from './assets/mercuryuv.jpg'; 
import saturnRingTexture from './assets/saturnring.png'; 
import mercuryfullImage from './assets/mercuryfull1.jpg';
import venusImage from './assets/venusuv.jpg';
import asteroidImage from './assets/asteroiduv.jpg';
import earthImage from './assets/globe.jpg';
import marsImage from './assets/marsuv.jpg';
import jupiterImage from './assets/jupiteruv.jpg';
import saturnImage from './assets/saturn.jpg';
import uranusImage from './assets/uranosuv.jpg';
import neptuneImage from './assets/neptuneuv.jpg';
import sunImage from './assets/nsun.jpg';
import moonImage from './assets/moonuv.jpg';
import venusfullImage from './assets/venusfull.jpg';
import earthfullImage from './assets/earthfull.png';
import marsfullImage from './assets/marsfull.jpg';
import jupiterfullImage from './assets/jupiterfull.jpg';
import saturnfullImage from './assets/saturnfull.jpg';
import uranusfullImage from './assets/uranusfull.jpg';
import neptunefullImage from './assets/neptunefulljpg.jpg';
import plutofullImage from './assets/plutofull.jpg';
import './details-panel.css';
import HoverLabel from './HoverLabel';
import { texture } from 'three/webgpu';

// The orbital data for each planet
const orbitsData = [
    { name: 'Mercury', semiMajorAxis: 0.39, period: 88, rotationPeriod: 58.65 },
    { name: 'Venus', semiMajorAxis: 0.72, period: 225, rotationPeriod: 243 },
    { name: 'Earth', semiMajorAxis: 1.0, period: 365, rotationPeriod: 23.934 },
    { name: 'Mars', semiMajorAxis: 1.52, period: 687, rotationPeriod: 24.623 },
    { name: 'Jupiter', semiMajorAxis: 5.2, period: 4333, rotationPeriod: 9.842 },
    { name: 'Saturn', semiMajorAxis: 9.58, period: 10759, rotationPeriod: 10.233 },
    { name: 'Uranus', semiMajorAxis: 19.22, period: 30688, rotationPeriod: 16.5 },
    { name: 'Neptune', semiMajorAxis: 30.05, period: 60182, rotationPeriod: 18.5 },
];

// The properties of celestial bodies
const globesData = [
    { 
        name: 'Sun',
        description: 'The Sun is the star at the center of our solar system, providing light and heat to the planets.',
        image: sunImage,
        category: 'Star',
        diameter: 1392700,
        mass: 333000,
        rotationPeriod: 25, // Rotation period in days
        unit: 'days',
        lengthOfYear: 0, // Not applicable
        dayyear: 'days',
        tilt: 0 
    },
    { 
        name: 'Moon',
        description: 'The Moon is Earth’s only natural satellite, influencing tides and stabilizing the planet’s rotation.',
        image: moonImage,
        category: 'Natural Satellite',
        diameter: 3474,
        mass: 0.0123,
        rotationPeriod: 27.3, // Days
        unit: 'days',
        lengthOfYear: 27.3, // Days
        dayyear: 'earth days',
        tilt: 1.5 
    },
    { name: 'Mercury', 
        description: 'Mercury is the closest planet to the Sun and has a very thin atmosphere, causing extreme temperature variations.',
        category: 'Terrestrial Planet', image: mercuryfullImage,
        diameter: 4878, mass: 0.06, rotationPeriod: 58.65, unit: 'days',lengthOfYear: 88, dayyear:'earth days', tilt: 7 },
    { name: 'Venus', description: 'Venus is similar in size to Earth but has a thick, toxic atmosphere and surface temperatures hot enough to melt lead.',
        image: venusfullImage,
        category: 'Terrestrial Planet', diameter: 12100,dayyear:'earth days', lengthOfYear:225,mass: 0.82, rotationPeriod: 243, unit: 'days',tilt: 177 },
    { name: 'Earth', description: 'Earth is the only planet known to support life, with a diverse climate and ecosystems.',
        image: earthfullImage,
        category: 'Terrestrial Planet',
        diameter: 12756, mass: 1.00, rotationPeriod: 23.934,unit: 'days',dayyear:'earth days', lengthOfYear:365.25,tilt: 23 },
    { name: 'Mars', description: 'Mars, known as the Red Planet, has a thin atmosphere and is home to the tallest volcano in the Solar System.',
        image: marsfullImage,
        category: 'Terrestrial Planet',
        diameter: 6794, mass: 0.11, rotationPeriod: 24.623,unit: 'days',dayyear:'earth years', lengthOfYear:1.88,tilt: 25 },
    { name: 'Jupiter',  description: 'Jupiter is the largest planet in the Solar System and features the Great Red Spot, a giant storm.',
        image: jupiterfullImage,
        category: 'Gas Giant',
        diameter: 142800, mass: 317.89, rotationPeriod: 9.842,dayyear:'earth years', lengthOfYear:11.86, tilt: 3 },
    { name: 'Saturn', description: 'Saturn is known for its extensive ring system and has over 80 moons.',
        image: saturnfullImage,
        category: 'Gas Giant',
        diameter: 120000, mass: 95.17, rotationPeriod: 10.233,dayyear:'earth years', lengthOfYear:29.45, tilt: 27 },
    { name: 'Uranus', description: 'Uranus rotates on its side and has a pale blue color due to methane in its atmosphere.',
        image: uranusfullImage,
        category: 'Ice Giant',
        diameter: 52400, mass: 14.56, rotationPeriod: 16.5,dayyear:'earth years', lengthOfYear:84, tilt: 98 },
    { name: 'Neptune', description: 'Neptune is a deep blue planet known for its strong winds and dark storms.',
        image: neptunefullImage,
        category: 'Ice Giant',
        diameter: 48400, mass: 17.24, rotationPeriod: 18.5,dayyear:'earth years', lengthOfYear:164.81, tilt: 30 },
    { name: 'Pluto',  description: 'Pluto is a dwarf planet known for its icy surface and complex atmosphere.',
        image: plutofullImage,
        category: 'Dwarf Planet',
        diameter: 2445, mass: 0.002, rotationPeriod: 6.39,dayyear: 'earth years', lengthOfYear:248.89, tilt: 118 },
];
const Orrery = () => {
    const [celestialBodies, setCelestialBodies] = useState([]);
    const [selectedBody, setSelectedBody] = useState(null); 
    const [hoveredPlanet, setHoveredPlanet] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

    const mountRef = useRef();
    const sceneRef = useRef();
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    const earthRef = useRef();
    const moonRef = useRef();
    const composer = useRef();
    const saturnMesh = useRef(); 
    
    useEffect(() => {
        fetch(`https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=w7daB7ZZdRJuRgIB0zJ4gyhlDG9dsC4RdfuzcyCP`)
            .then(response => response.json())
            .then(data => setCelestialBodies(data.near_earth_objects))
            .catch(error => console.error('Error fetching data:', error));
    }, []);
    useEffect(() => {
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        //new code
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);
        //new code
        const createSaturnRing = () => {
            const saturnRingGeometry = new THREE.RingGeometry(1.5, 2.5, 32); // Inner and outer radius
            const saturnRingMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5 // You can adjust the opacity
            });

            const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
            saturnRing.rotation.x = Math.PI / 2; // Rotate to lie flat
            saturnRing.position.set(0, 0, 0); // Position it around Saturn
            scene.add(saturnRing);
        };
        
        // Create rings for each planet's orbit
        const createOrbitRings = () => {
            orbitsData.forEach((orbit, index) => {
                const orbitRadius = orbit.semiMajorAxis * 5; // Scale the radius for visibility
                const orbitGeometry = new THREE.RingGeometry(orbitRadius, orbitRadius + 0.05, 64); // Create ring for orbit
                const orbitMaterial = new THREE.MeshBasicMaterial({
                    color: 0x808080,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.3 // Adjust the opacity for visibility
                });

                const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
                orbitRing.rotation.x = Math.PI / 2; // Rotate to lie flat
                orbitRing.position.set(0, 0, 0); // Position it around the Sun
                scene.add(orbitRing);
            });
        };

        
        
        //new code
        // Create a starry background with larger stars and different color
        const starGeometry = new THREE.BufferGeometry();
        const starColors = [0xffffff, 0xffcc00, 0xff3300, 0x00ccff];
        const starVertices = []; // Define starVertices array here
        
        // Create random star positions and colors
        for (let i = 0; i < 30000; i++) {
            const x = THREE.MathUtils.randFloatSpread(5000); // Random x position
            const y = THREE.MathUtils.randFloatSpread(5000); // Random y position
            const z = THREE.MathUtils.randFloatSpread(5000); // Random z position
            starVertices.push(x, y, z); // Add the vertex position to the array
        }

        // Set the star vertices into the geometry
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

        // Create a material for stars
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff, // Base color (you can customize this)
            size: 0.5, // Adjust size as needed
            transparent: true,
            opacity: 0.8 // Opacity (can be adjusted for effect)
        });
        
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);
        
        const ambientLight = new THREE.AmbientLight(0x404040, 8);
        
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 150, 150);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);
        
        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, 5, 30);
        controls.enableDamping = true;
        
        //new code
        const handleMouseMove = (event) => {
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
            // Raycasting to detect hovered objects
            raycaster.current.setFromCamera(mouse.current, camera);
            const intersects = raycaster.current.intersectObjects(scene.children);
            if (intersects.length > 0) {
                setHoveredPlanet(intersects[0].object.userData.name);
                setHoverPosition({ x: event.clientX +20, y: event.clientY +20});
            } else {
                setHoveredPlanet(null);
            }
            
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        // Create a group for Earth and Moon
const earthMoonGroup = new THREE.Group();
scene.add(earthMoonGroup);

// ...

// When creating the Earth mesh
const earthMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32), 
  new THREE.MeshBasicMaterial({ color: 0x2233ff })
);
earthRef.current = earthMesh;
earthMoonGroup.add(earthRef.current);

// When creating the Moon mesh
const moonMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 32, 32), 
  new THREE.MeshBasicMaterial({ color: 0x888888 })
);
moonRef.current = moonMesh;
earthMoonGroup.add(moonRef.current);
moonRef.current.position.set(2.5, 0, 0); // Initial Moon position

        const animate = function () {
            
            requestAnimationFrame(animate);
            controls.update();
            const currentTime = Date.now() * 0.0001; 
            // Update positions of celestial bodies
            sceneRef.current.traverse((obj) => {
                
                if (obj instanceof THREE.Mesh && obj !== moonRef.current) {
                    const bodyData = orbitsData.find(body => body.name === obj.userData.name);
                    if (bodyData) {
                        const orbitalRadius = bodyData.semiMajorAxis * 10; 
                        const orbitalPeriod = bodyData.period / 365; 
                        const angle = (currentTime / orbitalPeriod) % (Math.PI * 2);
                        obj.position.x = orbitalRadius * Math.cos(angle);
                        obj.position.z = orbitalRadius * Math.sin(angle);

                         // Add rotation based on the planet's rotation period
                        const rotationSpeed = (2 * Math.PI) / (bodyData.rotationPeriod * 60); // Convert days to seconds
                        obj.rotation.y += rotationSpeed; // Rotate around the y-axis
                    }
                }
                
            });
            
        // Update positions of asteroids
       celestialBodies.forEach((body, index) => {
        const asteroidMesh = sceneRef.current.children[index + 9]; // Assuming asteroid meshes are added after planets
        if (asteroidMesh) {
            const orbitalRadius = body.orbital_data.semi_major_axis * 10; 
            const orbitalPeriod = body.orbital_data.orbital_period / 365; 
            const angle = (currentTime / orbitalPeriod) % (Math.PI * 2);
            asteroidMesh.position.x = orbitalRadius * Math.cos(angle);
            asteroidMesh.position.z = orbitalRadius * Math.sin(angle);
        }
    });
            if (earthRef.current && moonRef.current) {
                const earthPosition = earthRef.current.position;
                const moonDistance = 1.5; 
                const moonOrbitSpeed = 0.1; 
                const moonAngle = currentTime * moonOrbitSpeed; 
                moonRef.current.position.x = earthPosition.x + moonDistance * Math.cos(moonAngle);
                moonRef.current.position.z = earthPosition.z + moonDistance * Math.sin(moonAngle);
                moonRef.current.position.y = earthPosition.y; 
            }
            renderer.render(scene, camera);
        };
        animate();
        const handleClick = (event) => {
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.current.setFromCamera(mouse.current, camera);
            const intersects = raycaster.current.intersectObjects(scene.children);
            if (intersects.length > 0) {
                const clickedObject = intersects[0].object;
                //alert(clickedObject.userData.name);
                //setSelectedBody(clickedObject.userData.name);
                const bodyData = globesData.find(body => body.name === clickedObject.userData.name);
                setSelectedBody(bodyData); // Set the selected celestial body
            }
        };
        window.addEventListener('click', handleClick);
        return () => {
            mountRef.current.removeChild(renderer.domElement);
            controls.dispose();
            window.removeEventListener('click', handleClick);
        };
    }, []);
      


    useEffect(() => {
        if (!sceneRef.current) return;
        sceneRef.current.children.slice(2).forEach(child => sceneRef.current.remove(child));
        const textureLoader = new THREE.TextureLoader();
        addSun(sceneRef.current, textureLoader);
        addPlanets(sceneRef.current, textureLoader, earthRef, moonRef);
        celestialBodies.forEach((body) => {
            const size = Math.random() * 0.1 + 0.1; // Increased size for asteroids
            let color = body.is_potentially_hazardous_asteroid ? 0xff0000 : 0xffff00;
            const geometry = new THREE.SphereGeometry(size, 32, 32);
            const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
            const celestialBody = new THREE.Mesh(geometry, material);
            celestialBody.userData.name = body.name;
            const orbitalRadius = body.orbital_data.semi_major_axis * 10; 
            const trueAnomaly = Math.random() * Math.PI * 2;
            celestialBody.position.set(orbitalRadius * Math.cos(trueAnomaly), 0, orbitalRadius * Math.sin(trueAnomaly));
            sceneRef.current.add(celestialBody);
        });
    }, [celestialBodies]);
    const addSun = (scene, textureLoader) => {
        const sunTexture = textureLoader.load(sunImage);
        const sunGeometry = new THREE.SphereGeometry(2, 64, 64);
        const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.userData.name = 'Sun';
        scene.add(sun);
    };
    
    const addPlanets = (scene, textureLoader, earthRef, moonRef) => {
        const planetData = [
            { name: 'Mercury', texture: mercuryImage, size: 0.6, position: [3, 0, 0] },
            { name: 'Venus', texture: venusImage, size: 0.8, position: [4.5, 0, 0] },
            { name: 'Earth', texture: earthImage, size: 1.0, position: [6, 0, 0], ref: earthRef },
            { name: 'Mars', texture: marsImage, size: 0.7, position: [8, 0, 0] },
            { name: 'Jupiter', texture: jupiterImage, size: 1.5, position: [10, 0, 0] },
            { name: 'Saturn', texture: saturnImage, size: 1.3, position: [12, 0, 0] },
            { name: 'Uranus', texture: uranusImage, size: 1.2, position: [14, 0, 0] },
            { name: 'Neptune', texture: neptuneImage, size: 1.1, position: [16, 0, 0] },
        ];
        
        planetData.forEach(({ name, texture, size, position, ref }) => {
            const planetTexture = textureLoader.load(texture);
            const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
            const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.userData.name = name;
            planet.position.set(...position);
            scene.add(planet);
            if (ref) ref.current = planet; 
            if (name === 'Earth') {
                addMoon(scene, textureLoader, planet);
            }
                    // Logic for Saturn's rings
        
        });
        
    };

    
    const addMoon = (scene, textureLoader, earth) => {
        const moonTexture = textureLoader.load(moonImage);
        const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32); // Size of the moon
        const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.userData.name = 'Moon';
        moonRef.current = moon;
        scene.add(moon);
    };
    
    //return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
    return (
        <>
            <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
            <HoverLabel name={hoveredPlanet} position={hoverPosition} />

            <DetailsPanel body={selectedBody} setSelectedBody={setSelectedBody}/> {/* Render the DetailsPanel */}
        </>
    );
};
export default Orrery;
