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
    if(!rotation.isActive() && movementX != currentMovementX) {
        currentMovementX = movementX;
        if(currentMovementX > 10) {
            currentMovementX = 10;
        } else if (currentMovementX < -10) {
            currentMovementX = -10;
        }
        console.log(currentMovementX);
        switch(currentMovementX) {
            case -10:
            case -9: 
            case -8: rotation.to(cube.rotation, {y: "-=6.26573", ease: "none", duration: 1});
                    break;
            case -7:
            case -6:
            case -5: rotation.to(cube.rotation, {y: "-=3.132865", ease: "none", duration: 1});
                    break;
            case -4:
            case -3:
            case -2:
            case -1: rotation.to(cube.rotation, {y: "-=1.5664325", ease: "none", duration: 1});
                    break;
            case 0: break;
            case 1:
            case 2: 
            case 3:
            case 4: rotation.to(cube.rotation, {y: "+=1.5664325", ease: "none", duration: 1})
                    break;
            case 5:
            case 6: 
            case 7: rotation.to(cube.rotation, {y: "+=3.132865", ease: "none", duration: 1});
                    break;
            case 8:
            case 9:
            case 10: rotation.to(cube.rotation, {y: "+=6.26573", ease: "none", duration: 1});
                    break;
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