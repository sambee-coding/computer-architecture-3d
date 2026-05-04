import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { createPopup } from './ui/popup.js';
import './style.css';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Renderer setup
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Label Renderer
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Popup System
const popup = createPopup();

// Raycaster setup for interactivity
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// CPU Placeholder (Cube)
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material = new THREE.MeshStandardMaterial({ 
  color: 0x00ffcc,
  metalness: 0.7,
  roughness: 0.2,
  emissive: 0x00ffcc,
  emissiveIntensity: 0.2
});
const cpu = new THREE.Mesh(geometry, material);
cpu.name = 'cpu';
scene.add(cpu);

// CPU Label
const cpuDiv = document.createElement('div');
cpuDiv.className = 'label cpu-label';
cpuDiv.textContent = 'CPU';
const cpuLabel = new CSS2DObject(cpuDiv);
cpuLabel.position.set(0, 1.2, 0);
cpu.add(cpuLabel);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ffcc, 10, 50);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xff00ff, 5, 50);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// Grid Helper
const gridHelper = new THREE.GridHelper(20, 20, 0x333333, 0x111111);
gridHelper.position.y = -1;
scene.add(gridHelper);

// RAM Modules Group
const ramGroup = new THREE.Group();
const ramGeometry = new THREE.BoxGeometry(0.15, 0.8, 2.5);
const ramMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xff00ff,
  metalness: 0.8,
  roughness: 0.2,
  emissive: 0xff00ff,
  emissiveIntensity: 0.2
});

for (let i = 0; i < 4; i++) {
  const ramStick = new THREE.Mesh(ramGeometry, ramMaterial);
  ramStick.position.x = 2 + (i * 0.4);
  ramStick.position.y = -0.2;
  ramStick.name = 'ram';
  ramGroup.add(ramStick);
  
  if (i === 0) {
    const ramDiv = document.createElement('div');
    ramDiv.className = 'label ram-label';
    ramDiv.textContent = 'RAM';
    const ramLabel = new CSS2DObject(ramDiv);
    ramLabel.position.set(0, 0.6, 0);
    ramStick.add(ramLabel);
  }
}
scene.add(ramGroup);

// GPU Component
const gpuGeometry = new THREE.BoxGeometry(4, 0.5, 2);
const gpuMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x3366ff,
  metalness: 0.9,
  roughness: 0.1,
  emissive: 0x3366ff,
  emissiveIntensity: 0.2
});
const gpu = new THREE.Mesh(gpuGeometry, gpuMaterial);
gpu.position.set(0, -0.4, -4);
gpu.name = 'gpu';
scene.add(gpu);

const gpuDiv = document.createElement('div');
gpuDiv.className = 'label gpu-label';
gpuDiv.textContent = 'GPU';
const gpuLabel = new CSS2DObject(gpuDiv);
gpuLabel.position.set(0, 0.6, 0);
gpu.add(gpuLabel);

// SSD Component
const ssdGeometry = new THREE.BoxGeometry(1, 0.1, 1.5);
const ssdMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.5 });
const ssd = new THREE.Mesh(ssdGeometry, ssdMaterial);
ssd.position.set(-4, -0.8, 2);
ssd.name = 'ssd';
scene.add(ssd);

const ssdDiv = document.createElement('div');
ssdDiv.className = 'label ssd-label';
ssdDiv.textContent = 'NVMe SSD';
const ssdLabel = new CSS2DObject(ssdDiv);
ssdLabel.position.set(0, 0.2, 0);
ssd.add(ssdLabel);

// Data Buses (Tubes)
const createBus = (start, end, color) => {
  const points = [];
  points.push(new THREE.Vector3(start.x, start.y, start.z));
  points.push(new THREE.Vector3(end.x, start.y, start.z)); // Corner
  points.push(new THREE.Vector3(end.x, end.y, end.z));
  
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
  const material = new THREE.MeshStandardMaterial({ 
    color: color, 
    emissive: color, 
    emissiveIntensity: 1,
    transparent: true,
    opacity: 0.6
  });
  return new THREE.Mesh(geometry, material);
};

const busCpuRam = createBus(cpu.position, new THREE.Vector3(2, -0.2, 0), 0x00ffcc);
scene.add(busCpuRam);

const busCpuGpu = createBus(cpu.position, gpu.position, 0x3366ff);
scene.add(busCpuGpu);

// Data Particles System
const particles = [];
class DataBit {
  constructor(start, end, color) {
    const geom = new THREE.SphereGeometry(0.05, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: color });
    this.mesh = new THREE.Mesh(geom, mat);
    this.start = start.clone();
    this.end = end.clone();
    this.progress = 0;
    this.speed = 0.01 + Math.random() * 0.02;
    this.mesh.position.copy(this.start);
    scene.add(this.mesh);
  }

  update() {
    this.progress += this.speed;
    if (this.progress > 1) {
      this.progress = 0;
      this.mesh.position.copy(this.start);
    } else {
      // Linear interpolation between start and end
      this.mesh.position.lerpVectors(this.start, this.end, this.progress);
    }
  }
}

// Function to spawn a burst of data
const spawnDataBurst = (start, end, color, count = 10) => {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      particles.push(new DataBit(start, end, color));
    }, i * 100);
  }
};

// Initial particles for visual flow
spawnDataBurst(new THREE.Vector3(2, -0.2, 0), cpu.position, 0x00ffcc, 5);
spawnDataBurst(cpu.position, gpu.position, 0x3366ff, 5);

// Handle window resize
window.addEventListener('resize', () => {
  // Update sizes
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Update camera
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(width, height);
  labelRenderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Cursor hover feedback
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }
});

// Click handler
window.addEventListener('click', (event) => {
  // Calculate mouse position in normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    // Walk up the tree to find a named parent if the specific geometry isn't named
    let current = object;
    while (current && !current.name) {
      current = current.parent;
    }
    
    if (current && current.name) {
      popup.show(current.name);
    }
  }
});

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Rotate CPU placeholder
  cpu.rotation.x += 0.01;
  cpu.rotation.y += 0.01;

  // Subtle pulse effect for CPU
  const time = Date.now() * 0.001;
  cpu.position.y = Math.sin(time) * 0.2;
  cpu.material.emissiveIntensity = 0.2 + Math.sin(time * 2) * 0.1;

  // Pulse effect for RAM modules
  ramGroup.children.forEach((ram, index) => {
    const pulse = Math.sin(time * 3 + index * 0.5);
    ram.material.emissiveIntensity = 0.2 + Math.max(0, pulse) * 0.5;
    // Slight jitter to simulate data flow
    ram.position.y = -0.2 + Math.max(0, pulse) * 0.02;
  });

  // Bus animation
  busCpuRam.material.emissiveIntensity = 0.5 + Math.sin(time * 10) * 0.5;
  busCpuGpu.material.emissiveIntensity = 0.5 + Math.cos(time * 8) * 0.5;

  // Update particles
  particles.forEach(p => p.update());

  // Update Dashboard stats with subtle variation
  if (Math.random() > 0.95) {
    const cpuTemp = document.getElementById('cpu-temp');
    const ramUtil = document.getElementById('ram-util');
    const busSpeed = document.getElementById('bus-speed');
    
    if (cpuTemp) cpuTemp.textContent = (40 + Math.sin(time) * 5).toFixed(1);
    if (ramUtil) ramUtil.textContent = (14 + Math.cos(time * 0.5) * 0.5).toFixed(1);
    if (busSpeed) busSpeed.textContent = Math.floor(5000 + Math.random() * 50);
  }

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
};

animate();
