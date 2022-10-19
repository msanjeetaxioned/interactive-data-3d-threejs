const wrapperInteractiveData = document.querySelector(".interactive-data-section > .wrapper");
const canvasContainer = wrapperInteractiveData.querySelector(".canvas-container");

let canvas;

// Setting up Scene, Camera & Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(document.body.clientWidth * 0.85, window.innerHeight * 1.5);
renderer.setClearColor(0xffffff, 0);

canvasContainer.insertBefore(renderer.domElement, canvasContainer.children[0]);
canvas = wrapperInteractiveData.querySelector("canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, (document.body.clientWidth * 0.85) / (window.innerHeight * 1.5) , 1, 1000);

const holder = new THREE.Group();
scene.add(holder);

let movementX = 0,
	currentMovementX = 1,
	mouseXCanvas = 0,
	timer1,
	timer2,
	rotations = [-360, -180, -90, 90, 180, 360];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onMouseMove = (event) => {
	movementX =  event.movementX;
	const rect = event.target.getBoundingClientRect();

	mouseXCanvas = event.clientX - rect.left;
	const mouseYCanvas = event.clientY - rect.top;

	mouse.x = (mouseXCanvas / rect.width) * 2 - 1;
	mouse.y = -(mouseYCanvas / rect.height) * 2 + 1;
}
	
canvas.addEventListener('mousemove', onMouseMove, false);

const options = {threshold: 0.5};

const handleIntersect = (entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			observer.unobserve(entry.target);
		}
	});
}

const observer = new IntersectionObserver(handleIntersect, options);
observer.observe(canvas);

// const axesHelper = new THREE.AxesHelper(15);
// holder.add(axesHelper);

// const orbit = new THREE.OrbitControls(camera, renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 0.5); // dim white light
holder.add(light);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(1, 0, 0);
scene.add(directionalLight1);

const graphXNames = ["design", "engineering", "product", "writing", "marketing", "social"];
const graphXValues = [3, 2, 3, 3, 4, 4];

let firstTime = true;

let bars = [];
let barsHeight = [];

const calculateBarsHeightAndAddThemInScene = () => {
	// Cubes
	const barColor = 0x4a39ea;
	const barMaxHeight = 12;
	let xPos = -15;
	let maxValue = graphXValues[0];
	const individualBarHeight = barMaxHeight / maxValue;

	for (let i = 1; i < graphXValues.length; i++) {
		if (graphXValues[i] > maxValue) {
			maxValue = graphXValues[i];
		}
	}

	for (let i = 0; i < graphXNames.length; i++) {
		bars[i] = [];
		for (let j = 0; j < graphXValues[i]; j++) {
			const geometryBar = new THREE.BoxGeometry(2.5, individualBarHeight, 2.5);
			geometryBar.translate( 0, individualBarHeight / 2, 0 );
			const materialBar = new THREE.MeshPhongMaterial({
				color: barColor,
				emissive: 0x000000,
				specular: 0x111111,
				shininess: 100,
				reflectivity: 1,
				refractionRatio: 0.98,
				combine: THREE.MultiplyOperation,
				side: THREE.DoubleSide
			});
			bars[i][j] = new THREE.Mesh(geometryBar, materialBar);
			bars[i][j].position.x = xPos;
			
			if (j == 0 ) {
				bars[i][j].position.y = 0;
			} else {
				bars[i][j].position.y = (individualBarHeight + 0.3) * j;
			}

			bars[i][j].rotation.y = Math.PI / 4;
			holder.add(bars[i][j]);

			if (i == (graphXNames.length - 1) && j == (graphXValues[i] - 1)) {
				const timer = setTimeout(() => {
					clearTimeout(timer);
					appendGraphXValues();
				}, 200);
			}
		}
		xPos = xPos + 6;
	}
}

calculateBarsHeightAndAddThemInScene();

camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.position.y = 0;
camera.position.z = 60;
// orbit.update();

let rotationTl = [], currentRotationSpeedAndDirectionOfBars = [];
for (let i = 0; i < bars.length; i++) {
	currentRotationSpeedAndDirectionOfBars[i] = [];
	rotationTl[i] = [];
	for (let j = 0; j < bars[i].length; j++) {
		currentRotationSpeedAndDirectionOfBars[i][j] = 0;
		rotationTl[i][j] = gsap.timeline();
	}
}

const rotateBar = (cube, currentBarTL, currentBarRotation) => {
	if (!currentBarTL.isActive() && movementX != currentMovementX) {
		currentMovementX = movementX;
		if (currentMovementX < -25) {
			currentBarRotation = rotations[0];
			// rotate bar -(360 + 30) degrees ie. -390 degrees
			currentBarTL.to(cube.rotation, {y: "-=6.806784083", ease: "none", duration: 1})
			// rotate back the extra 30 degrees added previously for getting the effect on site
				.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
		} else if (currentMovementX < -15) {
			currentBarRotation = rotations[1];
			// rotate bar -(180 + 30) degrees ie. -210 degrees
			currentBarTL.to(cube.rotation, {y: "-=3.66519143", ease: "none", duration: 0.75})
				.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
		} else if (currentMovementX < 0) {
			if (currentBarRotation == rotations[2]) {
				if (!timer1) {
					timer1 = setTimeout(() => {
						clearTimeout(timer1);
						// rotate bar -(90 + 30) degrees ie. -120 degrees
						currentBarTL.to(cube.rotation, {y: "-=2.094395103", ease: "none", duration: 0.5})
							.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
					}, 500);
				}
			} else {
				currentBarRotation = rotations[2];
				currentBarTL.to(cube.rotation, {y: "-=2.094395103", ease: "none", duration: 0.5})
					.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
			}
		} else if (currentMovementX == 0) {
			currentBarTL.clear();
		} else if (currentMovementX <= 15) {
			if (currentBarRotation == rotations[3]) {
				if (!timer2) {
					timer2 = setTimeout(() => {
						clearTimeout(timer2);
						currentBarTL.to(cube.rotation, {y: "+=2.094395103", ease: "none", duration: 0.5})
							.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
					}, 500);
				}
			} else {
				currentBarRotation = rotations[3];
				currentBarTL.to(cube.rotation, {y: "+=2.094395103", ease: "none", duration: 0.5})
					.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
			}
		} else if (currentMovementX <= 25) {
			currentBarRotation = rotations[4];
			currentBarTL.to(cube.rotation, {y: "+=3.66519143", ease: "none", duration: 0.75})
				.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
		} else {
			currentBarRotation = rotations[5];
			currentBarTL.to(cube.rotation, {y: "+=6.806784083", ease: "none", duration: 1})
				.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
		}
	}
}

const scale = (number, inMin, inMax, outMin, outMax) => {
	return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const canvasDistanceFromTop = window.pageYOffset + canvas.getBoundingClientRect().top;
const canvasVisibleMin =  canvasDistanceFromTop - window.innerHeight;
const canvasVisibleMax = canvasVisibleMin + canvas.getBoundingClientRect().height;
let currentWindowY = undefined;

// Sets Vertical rotation of bars based on scroll position 
const setRotationAngleOfBarsBasedOnScrollPosition = () => {
	let windowY;
	if (currentWindowY != undefined) {
		windowY = currentWindowY;
	} else {
		windowY = undefined;
	}
	currentWindowY = window.scrollY - canvasVisibleMin;

	if (currentWindowY != windowY && windowY != undefined) {
		if (currentWindowY >= 0 && currentWindowY <= canvasVisibleMax) {
			const percent = Math.round(currentWindowY / canvasVisibleMax * 100);
			if (percent >= 25 && percent <= 90) {
				camera.position.y = scale(percent, 25, 90, 18, -9);
				camera.lookAt(0, 0, 0);
			}
		}
	}
}

// For tilting graph based on left-right position of mouse cursor
const tiltGraphBasedOnMouseXPosition = () => {
	const percent = Math.round(mouseXCanvas / canvas.getBoundingClientRect().width * 100);
	// Tilts graph by 4 degrees both directions based on mouse x position
	const newY = scale(percent, 0, 100, 0.06981317, -0.06981317);
	if (holder.rotation.y != newY) {
		holder.rotation.y = newY;
	}
}

let barWidthInHTMLCordinates;

// Calculates & returns html coordinates of a given bar of graph
function calculateCoordinatesOfBarInCanvas(i, yPos, appendToTopOrBottom = "top") {
	const vector = new THREE.Vector3(bars[i][0].position.x - 1.7, yPos, bars[i][0].position.z);

	vector.project(camera);
	vector.x = (vector.x + 1) * canvas.getBoundingClientRect().width / 2;
	vector.y =  - (vector.y - 1) * canvas.getBoundingClientRect().height / 2;

	const x = vector.x;

	if (!barWidthInHTMLCordinates) {
		const vector2 = new THREE.Vector3(bars[i][0].position.x + 1.7, yPos, bars[i][0].position.z);
		vector2.project(camera);
		vector2.x = (vector2.x + 1) * canvas.getBoundingClientRect().width / 2;
		const x2 = vector2.x;
		barWidthInHTMLCordinates = x2 - x;
	}

	let y;
	if (appendToTopOrBottom == "top") {
		y = vector.y - 70;
	} else if (appendToTopOrBottom == "bottom") {
		y = vector.y + 50;
	}
	return {x, y};
}

// Appends values of x-axis of the graph at proper position
function appendGraphXValues() {
	for (let i = 0; i < graphXNames.length; i++) {
		const obj = calculateCoordinatesOfBarInCanvas(i, bars[i][0].position.y, "bottom");

		const div = document.createElement("div");
		div.classList.add("graph-x");
		div.style.left = obj.x + "px";
		div.style.top = obj.y + "px";

		const span1 = document.createElement("span");
		span1.classList.add("graph-x-name");
		span1.innerText = graphXNames[i];
		div.append(span1);

		const span2 = document.createElement("span");
		span2.classList.add("graph-x-value");
		span2.innerText = graphXValues[i];
		div.append(span2);

		canvasContainer.append(div);

		const xDiffBy2 = (div.getBoundingClientRect().width - barWidthInHTMLCordinates) / 2;
		div.style.left = (div.offsetLeft - xDiffBy2) + "px";
	}
}

const animate = () => {
	requestAnimationFrame(animate);
	raycaster.setFromCamera(mouse, camera);

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects(holder.children);

	if (intersects.length == 2) {
		for (let i = 0; i < bars.length; i++) {
			for (let j = 0; j < bars[i].length; j++) {
				if (bars[i][j].uuid == intersects[0].object.uuid) {
					rotateBar(bars[i][j], rotationTl[i][j], currentRotationSpeedAndDirectionOfBars[i][j]);
				}
			}
		}
	}
	setRotationAngleOfBarsBasedOnScrollPosition();
	tiltGraphBasedOnMouseXPosition();
	renderer.render(scene, camera);
}
animate();