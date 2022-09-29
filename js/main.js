const body = document.querySelector("body");
const wrapperInteractiveData = body.querySelector(".interactive-data-section > .wrapper");
let canvas;

// Setting up Scene, Camera & Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.85, window.innerHeight * 0.85);
wrapperInteractiveData.appendChild(renderer.domElement);
canvas = wrapperInteractiveData.querySelector("canvas");

// const orbit = new THREE.OrbitControls(camera, renderer.domElement);

const light = new THREE.AmbientLight( 0xffffff, 0.5 ); // dim white light
scene.add( light );

const directionalLight1 = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight1.position.set(1, 0, 0);
scene.add(directionalLight1);

// Cube
const geometry = new THREE.BoxGeometry(2.5, 15, 2.5);
const material = new THREE.MeshPhongMaterial({
    color: 0xffd700,
	emissive: 0x000000,
	specular: 0x111111,
	shininess: 100,
	reflectivity: 1,
	refractionRatio: 0.98,
	combine: THREE.MultiplyOperation,
	side: THREE.DoubleSide
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 30;
// orbit.update();
cube.rotation.y = Math.PI / 4;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const rotation = gsap.timeline();

let movementX = 0, 
    currentMovementX = 1;

const giveRotationDegreeAndSpeedAndDirection = () => {
    // console.log(cube.rotation.y);
    if(!rotation.isActive() && movementX != currentMovementX) {
        currentMovementX = movementX;
        console.log(currentMovementX);
        if(currentMovementX < -25) {
            rotation.to(cube.rotation, {y: "-=6.283185307", ease: "none", duration: 1});
        } else if(currentMovementX < -15) {
            rotation.to(cube.rotation, {y: "-=3.141592654", ease: "none", duration: 1});
        } else if(currentMovementX < 0) {
            rotation.to(cube.rotation, {y: "-=1.570796327", ease: "none", duration: 1});
        } else if (currentMovementX == 0) {
            rotation.clear();
        } else if (currentMovementX <= 15) {
            rotation.to(cube.rotation, {y: "+=1.570796327", ease: "none", duration: 1});
        } else if (currentMovementX <= 25) {
            rotation.to(cube.rotation, {y: "+=3.141592654", ease: "none", duration: 1});
        } else {
            rotation.to(cube.rotation, {y: "+=6.283185307", ease: "none", duration: 1});
        }
    }
}

function animate() {
	requestAnimationFrame(animate);
	raycaster.setFromCamera(mouse, camera);

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects(scene.children);

	if (intersects.length > 0) {
        giveRotationDegreeAndSpeedAndDirection();
	}
	renderer.render(scene, camera);
}
animate();

function onMouseMove(event) {
	movementX =  event.movementX;
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
  
canvas.addEventListener('mousemove', onMouseMove, false);