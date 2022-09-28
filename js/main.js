const barWidth = 1;
const barMargin = 1;
const barHeightMax = 10;
const width = 15;
const height = 15;
const colors = ["#bcf8fe", "#c11c78", "#9027c7", "#e61a33", "#f7d047"];
const scene = new THREE.Scene();
const barContainer = document.querySelector('.bar-container') 

const camera = new THREE.OrthographicCamera(
  width / -2,
  width / 2,
  height / 2,
  height / -2,
  1,
  1000
);

// Adjust camera position to make the object visable
camera.position.set(0, 3, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: 1 });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
barContainer.appendChild(renderer.domElement);

// Create a color material
const materials = colors.map(
  (color) => new THREE.MeshPhongMaterial({ color: color, flatShading: true })
);

// Add controls to move the camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// ADD DATA
//======================================================================================================//

// Define Data
const data = [
  { cat2: 1, value: 0.1 },
  { cat2: 2, value: 0.4 },
  { cat2: 3, value: 0.2 },
  { cat2: 4, value: 0.15 },
  { cat2: 5, value: 0.25 },
];

// Create Bar
function createBar(i, value, material) {
  // Create a 3d bar
  let geometry = new THREE.BoxGeometry(1, 1, 1);

  // Create torus by combining its geometry with material and add it to the scene
  let bar = new THREE.Mesh(geometry, material);
  bar.castShadow = true; //default is false
  scene.add(bar);

  bar = scaleBar(bar, value);
  bar = positionBar(bar, i, value);
  bar.rotation.y = 0.7;
  console.log(bar);

  return bar;
}

function scaleBar(bar, value) {
  // Scale the bar accorting to the data and global settings
  bar.scale.y = value * barHeightMax;
  bar.scale.x = barWidth;

  return bar;
}

function positionBar(bar, i, value) {
  // Position the bar on x axes by shifting it depending on the index in the data and the defined bar dimensions
  bar.position.x =
    i * (barWidth + barMargin) -
    (data.length / 2) * (barWidth + barMargin) +
    (barWidth + barMargin) / 2;
  bar.position.y += (value * barHeightMax) / 2 - barHeightMax / 2;

  return bar;
}

bars = [];

data.forEach((d, i) => {
  bar = {
    geometry: createBar(i, d.value, materials[d.cat2 - 1]),
    d: d,
    i: i,
  };
  bars.push(bar);
  scene.add(bar.geometry);
});

// ADD LIGHT
//======================================================================================================//

// Create light and add it to the scene

const light = new THREE.DirectionalLight("grey", 1);
light.position.set(0, -2, 50);
scene.add(light);


const spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 100, 100, 100 );

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.add( spotLight );

// ANIMATE
//======================================================================================================//

const animate = () => {
  bar.geometry.rotation.y += 0.01;

  // Render the scene according to the camera settings
  renderer.render(scene, camera);

  // Set up endless repetition/ loop
  requestAnimationFrame(animate);
};

// barContainer.addEventListener('mouseenter', animate)

// Render the scene according to the camera settings
renderer.render(scene, camera);

// Call function to animate in a loop (after 2 seconds)
// setTimeout(function(){ animate(); }, 1000);

// REACT TO RESIZE
//======================================================================================================//

const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

// React to resizing of the browser
window.addEventListener("resize", onResize, false);
